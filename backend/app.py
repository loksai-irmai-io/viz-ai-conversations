
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock data for demonstration purposes
# In a real application, this would come from a database or external APIs
def load_mock_data():
    return {
        "weather": {
            "location": "New York, NY",
            "temperature": 72,
            "condition": "Partly Cloudy",
            "humidity": 65,
            "wind": "8 mph"
        },
        "news": [
            {
                "title": "AI Developments Transform Business Analytics",
                "source": "Tech Insights",
                "url": "#"
            },
            {
                "title": "New Regulatory Framework for Process Controls",
                "source": "Business Weekly",
                "url": "#"
            },
            {
                "title": "Companies Adopting Advanced Analytics at Record Pace",
                "source": "Data Science Journal",
                "url": "#"
            }
        ]
    }

@app.route('/api/weather', methods=['GET'])
def get_weather():
    # In a real application, this would make a call to the OpenWeatherMap API
    # api_key = os.environ.get('WEATHER_API_KEY', 'your_api_key_here')
    data = load_mock_data()
    return jsonify(data["weather"])

@app.route('/api/news', methods=['GET'])
def get_news():
    # In a real application, this would make a call to the NewsAPI
    # api_key = os.environ.get('NEWS_API_KEY', 'your_api_key_here')
    data = load_mock_data()
    return jsonify(data["news"])

@app.route('/api/query', methods=['POST'])
def process_query():
    data = request.json
    query = data.get('query', '')
    
    # In a real application, this would use some NLP or ML model to process the query
    # For now, we'll just return mock data based on keywords
    response = {
        "text": f"Processing query: {query}",
        "widgets": []
    }
    
    # Add logic to determine which widgets to return based on the query
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
