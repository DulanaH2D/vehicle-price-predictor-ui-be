# Vehicle Price Prediction Web Application

A Flask-based web application for predicting vehicle prices using machine learning.

## 📁 Project Structure

```
vehicle-price-predictor/
│
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── vehicle_price_model.pkl     # Trained ML model (generated from your ML script)
├── model_features.pkl          # Model features list (generated from your ML script)
│
├── templates/
│   └── index.html             # Main HTML template
│
└── static/
    ├── css/
    │   └── style.css          # Stylesheet
    └── js/
        └── script.js          # JavaScript functionality
```

## 🚀 Setup Instructions

### 1. Create Project Directory

```bash
mkdir vehicle-price-predictor
cd vehicle-price-predictor
```

### 2. Create Folder Structure

```bash
mkdir templates
mkdir -p static/css
mkdir -p static/js
```

### 3. Save Files

Save each file in its respective location:
- `app.py` in the root directory
- `index.html` in `templates/`
- `style.css` in `static/css/`
- `script.js` in `static/js/`
- `requirements.txt` in the root directory

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Generate Model Files

Run your ML training script (the one you provided) to generate:
- `vehicle_price_model.pkl`
- `model_features.pkl`

Copy these files to the root directory of your Flask application.

### 6. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## 🎯 Features

- **Interactive UI**: Modern, responsive design with gradient backgrounds and smooth animations
- **Dropdown Menus**: All categorical features use dropdown menus for easy selection
- **Real-time Validation**: Form validation with helpful error messages
- **Price Prediction**: Get instant price predictions based on vehicle details
- **Detailed Results**: View comprehensive details about the prediction
- **Model Status**: Real-time model loading status indicator

## 📊 Available Options

### Vehicle Models (18 options)
- Toyota Aqua, Vitz, Premio, Corolla, Prius, CHR, Axio, Fortuner, Wigo, Voxy, Hilux, Harrier, Yaris, Avanza, Allion, Belta, Passo, Camry

### Transmission Types (3 options)
- Automatic, Tiptronic, Manual

### Body Types (6 options)
- Hatchback, Saloon, SUV/4x4, MPV, Station Wagon, Sedan

### Fuel Types (3 options)
- Hybrid, Petrol, Diesel

### Engine Capacities
- 660cc to 3000cc (common sizes)

## 🔧 API Endpoints

### `GET /`
Main page with the prediction form

### `POST /predict`
Endpoint for price prediction
- **Request Body**: JSON with vehicle details
- **Response**: JSON with predicted price and details

### `GET /api/model-info`
Get information about available models and options

## 🎨 UI Features

- **Gradient backgrounds** with animated patterns
- **Glassmorphism effects** for modern look
- **Smooth animations** and transitions
- **Responsive design** for all devices
- **Loading states** for better UX
- **Error handling** with clear messages

## 📝 Notes

1. Ensure the model files (`vehicle_price_model.pkl` and `model_features.pkl`) are in the root directory
2. The application will show a warning if model files are not found
3. All inputs are validated before sending to the model
4. The UI automatically formats numbers for better readability

## 🔍 Troubleshooting

### Model Not Loading
- Check if `vehicle_price_model.pkl` and `model_features.pkl` exist in the root directory
- Ensure the files were generated using compatible scikit-learn/joblib versions

### Port Already in Use
- Change the port in `app.py`: `app.run(debug=True, port=5001)`

### Dependencies Issues
- Create a virtual environment:
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

## 🚦 Development Mode

The application runs in debug mode by default. For production:
1. Set `debug=False` in `app.py`
2. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn app:app
   ```

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🎉 Ready to Use!

Your vehicle price prediction application is now ready. Open your browser and navigate to `http://localhost:5000` to start predicting vehicle prices!
