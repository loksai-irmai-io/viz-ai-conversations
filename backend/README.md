
# Gen-UI Backend

This is the Python backend for the Gen-UI application. It provides APIs for the frontend to query and receive data.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Environment Variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   WEATHER_API_KEY=your_openweathermap_api_key
   NEWS_API_KEY=your_newsapi_key
   ```

5. Run the application:
   ```
   python app.py
   ```

The API will be available at `http://localhost:5000`.

## API Endpoints

- `GET /api/weather`: Get current weather information
- `GET /api/news`: Get latest news headlines
- `POST /api/query`: Process a natural language query and return relevant widgets
