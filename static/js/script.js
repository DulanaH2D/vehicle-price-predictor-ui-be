// Global variables for DOM elements
let resultsSection, errorDisplay;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements and store globally
    const form = document.getElementById('predictionForm');
    resultsSection = document.getElementById('results');
    errorDisplay = document.getElementById('errorDisplay');
    const errorMessage = document.getElementById('errorMessage');
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous results and errors
        resultsSection.style.display = 'none';
        errorDisplay.style.display = 'none';
        
        // Get form data
        const formData = {
            model: document.getElementById('model').value,
            year: document.getElementById('year').value,
            transmission: document.getElementById('transmission').value,
            body_type: document.getElementById('body_type').value,
            fuel_type: document.getElementById('fuel_type').value,
            engine_capacity: document.getElementById('engine_capacity').value,
            mileage: document.getElementById('mileage').value.replace(/,/g, '') // Remove commas
        };
        
        // Validate form data
        if (!validateForm(formData)) {
            showError('Please fill in all fields correctly.');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-primary');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        
        try {
            // Send prediction request
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Display results
                displayResults(data);
            } else {
                showError(data.error || 'An error occurred during prediction.');
            }
        } catch (error) {
            showError('Network error. Please check your connection and try again.');
            console.error('Prediction error:', error);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
    
    // Add input validation for mileage
    const mileageInput = document.getElementById('mileage');
    mileageInput.addEventListener('input', function(e) {
        // Remove any non-numeric characters except commas for display
        let value = e.target.value.replace(/[^0-9,]/g, '');
        
        // Remove commas to get actual number
        let numericValue = value.replace(/,/g, '');
        
        // Limit to reasonable max value
        if (parseInt(numericValue) > 500000) {
            numericValue = '500000';
        }
        
        // Don't format while typing, just store clean number
        e.target.value = numericValue;
    });
    
    // Add change event listeners for dynamic updates
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            // Clear error when user makes changes
            errorDisplay.style.display = 'none';
        });
    });
});

// Validate form data
function validateForm(data) {
    // Check if all fields are filled
    for (const key in data) {
        if (!data[key] || data[key] === '') {
            return false;
        }
    }
    
    // Validate mileage (remove commas first)
    const mileage = parseInt(data.mileage.toString().replace(/,/g, ''));
    if (isNaN(mileage) || mileage < 0 || mileage > 500000) {
        return false;
    }
    
    // Validate year
    const year = parseInt(data.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 2000 || year > currentYear) {
        return false;
    }
    
    return true;
}

// Display prediction results
function displayResults(data) {
    // Update price
    document.getElementById('predictedPrice').textContent = data.predicted_price;
    
    // Create details HTML
    const detailsContainer = document.getElementById('vehicleDetails');
    detailsContainer.innerHTML = '';
    
    const details = data.details;
    const detailItems = [
        { label: 'Model', value: details.model },
        { label: 'Year', value: details.year },
        { label: 'Transmission', value: details.transmission },
        { label: 'Body Type', value: details.body_type },
        { label: 'Fuel Type', value: details.fuel_type },
        { label: 'Engine', value: details.engine_capacity },
        { label: 'Mileage', value: details.mileage },
        { label: 'Vehicle Age', value: details.vehicle_age },
        { label: 'Avg Yearly Usage', value: details.mileage_per_year }
    ];
    
    detailItems.forEach(item => {
        const detailDiv = document.createElement('div');
        detailDiv.className = 'detail-item';
        detailDiv.innerHTML = `
            <div class="detail-label">${item.label}</div>
            <div class="detail-value">${item.value}</div>
        `;
        detailsContainer.appendChild(detailDiv);
    });
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add animation class
    resultsSection.classList.remove('slideInUp');
    void resultsSection.offsetWidth; // Trigger reflow
    resultsSection.classList.add('slideInUp');
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorDisplay.style.display = 'block';
    errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Reset form and results
function resetForm() {
    // Reset form
    document.getElementById('predictionForm').reset();
    
    // Hide results and errors
    resultsSection.style.display = 'none';
    errorDisplay.style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to form inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Improved mileage input handling - no formatting for number inputs
    const mileageInput = document.getElementById('mileage');
    
    // For number inputs, ensure clean numeric values only
    if (mileageInput) {
        mileageInput.addEventListener('input', function() {
            // Remove any commas that might have been pasted
            const value = this.value.replace(/,/g, '');
            if (this.value !== value) {
                this.value = value;
            }
        });
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press Enter to submit when form is filled
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = document.getElementById('predictionForm');
        const formData = new FormData(form);
        let allFilled = true;
        
        for (let [key, value] of formData) {
            if (!value) {
                allFilled = false;
                break;
            }
        }
        
        if (allFilled) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Press Escape to clear errors
    if (e.key === 'Escape') {
        if (errorDisplay) {
            errorDisplay.style.display = 'none';
        }
    }
});

// Check model availability on page load
window.addEventListener('load', async function() {
    try {
        const response = await fetch('/api/model-info');
        const data = await response.json();
        
        if (!data.model_loaded) {
            console.warn('Model not loaded on server');
            // Disable submit button if model not loaded
            const submitBtn = document.querySelector('.btn-primary');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.title = 'Model not loaded. Please check server configuration.';
            }
        }
    } catch (error) {
        console.error('Failed to check model status:', error);
    }
});