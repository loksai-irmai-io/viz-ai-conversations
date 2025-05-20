
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import random
from datetime import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API keys from environment variables
WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY', 'your_openweathermap_api_key')
NEWS_API_KEY = os.environ.get('NEWS_API_KEY', 'your_newsapi_key')

# Mock data for demonstration purposes
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
                "url": "https://example.com/news1"
            },
            {
                "title": "New Regulatory Framework for Process Controls",
                "source": "Business Weekly",
                "url": "https://example.com/news2"
            },
            {
                "title": "Companies Adopting Advanced Analytics at Record Pace",
                "source": "Data Science Journal",
                "url": "https://example.com/news3"
            }
        ]
    }

# Generate mock data for various widget types
def generate_widget_data(widget_type, query=None):
    if widget_type == "info-card-small" or widget_type == "info-card-medium" or widget_type == "info-card-large":
        return {
            "stats": [
                {"label": "Total Issues", "value": f"{random.randint(50, 200)}"},
                {"label": "Open Issues", "value": f"{random.randint(10, 50)}"},
                {"label": "Resolved", "value": f"{random.randint(40, 150)}"}
            ]
        }
    
    elif widget_type == "line-chart":
        return {
            "data": [
                {"month": "Jan", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"month": "Feb", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"month": "Mar", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"month": "Apr", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"month": "May", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"month": "Jun", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
            ],
            "xAxis": "Time Period",
            "yAxis": "Value",
            "legend": ["Series 1", "Series 2"]
        }
    
    elif widget_type == "bar-chart":
        return {
            "data": [
                {"category": "Category A", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"category": "Category B", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"category": "Category C", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"category": "Category D", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
                {"category": "Category E", "value1": random.randint(10, 100), "value2": random.randint(10, 100)},
            ],
            "xAxis": "Categories",
            "yAxis": "Value",
            "legend": ["Series 1", "Series 2"]
        }
    
    elif widget_type == "pie-chart" or widget_type == "donut-chart":
        return {
            "data": [
                {"name": "Category A", "value": random.randint(10, 100)},
                {"name": "Category B", "value": random.randint(10, 100)},
                {"name": "Category C", "value": random.randint(10, 100)},
                {"name": "Category D", "value": random.randint(10, 100)},
                {"name": "Category E", "value": random.randint(10, 100)},
            ]
        }
    
    elif widget_type == "heatmap":
        return {
            "data": [
                {"x": "Project A", "y": "Week 1", "value": random.randint(10, 100)},
                {"x": "Project B", "y": "Week 1", "value": random.randint(10, 100)},
                {"x": "Project C", "y": "Week 1", "value": random.randint(10, 100)},
                {"x": "Project A", "y": "Week 2", "value": random.randint(10, 100)},
                {"x": "Project B", "y": "Week 2", "value": random.randint(10, 100)},
                {"x": "Project C", "y": "Week 2", "value": random.randint(10, 100)},
                {"x": "Project A", "y": "Week 3", "value": random.randint(10, 100)},
                {"x": "Project B", "y": "Week 3", "value": random.randint(10, 100)},
                {"x": "Project C", "y": "Week 3", "value": random.randint(10, 100)},
            ]
        }
    
    elif widget_type == "data-table":
        return {
            "columns": [
                {"key": "id", "header": "ID"},
                {"key": "name", "header": "Name"},
                {"key": "status", "header": "Status"},
                {"key": "value", "header": "Value"}
            ],
            "data": [
                {"id": "1", "name": "Item A", "status": "Active", "value": random.randint(100, 999)},
                {"id": "2", "name": "Item B", "status": "Pending", "value": random.randint(100, 999)},
                {"id": "3", "name": "Item C", "status": "Completed", "value": random.randint(100, 999)},
                {"id": "4", "name": "Item D", "status": "Active", "value": random.randint(100, 999)},
                {"id": "5", "name": "Item E", "status": "Inactive", "value": random.randint(100, 999)},
            ]
        }
    
    elif widget_type == "gauge-widget":
        return {
            "value": random.randint(10, 100),
            "min": 0,
            "max": 100,
            "thresholds": [
                {"value": 30, "color": "#ff0000"},
                {"value": 60, "color": "#ffff00"},
                {"value": 100, "color": "#00ff00"}
            ]
        }
    
    elif widget_type == "timeline-widget":
        return {
            "events": [
                {"date": "2025-01-15", "title": "Project Start", "description": "Initial project kickoff"},
                {"date": "2025-02-10", "title": "Planning Phase", "description": "Requirements gathering completed"},
                {"date": "2025-03-05", "title": "Development", "description": "Development phase begins"},
                {"date": "2025-04-20", "title": "Testing", "description": "QA testing started"},
                {"date": "2025-05-15", "title": "Deployment", "description": "Production deployment"}
            ]
        }
    
    elif widget_type == "kpi-widget":
        return {
            "metrics": [
                {
                    "name": "Revenue", 
                    "value": f"${random.randint(10000, 50000)}", 
                    "change": random.randint(-10, 20),
                    "trend": [random.randint(10, 100) for _ in range(7)]
                },
                {
                    "name": "Customers", 
                    "value": random.randint(1000, 5000), 
                    "change": random.randint(-10, 20),
                    "trend": [random.randint(100, 500) for _ in range(7)]
                },
                {
                    "name": "Conversion", 
                    "value": f"{random.randint(1, 10)}.{random.randint(1, 9)}%", 
                    "change": random.randint(-10, 20),
                    "trend": [random.randint(1, 10) for _ in range(7)]
                }
            ]
        }
    
    elif widget_type == "map-widget":
        return {
            "regions": [
                {"name": "North America", "value": random.randint(100, 500), "lat": 40.7128, "lng": -74.0060},
                {"name": "Europe", "value": random.randint(100, 500), "lat": 51.5074, "lng": -0.1278},
                {"name": "Asia", "value": random.randint(100, 500), "lat": 35.6762, "lng": 139.6503},
                {"name": "South America", "value": random.randint(100, 500), "lat": -15.7801, "lng": -47.9292},
                {"name": "Africa", "value": random.randint(100, 500), "lat": -33.9249, "lng": 18.4241},
                {"name": "Australia", "value": random.randint(100, 500), "lat": -33.8688, "lng": 151.2093}
            ]
        }
    
    elif widget_type == "treemap-widget":
        return {
            "data": [
                {"name": "Department A", "value": random.randint(100, 500), "children": [
                    {"name": "Team A1", "value": random.randint(50, 200)},
                    {"name": "Team A2", "value": random.randint(50, 200)}
                ]},
                {"name": "Department B", "value": random.randint(100, 500), "children": [
                    {"name": "Team B1", "value": random.randint(50, 200)},
                    {"name": "Team B2", "value": random.randint(50, 200)}
                ]},
                {"name": "Department C", "value": random.randint(100, 500), "children": [
                    {"name": "Team C1", "value": random.randint(50, 200)},
                    {"name": "Team C2", "value": random.randint(50, 200)}
                ]}
            ]
        }
    
    elif widget_type == "bullet-chart":
        return {
            "data": [
                {"name": "Revenue", "actual": random.randint(60, 120), "target": 100, "ranges": [40, 80, 100]},
                {"name": "Profit", "actual": random.randint(60, 120), "target": 100, "ranges": [40, 80, 100]},
                {"name": "New Customers", "actual": random.randint(60, 120), "target": 100, "ranges": [40, 80, 100]}
            ]
        }
    
    elif widget_type == "wordcloud-widget":
        words = ["analytics", "data", "visualization", "dashboard", "insights", 
                "reports", "metrics", "performance", "indicators", "business",
                "intelligence", "trends", "forecasting", "monitoring", "analysis",
                "efficiency", "productivity", "optimization", "strategy", "growth"]
        return {
            "words": [{"text": word, "value": random.randint(10, 100)} for word in words]
        }
    
    elif widget_type == "accordion-widget":
        return {
            "sections": [
                {"title": "Section 1", "content": "This is the content for Section 1. It provides details about important information related to this topic."},
                {"title": "Section 2", "content": "This is the content for Section 2. It contains additional information and explanations about this particular area."},
                {"title": "Section 3", "content": "This is the content for Section 3. Here you can find even more details and insights about this specific subject."},
                {"title": "Section 4", "content": "This is the content for Section 4. The final section includes concluding remarks and summary information."}
            ]
        }
    
    elif widget_type == "progress-widget":
        return {
            "areas": [
                {"name": "Area 1", "progress": random.randint(10, 100)},
                {"name": "Area 2", "progress": random.randint(10, 100)},
                {"name": "Area 3", "progress": random.randint(10, 100)},
                {"name": "Area 4", "progress": random.randint(10, 100)}
            ]
        }
    
    elif widget_type == "list-widget":
        return {
            "items": [
                {"id": 1, "name": "Item A", "status": "Active", "priority": "High", "progress": random.randint(10, 100), "date": "2025-01-15"},
                {"id": 2, "name": "Item B", "status": "Pending", "priority": "Medium", "progress": random.randint(10, 100), "date": "2025-02-20"},
                {"id": 3, "name": "Item C", "status": "Completed", "priority": "Low", "progress": random.randint(10, 100), "date": "2025-03-25"},
                {"id": 4, "name": "Item D", "status": "Active", "priority": "High", "progress": random.randint(10, 100), "date": "2025-04-10"},
                {"id": 5, "name": "Item E", "status": "Inactive", "priority": "Medium", "progress": random.randint(10, 100), "date": "2025-05-05"}
            ],
            "sortOptions": ["priority", "status", "progress", "date"]
        }
    
    return {}

def get_widget_type_from_query(query):
    query_lower = query.lower()
    
    if any(term in query_lower for term in ["info card", "information card", "stat", "metrics", "numbers"]):
        return "info-card-medium"
    elif any(term in query_lower for term in ["line chart", "trend", "over time", "timeline chart"]):
        return "line-chart"
    elif any(term in query_lower for term in ["bar chart", "bar graph", "stacked bar"]):
        return "bar-chart"
    elif any(term in query_lower for term in ["pie chart", "distribution", "percentage"]):
        return "pie-chart"
    elif any(term in query_lower for term in ["donut chart", "donut graph"]):
        return "pie-chart"  # Using pie chart for donut as well
    elif any(term in query_lower for term in ["heatmap", "heat map", "density", "intensity"]):
        return "heatmap"
    elif any(term in query_lower for term in ["table", "data table", "grid", "spreadsheet"]):
        return "data-table"
    elif any(term in query_lower for term in ["gauge", "dial", "meter", "speedometer"]):
        return "gauge-widget"
    elif any(term in query_lower for term in ["timeline", "event", "chronological"]):
        return "timeline-widget"
    elif any(term in query_lower for term in ["kpi", "key performance", "performance indicator", "sparkline"]):
        return "kpi-widget"
    elif any(term in query_lower for term in ["map", "geographic", "geo", "location", "regional"]):
        return "map-widget"
    elif any(term in query_lower for term in ["treemap", "tree map", "hierarchical", "hierarchy"]):
        return "treemap-widget"
    elif any(term in query_lower for term in ["bullet chart", "target vs actual", "achievement"]):
        return "bullet-chart"
    elif any(term in query_lower for term in ["word cloud", "tag cloud", "text analysis", "term frequency"]):
        return "wordcloud-widget"
    elif any(term in query_lower for term in ["accordion", "expandable", "collapsible", "sections"]):
        return "accordion-widget"
    elif any(term in query_lower for term in ["progress", "completion", "radial", "circle progress"]):
        return "progress-widget"
    elif any(term in query_lower for term in ["list", "sortable list", "filterable list", "items"]):
        return "list-widget"
    
    return None

@app.route('/api/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location', 'New York')
    
    # In a real application, this would make a call to the OpenWeatherMap API
    if WEATHER_API_KEY and WEATHER_API_KEY != 'your_openweathermap_api_key':
        try:
            # Make actual API call with the provided key
            weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={WEATHER_API_KEY}&units=imperial"
            response = requests.get(weather_url)
            if response.status_code == 200:
                weather_data = response.json()
                return jsonify({
                    "location": f"{weather_data['name']}, {weather_data.get('sys', {}).get('country', '')}",
                    "temperature": round(weather_data['main']['temp']),
                    "condition": weather_data['weather'][0]['main'],
                    "humidity": weather_data['main']['humidity'],
                    "wind": f"{round(weather_data['wind']['speed'])} mph"
                })
        except Exception as e:
            print(f"Error fetching weather data: {e}")
    
    # Fallback to mock data
    data = load_mock_data()
    mock_weather = data["weather"]
    mock_weather["location"] = f"{location}, US"  # Update location in mock data
    return jsonify(mock_weather)

@app.route('/api/news', methods=['GET'])
def get_news():
    category = request.args.get('category', 'technology')
    
    # In a real application, this would make a call to the NewsAPI
    if NEWS_API_KEY and NEWS_API_KEY != 'your_newsapi_key':
        try:
            # Make actual API call with the provided key
            news_url = f"https://newsapi.org/v2/top-headlines?category={category}&language=en&apiKey={NEWS_API_KEY}"
            response = requests.get(news_url)
            if response.status_code == 200:
                news_data = response.json()
                articles = news_data.get('articles', [])[:5]  # Get top 5 articles
                return jsonify([
                    {
                        "title": article['title'],
                        "source": article['source']['name'],
                        "url": article['url']
                    }
                    for article in articles
                ])
        except Exception as e:
            print(f"Error fetching news data: {e}")
    
    # Fallback to mock data
    data = load_mock_data()
    return jsonify(data["news"])

@app.route('/api/query', methods=['POST'])
def process_query():
    data = request.json
    query = data.get('query', '')
    
    # Determine what type of widget to show based on the query
    widget_type = get_widget_type_from_query(query)
    
    # Generate response
    response = {
        "text": f"Processing query: {query}",
        "widgets": []
    }
    
    # Add widgets based on the query analysis
    if widget_type:
        # Create appropriate widget data based on the widget type
        widget_title = f"{widget_type.replace('-', ' ').title()}"
        widget_desc = f"Data visualization for: {query}"
        
        widget = {
            "id": f"{widget_type}-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "type": widget_type,
            "title": widget_title,
            "description": widget_desc,
            "module": "outlier-analysis",
            "image": "",
            "keywords": [term for term in query.lower().split() if len(term) > 3],
            "metadata": generate_widget_data(widget_type, query)
        }
        
        response["widgets"].append(widget)
        response["text"] = f"Here's a {widget_type.replace('-', ' ')} visualization based on your query."
    elif "weather" in query.lower():
        # Extract location from query
        location_keywords = ["in", "for", "at"]
        words = query.split()
        location = "New York"  # Default
        
        for i, word in enumerate(words):
            if word.lower() in location_keywords and i < len(words) - 1:
                location = words[i+1]
                # Check if there are more words that might be part of location
                if i + 2 < len(words) and words[i+2].lower() not in ["today", "now", "current", "temperature", "weather"]:
                    location += " " + words[i+2]
                break
        
        response["text"] = f"Here's the current weather for {location}:"
        response["widgets"].append({
            "id": "weather-card",
            "type": "weather-card",
            "title": f"Weather for {location}",
            "description": "Current weather conditions",
            "module": "outlier-analysis",
            "image": "",
            "keywords": ["weather", location],
            "metadata": {"location": location}
        })
    elif "news" in query.lower():
        # Extract category from query
        news_categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]
        category = "technology"  # Default
        
        for cat in news_categories:
            if cat in query.lower():
                category = cat
                break
        
        response["text"] = f"Here are the latest {category} news headlines:"
        response["widgets"].append({
            "id": "news-card",
            "type": "news-card",
            "title": f"Latest {category.title()} News",
            "description": "Recent news headlines",
            "module": "outlier-analysis",
            "image": "",
            "keywords": ["news", category],
            "metadata": {"category": category}
        })
    elif "time" in query.lower():
        response["text"] = "Here's the current time:"
        response["widgets"].append({
            "id": "time-card",
            "type": "time-card",
            "title": "Current Time",
            "description": "Current date and time",
            "module": "outlier-analysis",
            "image": "",
            "keywords": ["time"],
            "metadata": {}
        })
    else:
        response["text"] = "I couldn't find specific visualizations for your query. Try asking for specific chart types like line chart, bar chart, heatmap, or data table. You can also ask for weather, news, or the current time."
    
    return jsonify(response)

if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"Weather API Key configured: {'Yes' if WEATHER_API_KEY != 'your_openweathermap_api_key' else 'No'}")
    print(f"News API Key configured: {'Yes' if NEWS_API_KEY != 'your_newsapi_key' else 'No'}")
    app.run(debug=True, host='0.0.0.0', port=5000)
