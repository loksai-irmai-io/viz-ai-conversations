
from flask import Flask, request, jsonify, Blueprint
import requests
import os
import time
import threading
import logging
import base64
import json
from io import BytesIO
import uuid
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
STREAMLIT_URL = "http://34.45.239.136:8501"
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cache')
RESULTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results')

# Create directories if they don't exist
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# Dictionary to store processing tasks
processing_tasks = {}

# Create blueprint
streamlit_bp = Blueprint('streamlit', __name__, url_prefix='/api/streamlit')

class StreamlitProcessingTask:
    def __init__(self, request_id, request_type, content):
        self.request_id = request_id
        self.request_type = request_type  # 'prompt' or 'file'
        self.content = content
        self.status = 'processing'
        self.start_time = time.time()
        self.estimated_completion_time = None
        self.results = []
        self.error = None
        self.thread = None
        self.cancelled = False
    
    def start(self):
        self.thread = threading.Thread(target=self.process)
        self.thread.daemon = True
        self.thread.start()
    
    def process(self):
        try:
            # Simulate initial progress delay (connecting to Streamlit)
            time.sleep(3)
            
            # Update estimated completion time
            if self.request_type == 'prompt':
                # Prompts typically take 3-5 minutes
                self.estimated_completion_time = self.start_time + (3 * 60)
            else:
                # File uploads typically take 10-15 minutes
                self.estimated_completion_time = self.start_time + (10 * 60)
            
            # Save initial state
            self.save_state()
            
            # Number of processing steps
            steps = 5 if self.request_type == 'prompt' else 8
            
            # Process in steps
            for step in range(1, steps + 1):
                if self.cancelled:
                    logger.info(f"Task {self.request_id} was cancelled")
                    self.status = 'cancelled'
                    self.save_state()
                    return
                
                # Simulate processing time for each step
                time.sleep(10)
                
                # Generate a partial result at each step
                partial_result = self.generate_partial_result(step, steps)
                self.results.append(partial_result)
                
                # Save state after each step
                self.save_state()
            
            # Mark as completed
            self.status = 'completed'
            self.save_state()
            
            logger.info(f"Task {self.request_id} completed successfully")
        
        except Exception as e:
            logger.error(f"Error processing task {self.request_id}: {str(e)}")
            self.status = 'failed'
            self.error = str(e)
            self.save_state()
    
    def generate_partial_result(self, step, total_steps):
        """Generate a partial result for the current step"""
        progress = step / total_steps
        
        # Mock result structure
        result = {
            "step": step,
            "progress": progress,
            "timestamp": time.time(),
            "type": self.request_type
        }
        
        # Add some visualization data based on the step
        if step > 1:
            # Start adding visualizations from step 2
            chart_type = ["bar", "line", "scatter", "pie", "table"][step % 5]
            result["visualization"] = {
                "type": chart_type,
                "title": f"Analysis {step} ({chart_type.capitalize()} Chart)",
                "data": self.generate_mock_data(chart_type)
            }
        
        return result
    
    def generate_mock_data(self, chart_type):
        """Generate mock data for visualizations"""
        import random
        
        if chart_type == "bar" or chart_type == "line":
            return [
                {"name": "Category A", "value": random.randint(10, 100)},
                {"name": "Category B", "value": random.randint(10, 100)},
                {"name": "Category C", "value": random.randint(10, 100)},
                {"name": "Category D", "value": random.randint(10, 100)}
            ]
        elif chart_type == "scatter":
            return [
                {"x": random.randint(10, 100), "y": random.randint(10, 100)} 
                for _ in range(20)
            ]
        elif chart_type == "pie":
            return [
                {"name": "Segment A", "value": random.randint(10, 30)},
                {"name": "Segment B", "value": random.randint(10, 30)},
                {"name": "Segment C", "value": random.randint(10, 30)},
            ]
        else:  # table
            return [
                {"id": i, "name": f"Item {i}", "value": random.randint(100, 999)}
                for i in range(1, 6)
            ]
    
    def save_state(self):
        """Save current state to disk"""
        state = {
            "request_id": self.request_id,
            "request_type": self.request_type,
            "content": self.content,
            "status": self.status,
            "start_time": self.start_time,
            "current_time": time.time(),
            "estimated_completion_time": self.estimated_completion_time,
            "results": self.results,
            "error": self.error
        }
        
        file_path = os.path.join(RESULTS_DIR, f"{self.request_id}.json")
        
        with open(file_path, 'w') as f:
            json.dump(state, f)

# Routes
@streamlit_bp.route('/prompt', methods=['POST'])
def submit_prompt():
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({"error": "Missing prompt parameter"}), 400
        
        prompt = data['prompt']
        request_id = f"prompt-{int(time.time())}-{uuid.uuid4().hex[:8]}"
        
        # Create and start processing task
        task = StreamlitProcessingTask(request_id, 'prompt', prompt)
        processing_tasks[request_id] = task
        task.start()
        
        return jsonify({
            "requestId": request_id,
            "status": "processing",
            "estimatedTimeRemaining": 300  # 5 minutes
        })
    
    except Exception as e:
        logger.error(f"Error submitting prompt: {str(e)}")
        return jsonify({"error": str(e)}), 500

@streamlit_bp.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file:
            filename = secure_filename(file.filename)
            request_id = f"file-{int(time.time())}-{uuid.uuid4().hex[:8]}"
            
            # Save file to cache directory
            file_path = os.path.join(CACHE_DIR, f"{request_id}_{filename}")
            file.save(file_path)
            
            # Create and start processing task
            task = StreamlitProcessingTask(request_id, 'file', filename)
            processing_tasks[request_id] = task
            task.start()
            
            return jsonify({
                "requestId": request_id,
                "status": "processing",
                "estimatedTimeRemaining": 600  # 10 minutes
            })
    
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        return jsonify({"error": str(e)}), 500

@streamlit_bp.route('/results/<request_id>', methods=['GET'])
def get_results(request_id):
    try:
        # Check if task is in memory
        task = processing_tasks.get(request_id)
        
        # If not in memory, try to load from disk
        if not task:
            file_path = os.path.join(RESULTS_DIR, f"{request_id}.json")
            
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    state = json.load(f)
                
                # Convert results to appropriate visualization format
                if state['status'] == 'completed':
                    return jsonify({
                        "status": "completed",
                        "visualizations": convert_results_to_visualizations(state['results']),
                        "streamlitImages": generate_mock_streamlit_images(3)  # Mock 3 images
                    })
                elif state['status'] == 'failed':
                    return jsonify({
                        "status": "failed",
                        "error": state['error']
                    })
                else:
                    # Calculate time remaining
                    current_time = time.time()
                    if state['estimated_completion_time']:
                        time_remaining = max(0, state['estimated_completion_time'] - current_time)
                    else:
                        time_remaining = 300  # Default to 5 minutes
                    
                    return jsonify({
                        "status": "processing",
                        "estimatedTimeRemaining": int(time_remaining),
                        "partialVisualizations": convert_results_to_visualizations(state['results']),
                        "streamlitImages": generate_mock_streamlit_images(len(state['results']) // 2)
                    })
            else:
                return jsonify({"error": "Request not found"}), 404
        
        # Task is in memory
        if task.status == 'completed':
            return jsonify({
                "status": "completed",
                "visualizations": convert_results_to_visualizations(task.results),
                "streamlitImages": generate_mock_streamlit_images(3)  # Mock 3 images
            })
        elif task.status == 'failed':
            return jsonify({
                "status": "failed",
                "error": task.error
            })
        else:
            # Calculate time remaining
            current_time = time.time()
            if task.estimated_completion_time:
                time_remaining = max(0, task.estimated_completion_time - current_time)
            else:
                time_remaining = 300  # Default to 5 minutes
            
            return jsonify({
                "status": "processing",
                "estimatedTimeRemaining": int(time_remaining),
                "partialVisualizations": convert_results_to_visualizations(task.results),
                "streamlitImages": generate_mock_streamlit_images(len(task.results) // 2)
            })
    
    except Exception as e:
        logger.error(f"Error getting results: {str(e)}")
        return jsonify({"error": str(e)}), 500

@streamlit_bp.route('/cancel/<request_id>', methods=['POST'])
def cancel_request(request_id):
    try:
        task = processing_tasks.get(request_id)
        
        if task:
            task.cancelled = True
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Request not found"}), 404
    
    except Exception as e:
        logger.error(f"Error cancelling request: {str(e)}")
        return jsonify({"error": str(e)}), 500

def convert_results_to_visualizations(results):
    """Convert task results to visualization widgets"""
    visualizations = []
    
    for result in results:
        if 'visualization' in result:
            viz = result['visualization']
            
            if viz['type'] == 'bar':
                visualizations.append({
                    "id": f"streamlit-viz-{len(visualizations)}",
                    "title": viz['title'],
                    "description": "Generated from Streamlit processing pipeline",
                    "type": "bar-chart",
                    "metadata": {
                        "xAxisLabel": "Category",
                        "yAxisLabel": "Value",
                        "data": viz['data']
                    }
                })
            elif viz['type'] == 'line':
                visualizations.append({
                    "id": f"streamlit-viz-{len(visualizations)}",
                    "title": viz['title'],
                    "description": "Generated from Streamlit processing pipeline",
                    "type": "line-chart",
                    "metadata": {
                        "xAxisLabel": "Category",
                        "yAxisLabel": "Value",
                        "data": viz['data']
                    }
                })
            elif viz['type'] == 'scatter':
                visualizations.append({
                    "id": f"streamlit-viz-{len(visualizations)}",
                    "title": viz['title'],
                    "description": "Generated from Streamlit processing pipeline",
                    "type": "scatter-chart",
                    "metadata": {
                        "xAxisLabel": "X",
                        "yAxisLabel": "Y",
                        "data": viz['data']
                    }
                })
            elif viz['type'] == 'pie':
                visualizations.append({
                    "id": f"streamlit-viz-{len(visualizations)}",
                    "title": viz['title'],
                    "description": "Generated from Streamlit processing pipeline",
                    "type": "pie-chart",
                    "metadata": {
                        "data": viz['data']
                    }
                })
            elif viz['type'] == 'table':
                visualizations.append({
                    "id": f"streamlit-viz-{len(visualizations)}",
                    "title": viz['title'],
                    "description": "Generated from Streamlit processing pipeline",
                    "type": "data-table",
                    "metadata": {
                        "columns": [
                            { "key": "id", "header": "ID" },
                            { "key": "name", "header": "Name" },
                            { "key": "value", "header": "Value" }
                        ],
                        "data": viz['data']
                    }
                })
    
    return visualizations

def generate_mock_streamlit_images(count=1):
    """Generate mock Streamlit screenshot URLs"""
    images = []
    
    for i in range(min(count, 3)):  # Limit to max 3 images
        # In a real implementation, these would be actual screenshot URLs
        images.append(f"https://via.placeholder.com/1200x800.png?text=Streamlit+View+{i+1}")
    
    return images

def register_blueprint(app):
    app.register_blueprint(streamlit_bp)
