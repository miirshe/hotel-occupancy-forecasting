from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load the models
rf_model_cancel = joblib.load('./models/rf_model_cancel.pkl')
rf_model_book = joblib.load('./models/rf_model_book.pkl')

# Load the saved essential feature names
with open('./models/essential_feature_names.txt', 'r') as f:
    essential_features = f.read().splitlines()

# Function to extract date features
def extract_date_features(check_in_date, check_out_date):
    # Convert dates to datetime
    check_in = pd.to_datetime(check_in_date)
    check_out = pd.to_datetime(check_out_date)
    
    # Create a DataFrame with all dates in the range
    date_range = pd.date_range(start=check_in, end=check_out, freq='D')
    
    features_list = []
    for date in date_range:
        features_list.append({
            'check_in_year': date.year,
            'check_in_month': date.month,
            'check_in_day': date.day,
            'check_in_dayofweek': date.dayofweek,
            'check_in_is_weekend': date.dayofweek >= 5,
            'check_out_year': date.year,
            'check_out_month': date.month,
            'check_out_day': date.day,
            'check_out_dayofweek': date.dayofweek,
            'check_out_is_weekend': date.dayofweek >= 5,
            'days': (check_out - check_in).days,
            'month': date.month,
            'year': date.year
        })
    
    return pd.DataFrame(features_list)

# Function to convert keys to strings
def convert_keys_to_strings(input_dict):
    return {str(key): value for key, value in input_dict.items()}

# Endpoint for predicting cancellations and bookings
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    check_in_date = data['check_in_date']
    check_out_date = data['check_out_date']
    
    # Extract features from input dates
    input_df = extract_date_features(check_in_date, check_out_date)
    
    # Scale the input data
    scaler = StandardScaler()
    scaled_input_df = pd.DataFrame(scaler.fit_transform(input_df), columns=input_df.columns)
    
    # Ensure the columns are in the same order as during training
    scaled_input_df = scaled_input_df[essential_features]
    
    # Predict cancellations
    scaled_input_df['predicted_cancellation'] = rf_model_cancel.predict(scaled_input_df)
    
    # Prepare booking input data
    booking_input_df = scaled_input_df[essential_features]
    
    # Predict bookings
    booking_input_df['predicted_booking'] = rf_model_book.predict(booking_input_df)
    
    # Add year, month, and day columns to both DataFrames
    input_df['year'] = input_df['check_in_year']
    input_df['month'] = input_df['check_in_month']
    input_df['day'] = input_df['check_in_day']
    scaled_input_df['year'] = input_df['check_in_year']
    scaled_input_df['month'] = input_df['check_in_month']
    scaled_input_df['day'] = input_df['check_in_day']
    booking_input_df['year'] = input_df['check_in_year']
    booking_input_df['month'] = input_df['check_in_month']
    booking_input_df['day'] = input_df['check_in_day']
    
    # Summarize the results for different time frames
    def summarize_results(input_df, prediction_column):
        yearly = input_df.groupby('year')[prediction_column].sum()
        monthly = input_df.groupby(['year', 'month'])[prediction_column].sum()
        daily = input_df.groupby(['year', 'month', 'day'])[prediction_column].sum()
        per_month = input_df.groupby('month')[prediction_column].sum()
        return {
            "yearly": convert_keys_to_strings(yearly.to_dict()),
            "monthly": convert_keys_to_strings(monthly.to_dict()),
            "daily": convert_keys_to_strings(daily.to_dict()),
            "per_month": convert_keys_to_strings(per_month.to_dict())
        }

    # Summarize cancellation results
    cancellation_summary = summarize_results(scaled_input_df, 'predicted_cancellation')

    # Summarize booking results
    booking_summary = summarize_results(booking_input_df, 'predicted_booking')
    
    # Prepare the response
    response = {
        "cancellations": cancellation_summary,
        "bookings": booking_summary
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
