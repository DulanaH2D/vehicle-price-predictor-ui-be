from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
import os

app = Flask(__name__)

# Load model and features on startup
try:
    model = joblib.load('vehicle_price_model.pkl')
    model_features = joblib.load('model_features.pkl')
    MODEL_LOADED = True 
    print("✓ Model files loaded successfully!")
except FileNotFoundError:
    MODEL_LOADED = False
    print("❌ Model files not found. Please train your model first.")
except ModuleNotFoundError as e:
    MODEL_LOADED = False
    print(f"❌ Module error: {e}")
    print("This usually indicates a scikit-learn version mismatch.")
    print("Try: pip install --upgrade scikit-learn")
except Exception as e:
    MODEL_LOADED = False
    print(f"❌ Error loading model: {e}")

# Dropdown options based on your data
MODEL_OPTIONS = {
    'aqua': 'Toyota Aqua',
    'vitz': 'Toyota Vitz', 
    'premio': 'Toyota Premio',
    'corolla': 'Toyota Corolla',
    'prius': 'Toyota Prius',
    'chr': 'Toyota CHR',
    'axio': 'Toyota Axio',
    'fortuner': 'Toyota Fortuner',
    'wigo': 'Toyota Wigo',
    'voxy': 'Toyota Voxy',
    'hilux': 'Toyota Hilux',
    'harrier': 'Toyota Harrier',
    'yaris': 'Toyota Yaris',
    'avanza': 'Toyota Avanza',
    'allion': 'Toyota Allion',
    'belta': 'Toyota Belta',
    'passo': 'Toyota Passo',
    'camry': 'Toyota Camry'
}

TRANSMISSION_OPTIONS = {
    'automatic': 'Automatic',
    'tiptronic': 'Tiptronic',
    'manual': 'Manual'
}

BODY_TYPE_OPTIONS = {
    'hatchback': 'Hatchback',
    'saloon': 'Saloon',
    'suv/4x4': 'SUV/4x4',
    'mpv': 'MPV',
    'station_wagon': 'Station Wagon',
    'sedan': 'Sedan'
}

FUEL_TYPE_OPTIONS = {
    'hybrid': 'Hybrid',
    'petrol': 'Petrol',
    'diesel': 'Diesel'
}

# Common engine capacities
ENGINE_CAPACITY_OPTIONS = [
    '660', '800', '1000', '1200', '1300', '1400', '1500', 
    '1600', '1800', '2000', '2200', '2400', '2500', '2700', '3000'
]

@app.route('/')
def home():
    current_year = datetime.now().year
    years = list(range(current_year, 1999, -1))
    
    return render_template('index.html',
                         models=MODEL_OPTIONS,
                         transmissions=TRANSMISSION_OPTIONS,
                         body_types=BODY_TYPE_OPTIONS,
                         fuel_types=FUEL_TYPE_OPTIONS,
                         engine_capacities=ENGINE_CAPACITY_OPTIONS,
                         years=years,
                         model_loaded=MODEL_LOADED)

@app.route('/predict', methods=['POST'])
def predict():
    if not MODEL_LOADED:
        return jsonify({
            'success': False,
            'error': 'Model not loaded. Please ensure model files are present.'
        })
    
    try:
        # Get form data
        data = request.json
        
        vehicle_model = data['model']
        year_of_manufacture = int(data['year'])
        transmission = data['transmission']
        body_type = data['body_type']
        fuel_type = data['fuel_type']
        engine_capacity = data['engine_capacity']
        mileage = float(data['mileage'])
        
        # Calculate derived features
        current_year = datetime.now().year
        vehicle_age = current_year - year_of_manufacture
        
        if vehicle_age <= 0:
            return jsonify({
                'success': False,
                'error': 'Please select a valid year of manufacture.'
            })
        
        mileage_per_year = mileage / vehicle_age if vehicle_age > 0 else mileage
        
        # Create input dataframe
        input_data = pd.DataFrame([{
            'year_of_manufacture': year_of_manufacture,
            'engine_capacity': str(engine_capacity).lower(),
            'mileage': mileage,
            'vehicle_age': vehicle_age,
            'mileage_per_year': mileage_per_year,
            'model': vehicle_model.lower().replace(' ', '_'),
            'transmission': transmission.lower().replace(' ', '_'),
            'body_type': body_type.lower().replace(' ', '_'),
            'fuel_type': fuel_type.lower().replace(' ', '_'),
        }])
        
        # One-hot encode
        input_encoded = pd.get_dummies(input_data, 
                                     columns=['model', 'transmission', 'body_type', 'fuel_type'],
                                     dtype=int)
        
        # Add missing columns with 0
        for col in model_features:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        
        # Ensure column order matches training data
        input_encoded = input_encoded[model_features]
        
        # Make prediction
        predicted_price = model.predict(input_encoded)[0]
        
        # Format the response
        result = {
            'success': True,
            'predicted_price': f"Rs. {predicted_price:,.0f}",
            'details': {
                'model': MODEL_OPTIONS.get(vehicle_model, vehicle_model),
                'year': year_of_manufacture,
                'transmission': TRANSMISSION_OPTIONS.get(transmission, transmission),
                'body_type': BODY_TYPE_OPTIONS.get(body_type, body_type),
                'fuel_type': FUEL_TYPE_OPTIONS.get(fuel_type, fuel_type),
                'engine_capacity': f"{engine_capacity}cc",
                'mileage': f"{mileage:,.0f} km",
                'vehicle_age': f"{vehicle_age} years",
                'mileage_per_year': f"{mileage_per_year:,.0f} km/year"
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/model-info')
def model_info():
    return jsonify({
        'model_loaded': MODEL_LOADED,
        'models_available': list(MODEL_OPTIONS.keys()),
        'transmissions_available': list(TRANSMISSION_OPTIONS.keys()),
        'body_types_available': list(BODY_TYPE_OPTIONS.keys()),
        'fuel_types_available': list(FUEL_TYPE_OPTIONS.keys()),
        'engine_capacities_available': ENGINE_CAPACITY_OPTIONS
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)