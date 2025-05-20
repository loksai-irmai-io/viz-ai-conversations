
// API service to connect with the Python backend

const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchWeather(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { error: 'Failed to fetch weather data. Using mock data instead.' };
  }
}

export async function fetchNews(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching news data:', error);
    return { error: 'Failed to fetch news data. Using mock data instead.' };
  }
}

export async function processQuery(query: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error processing query:', error);
    return { error: 'Failed to process query. Using client-side fallback.' };
  }
}
