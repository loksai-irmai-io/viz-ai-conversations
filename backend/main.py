
from flask import Flask
from process_mining_api import init_db
from streamlit_proxy import register_blueprint

# Create Flask app
app = Flask(__name__)

# Initialize database
init_db()

# Register blueprints
register_blueprint(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
