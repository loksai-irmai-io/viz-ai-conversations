
// API service to connect with the Python backend

const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchWeather(location: string = ''): Promise<ApiResponse<any>> {
  try {
    const queryParams = location ? `?location=${encodeURIComponent(location)}` : '';
    const response = await fetch(`${API_BASE_URL}/weather${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Import mock data directly when API fails
    const { weatherData } = await import('@/data/mock-data');
    return { 
      data: weatherData,
      error: 'Failed to fetch weather data. Using mock data instead.' 
    };
  }
}

export async function fetchNews(category: string = ''): Promise<ApiResponse<any>> {
  try {
    const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await fetch(`${API_BASE_URL}/news${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching news data:', error);
    // Import mock data directly when API fails
    const { newsData } = await import('@/data/mock-data');
    return { 
      data: newsData,
      error: 'Failed to fetch news data. Using mock data instead.' 
    };
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
    
    // If the query is about resource performance
    if (query.toLowerCase().includes('resource performance') || query.toLowerCase().includes('step duration')) {
      return { 
        data: {
          text: "Here's the Resource Performance visualization showing average step duration by resource.",
          widgets: [{
            id: 'resource-performance',
            title: 'Resource Performance (Avg Step Duration)',
            description: 'A scatter plot showing average step duration by resource.',
            type: 'scatter-chart',
            metadata: {
              xAxisLabel: 'Resource',
              yAxisLabel: 'Avg. Duration (Hours)',
              data: [
                { x: 'TFOSTER', y: 86, outlier: true },
                { x: 'WDAVIS', y: 83.2 },
                { x: 'TPARKER', y: 82.5 },
                { x: 'SGARCIA', y: 83.7 },
                { x: 'RPA', y: 82.8 },
                { x: 'PMITCHELL', y: 82.1 },
                { x: 'PMILLER', y: 83.8 },
                { x: 'MBROWN', y: 84.2 },
                { x: 'MALLEN', y: 83.1 },
                { x: 'LWILSON', y: 83.6 },
                { x: 'LJONES', y: 82.4 },
                { x: 'KCLARK', y: 84.0 },
                { x: 'JSMITH', y: 83.5 },
                { x: 'HCOOPER', y: 82.9 },
                { x: 'HBAKER', y: 84.3 },
                { x: 'EADAMS', y: 83.9 },
                { x: 'DJOHNSON', y: 82.7 },
                { x: 'CMARTIN', y: 83.3 },
                { x: 'ABAKER', y: 82.3 }
              ]
            }
          }]
        }
      };
    }
    
    // If the query is about case complexity analysis
    else if (query.toLowerCase().includes('case complexity') && query.toLowerCase().includes('z-score')) {
      return { 
        data: {
          text: "Here's the Case Complexity Analysis visualization showing Z-scores for different cases.",
          widgets: [{
            id: 'case-complexity-analysis',
            title: 'Case Complexity Analysis',
            description: 'Scatter plot analyzing complexity outliers using Z-score.',
            type: 'scatter-chart',
            metadata: {
              xAxisLabel: 'Case ID',
              yAxisLabel: 'Composite Z-Score',
              data: [
                { x: 'CASE_001', y: 2.1 },
                { x: 'CASE_002', y: 1.8 },
                { x: 'CASE_003', y: 2.5 },
                { x: 'CASE_004', y: 1.7 },
                { x: 'CASE_005', y: 2.2 },
                { x: 'CASE_006', y: 1.9 },
                { x: 'CASE_007', y: 2.3 },
                { x: 'CASE_008', y: 2.0 },
                { x: 'CASE_009', y: 2.7 },
                { x: 'CASE_010', y: 1.5 },
                { x: 'CASE_011', y: 2.8 },
                { x: 'CASE_012', y: 2.4 },
                { x: 'CASE_013', y: 1.6 },
                { x: 'CASE_014', y: 2.6 },
                { x: 'CASE_015', y: 2.2 }
              ],
              threshold: 3.0,
              thresholdLabel: 'Outlier Threshold'
            }
          }]
        }
      };
    }
    
    // If the query is about detailed case complexity
    else if (query.toLowerCase().includes('case complexity') && query.toLowerCase().includes('scatter plot')) {
      return { 
        data: {
          text: "Here's the detailed Case Complexity Scatter Plot showing Z-scores for mortgage cases.",
          widgets: [{
            id: 'case-complexity-detail',
            title: 'Case Complexity Scatter Plot',
            description: 'Detailed view of case IDs against Z-scores.',
            type: 'scatter-chart',
            metadata: {
              xAxisLabel: 'Case ID',
              yAxisLabel: 'Z-Score',
              data: [
                { x: 'MORT_1001', y: 2.3 },
                { x: 'MORT_1254', y: 1.8 },
                { x: 'MORT_1432', y: 2.6 },
                { x: 'MORT_1587', y: 1.9 },
                { x: 'MORT_2109', y: 2.1 },
                { x: 'MORT_2341', y: 2.4 },
                { x: 'MORT_2756', y: 1.7 },
                { x: 'MORT_3012', y: 2.5 },
                { x: 'MORT_3450', y: 2.0 },
                { x: 'MORT_3989', y: 2.2 },
                { x: 'MORT_4231', y: 1.6 },
                { x: 'MORT_4789', y: 2.7 },
                { x: 'MORT_5102', y: 2.1 },
                { x: 'MORT_5674', y: 1.9 },
                { x: 'MORT_6120', y: 2.3 },
                { x: 'MORT_6589', y: 2.8 },
                { x: 'MORT_7234', y: 2.0 },
                { x: 'MORT_7801', y: 1.5 },
                { x: 'MORT_8345', y: 2.2 },
                { x: 'MORT_8890', y: 2.4 }
              ],
              threshold: 3.0,
              thresholdLabel: 'Outlier Threshold'
            }
          }]
        }
      };
    }
    
    return { error: 'Failed to process query. Using client-side fallback.' };
  }
}
