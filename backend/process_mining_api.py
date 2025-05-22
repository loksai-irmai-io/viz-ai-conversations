
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import json
import sqlite3
import os
import uuid
import tempfile
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directories for storing uploaded and processed files
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
PROCESSED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'processed')
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results.db')

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables for storing outlier analysis results and process metadata
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS outlier_results (
        id TEXT PRIMARY KEY,
        file_id TEXT,
        outlier_type TEXT,
        entity_id TEXT,
        score REAL,
        is_outlier INTEGER,
        timestamp TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS process_metadata (
        file_id TEXT PRIMARY KEY,
        filename TEXT,
        total_events INTEGER,
        total_cases INTEGER,
        start_date TEXT,
        end_date TEXT,
        timestamp TEXT
    )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Helper function to convert CSV to OCEL JSON
def convert_csv_to_ocel(csv_path, output_path):
    """
    Convert CSV file to OCEL JSON format
    This is a placeholder - you'll need to implement your actual conversion logic
    """
    try:
        # Read CSV file
        df = pd.read_csv(csv_path)
        
        # Simple example conversion - modify according to your actual CSV structure
        ocel = {
            "ocel:global-event": {"ocel:activity": "__INVALID__"},
            "ocel:global-object": {"ocel:type": "__INVALID__"},
            "ocel:global-log": {"ocel:attribute-names": []},
            "ocel:events": {},
            "ocel:objects": {}
        }
        
        # Extract column names and add as attributes
        ocel["ocel:global-log"]["ocel:attribute-names"] = df.columns.tolist()
        
        # Simple transformation - you'll need to customize this based on your data
        for idx, row in df.iterrows():
            event_id = f"e{idx}"
            ocel["ocel:events"][event_id] = {
                "ocel:activity": row.get("activity", "unknown"),
                "ocel:timestamp": row.get("timestamp", ""),
                "ocel:omap": [f"o{idx}"],  # Object references
                "ocel:vmap": {col: str(row[col]) for col in df.columns}
            }
            
            # Create corresponding object
            obj_id = f"o{idx}"
            ocel["ocel:objects"][obj_id] = {
                "ocel:type": row.get("object_type", "case"),
                "ocel:ovmap": {}
            }
        
        # Write to JSON file
        with open(output_path, 'w') as f:
            json.dump(ocel, f, indent=2)
        
        return True
    except Exception as e:
        print(f"Error converting CSV to OCEL: {e}")
        return False

# Placeholder for process discovery function
def perform_process_discovery(ocel_path, output_path):
    """
    Perform process discovery on OCEL file
    This is a placeholder - you'll need to implement your actual process discovery logic
    """
    try:
        # Read OCEL file
        with open(ocel_path, 'r') as f:
            ocel = json.load(f)
        
        # Simple example - create a process data structure
        # Replace with your actual process discovery algorithm
        process_data = {
            "nodes": [],
            "edges": [],
            "statistics": {
                "totalCases": len(set([o.split(':')[1] for e in ocel["ocel:events"].values() for o in e["ocel:omap"] if ':' in o])),
                "totalEvents": len(ocel["ocel:events"]),
                "activities": {}
            }
        }
        
        # Extract activities and create nodes
        activities = set()
        for event in ocel["ocel:events"].values():
            activities.add(event["ocel:activity"])
        
        for idx, activity in enumerate(activities):
            process_data["nodes"].append({
                "id": f"a{idx}",
                "name": activity,
                "type": "activity"
            })
            
            # Count occurrences of each activity
            process_data["statistics"]["activities"][activity] = sum(
                1 for e in ocel["ocel:events"].values() if e["ocel:activity"] == activity
            )
        
        # Create simple edges between activities (this is simplified)
        # In a real implementation, you'd derive this from the actual process flow
        node_ids = [n["id"] for n in process_data["nodes"]]
        for i in range(len(node_ids)-1):
            process_data["edges"].append({
                "source": node_ids[i],
                "target": node_ids[i+1],
                "value": 1  # placeholder weight
            })
        
        # Write to JSON file
        with open(output_path, 'w') as f:
            json.dump(process_data, f, indent=2)
        
        return True, process_data
    except Exception as e:
        print(f"Error performing process discovery: {e}")
        return False, None

# Placeholder for outlier analysis function
def perform_outlier_analysis(process_data, file_id):
    """
    Perform outlier analysis based on process data
    This is a placeholder - you'll need to implement your actual outlier analysis logic
    """
    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Sample outlier analysis - replace with your actual algorithm
        outliers = []
        
        # Example: identify activities with unusual frequency
        activities = process_data["statistics"]["activities"]
        avg_frequency = sum(activities.values()) / len(activities)
        
        for activity, count in activities.items():
            # Simple outlier detection based on frequency
            is_outlier = count > 2 * avg_frequency or count < 0.5 * avg_frequency
            score = count / avg_frequency
            
            outlier_id = str(uuid.uuid4())
            outliers.append({
                "id": outlier_id,
                "type": "activity_frequency",
                "entity_id": activity,
                "score": score,
                "is_outlier": is_outlier
            })
            
            # Insert into database
            cursor.execute(
                "INSERT INTO outlier_results VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
                (outlier_id, file_id, "activity_frequency", activity, score, int(is_outlier))
            )
        
        conn.commit()
        conn.close()
        
        return outliers
    except Exception as e:
        print(f"Error performing outlier analysis: {e}")
        return []

# API endpoint for uploading CSV file
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file:
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Secure the filename
        filename = secure_filename(file.filename)
        csv_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{filename}")
        
        # Save the file
        file.save(csv_path)
        
        # Define output paths
        ocel_path = os.path.join(PROCESSED_FOLDER, f"{file_id}_ocel.json")
        process_path = os.path.join(PROCESSED_FOLDER, f"{file_id}_process.json")
        
        # Process the file
        if not convert_csv_to_ocel(csv_path, ocel_path):
            return jsonify({"error": "Failed to convert CSV to OCEL"}), 500
        
        success, process_data = perform_process_discovery(ocel_path, process_path)
        if not success:
            return jsonify({"error": "Failed to perform process discovery"}), 500
        
        # Store metadata
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get basic stats from process data
        total_events = process_data["statistics"]["totalEvents"]
        total_cases = process_data["statistics"]["totalCases"]
        
        # In a real implementation, extract these from actual timestamp data
        start_date = "2023-01-01"
        end_date = "2023-12-31"
        
        cursor.execute(
            "INSERT INTO process_metadata VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
            (file_id, filename, total_events, total_cases, start_date, end_date)
        )
        conn.commit()
        conn.close()
        
        # Perform outlier analysis
        outliers = perform_outlier_analysis(process_data, file_id)
        
        # Return response with file ID and basic info
        return jsonify({
            "success": True,
            "file_id": file_id,
            "filename": filename,
            "metrics": {
                "totalEvents": total_events,
                "totalCases": total_cases,
                "startDate": start_date,
                "endDate": end_date
            }
        })

# API endpoint to get process model
@app.route('/api/process/<file_id>', methods=['GET'])
def get_process_model(file_id):
    process_path = os.path.join(PROCESSED_FOLDER, f"{file_id}_process.json")
    
    if not os.path.exists(process_path):
        return jsonify({"error": "Process model not found"}), 404
    
    try:
        with open(process_path, 'r') as f:
            process_data = json.load(f)
        
        return jsonify(process_data)
    except Exception as e:
        return jsonify({"error": f"Failed to load process model: {str(e)}"}), 500

# API endpoint to get outliers
@app.route('/api/outliers/<file_id>', methods=['GET'])
def get_outliers(file_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, outlier_type, entity_id, score, is_outlier FROM outlier_results WHERE file_id = ?",
            (file_id,)
        )
        
        columns = ["id", "type", "entity_id", "score", "is_outlier"]
        outliers = []
        
        for row in cursor.fetchall():
            outlier = {columns[i]: row[i] for i in range(len(columns))}
            # Convert is_outlier to boolean
            outlier["is_outlier"] = bool(outlier["is_outlier"])
            outliers.append(outlier)
        
        conn.close()
        
        return jsonify({"outliers": outliers})
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve outliers: {str(e)}"}), 500

# API endpoint to get process metadata
@app.route('/api/metadata/<file_id>', methods=['GET'])
def get_metadata(file_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT filename, total_events, total_cases, start_date, end_date FROM process_metadata WHERE file_id = ?",
            (file_id,)
        )
        
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return jsonify({"error": "Metadata not found"}), 404
        
        metadata = {
            "filename": row[0],
            "totalEvents": row[1],
            "totalCases": row[2],
            "startDate": row[3],
            "endDate": row[4]
        }
        
        return jsonify(metadata)
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve metadata: {str(e)}"}), 500

# API endpoint to get summary statistics
@app.route('/api/summary/<file_id>', methods=['GET'])
def get_summary(file_id):
    process_path = os.path.join(PROCESSED_FOLDER, f"{file_id}_process.json")
    
    if not os.path.exists(process_path):
        return jsonify({"error": "Process data not found"}), 404
    
    try:
        with open(process_path, 'r') as f:
            process_data = json.load(f)
        
        # Extract summary statistics from process data
        activities = process_data["statistics"]["activities"]
        
        summary = {
            "activityCount": len(activities),
            "activityFrequency": activities,
            "mostFrequentActivity": max(activities.items(), key=lambda x: x[1])[0] if activities else None,
            "leastFrequentActivity": min(activities.items(), key=lambda x: x[1])[0] if activities else None
        }
        
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
