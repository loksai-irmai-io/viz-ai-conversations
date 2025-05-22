import { toast } from '@/components/ui/use-toast';

const STREAMLIT_API_URL = 'http://34.45.239.136:8501/api';
const API_BASE_URL = 'http://localhost:5000/api';

// Mock processing times for demo purposes (remove in production)
const MOCK_PROCESSING_ENABLED = true;

// Interface definitions
export interface StreamlitRequestResponse {
  requestId: string;
  status: string;
  estimatedTimeRemaining?: number;
}

export interface StreamlitVisualizationResult {
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  estimatedTimeRemaining?: number;
  visualizations?: any[];
  partialVisualizations?: any[];
  streamlitImages?: string[];
}

// Create a cache for visualization results
const visualizationCache = new Map<string, any>();

/**
 * Submit a text prompt to the Streamlit backend for processing
 */
export async function submitStreamlitPrompt(prompt: string): Promise<StreamlitRequestResponse> {
  try {
    if (MOCK_PROCESSING_ENABLED) {
      // For demo/development without backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        requestId: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'processing',
        estimatedTimeRemaining: 300 // 5 minutes
      };
    }

    // Try direct Streamlit API first
    try {
      const response = await fetch(`${STREAMLIT_API_URL}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (streamlitError) {
      console.warn("Direct Streamlit API unavailable, falling back to proxy:", streamlitError);
    }
    
    // Fall back to our proxy API
    const proxyResponse = await fetch(`${API_BASE_URL}/streamlit/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!proxyResponse.ok) {
      throw new Error(`HTTP error! Status: ${proxyResponse.status}`);
    }
    
    return await proxyResponse.json();
  } catch (error) {
    console.error("Error submitting prompt:", error);
    throw new Error("Failed to submit prompt for processing");
  }
}

/**
 * Upload a CSV file to the Streamlit backend for processing
 */
export async function uploadCsvToStreamlit(file: File): Promise<StreamlitRequestResponse> {
  try {
    if (MOCK_PROCESSING_ENABLED) {
      // For demo/development without backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        requestId: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'processing',
        estimatedTimeRemaining: 600 // 10 minutes
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    // Try direct Streamlit API first
    try {
      const response = await fetch(`${STREAMLIT_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (streamlitError) {
      console.warn("Direct Streamlit API unavailable, falling back to proxy:", streamlitError);
    }
    
    // Fall back to our proxy API
    const proxyResponse = await fetch(`${API_BASE_URL}/streamlit/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!proxyResponse.ok) {
      throw new Error(`HTTP error! Status: ${proxyResponse.status}`);
    }
    
    return await proxyResponse.json();
  } catch (error) {
    console.error("Error uploading CSV file:", error);
    throw new Error("Failed to upload file for processing");
  }
}

/**
 * Fetch visualization results from the Streamlit backend
 */
export async function fetchStreamlitVisualizations(requestId: string): Promise<StreamlitVisualizationResult> {
  try {
    // Check cache first
    if (visualizationCache.has(requestId)) {
      const cachedResult = visualizationCache.get(requestId);
      if (cachedResult.status === 'completed') {
        return cachedResult;
      }
    }

    if (MOCK_PROCESSING_ENABLED) {
      // For demo/development without backend
      return await mockFetchVisualizations(requestId);
    }

    // Try direct Streamlit API first
    try {
      const response = await fetch(`${STREAMLIT_API_URL}/results/${requestId}`);
      
      if (response.ok) {
        const result = await response.json();
        // Cache the result
        visualizationCache.set(requestId, result);
        return result;
      }
    } catch (streamlitError) {
      console.warn("Direct Streamlit API unavailable, falling back to proxy:", streamlitError);
    }
    
    // Fall back to our proxy API
    const proxyResponse = await fetch(`${API_BASE_URL}/streamlit/results/${requestId}`);
    
    if (!proxyResponse.ok) {
      throw new Error(`HTTP error! Status: ${proxyResponse.status}`);
    }
    
    const result = await proxyResponse.json();
    
    // Cache the result
    visualizationCache.set(requestId, result);
    return result;
  } catch (error) {
    console.error("Error fetching visualizations:", error);
    throw error;
  }
}

/**
 * Cancel an ongoing Streamlit processing request
 */
export async function cancelStreamlitRequest(requestId: string): Promise<boolean> {
  try {
    if (MOCK_PROCESSING_ENABLED) {
      // For demo/development without backend
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }

    // Try direct Streamlit API first
    try {
      const response = await fetch(`${STREAMLIT_API_URL}/cancel/${requestId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        return true;
      }
    } catch (streamlitError) {
      console.warn("Direct Streamlit API unavailable, falling back to proxy:", streamlitError);
    }
    
    // Fall back to our proxy API
    const proxyResponse = await fetch(`${API_BASE_URL}/streamlit/cancel/${requestId}`, {
      method: 'POST',
    });
    
    return proxyResponse.ok;
  } catch (error) {
    console.error("Error cancelling request:", error);
    return false;
  }
}

// Mock CSV data for different types of charts
function generateMockCsvData() {
  return {
    numericalColumns: [
      { name: 'price', type: 'numeric' },
      { name: 'quantity', type: 'numeric' },
      { name: 'rating', type: 'numeric' },
      { name: 'temperature', type: 'numeric' }
    ],
    categoricalColumns: [
      { name: 'product', type: 'categorical' },
      { name: 'region', type: 'categorical' },
      { name: 'category', type: 'categorical' }
    ],
    rows: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      product: ['Widget A', 'Widget B', 'Widget C', 'Widget D'][Math.floor(Math.random() * 4)],
      price: 10 + Math.random() * 90,
      quantity: Math.floor(Math.random() * 100),
      rating: 1 + Math.random() * 4,
      temperature: 60 + Math.random() * 40,
      region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
      category: ['Category A', 'Category B', 'Category C'][Math.floor(Math.random() * 3)]
    }))
  };
}

// Mock visualization fetching for development purposes
async function mockFetchVisualizations(requestId: string): Promise<StreamlitVisualizationResult> {
  // Extract timestamp from requestId to track progress
  const timestamp = parseInt(requestId.split('-')[1] || '0');
  const elapsedSeconds = (Date.now() - timestamp) / 1000;
  
  // Initialize a mock CSV data object
  const csvData = generateMockCsvData();

  // Simulate different stages of processing
  if (elapsedSeconds < 20) {
    // First 20 seconds - just processing
    return {
      status: 'processing',
      estimatedTimeRemaining: requestId.startsWith('file') ? 600 - elapsedSeconds : 300 - elapsedSeconds
    };
  } else if (elapsedSeconds < 40) {
    // 20-40 seconds - return partial results
    return {
      status: 'processing',
      estimatedTimeRemaining: requestId.startsWith('file') ? 600 - elapsedSeconds : 300 - elapsedSeconds,
      partialVisualizations: generateMockVisualizations(1, 2, csvData),
      streamlitImages: [
        'https://via.placeholder.com/1200x800.png?text=Data+Summary+Statistics+(Processing)'
      ]
    };
  } else if (elapsedSeconds < 60) {
    // 40-60 seconds - more partial results
    return {
      status: 'processing',
      estimatedTimeRemaining: requestId.startsWith('file') ? 600 - elapsedSeconds : 300 - elapsedSeconds,
      partialVisualizations: generateMockVisualizations(3, 4, csvData),
      streamlitImages: [
        'https://via.placeholder.com/1200x800.png?text=Data+Summary+Statistics+(Processing)',
        'https://via.placeholder.com/1200x800.png?text=Feature+Correlation+Heatmap+(Processing)'
      ]
    };
  } else {
    // After 60 seconds - complete
    return {
      status: 'completed',
      visualizations: generateMockVisualizations(5, 6, csvData),
      streamlitImages: [
        'https://via.placeholder.com/1200x800.png?text=Data+Summary+Statistics+(Complete)',
        'https://via.placeholder.com/1200x800.png?text=Feature+Correlation+Heatmap+(Complete)',
        'https://via.placeholder.com/1200x800.png?text=Outlier+Detection+Analysis+(Complete)'
      ]
    };
  }
}

// Generate mock visualizations using the CSV data
function generateMockVisualizations(min: number, max: number, csvData: any): any[] {
  const visualizations = [];
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // First, add a data summary widget
  visualizations.push({
    id: 'data-summary',
    title: 'CSV Data Summary',
    description: 'Overview of numerical and categorical columns',
    type: 'data-table',
    metadata: {
      columns: [
        { key: 'column', header: 'Column Name' },
        { key: 'type', header: 'Type' },
        { key: 'count', header: 'Count' },
        { key: 'unique', header: 'Unique Values' },
        { key: 'missing', header: 'Missing Values' }
      ],
      data: [
        ...csvData.numericalColumns.map(col => ({
          column: col.name,
          type: 'Numerical',
          count: csvData.rows.length,
          unique: new Set(csvData.rows.map(row => row[col.name])).size,
          missing: 0
        })),
        ...csvData.categoricalColumns.map(col => ({
          column: col.name,
          type: 'Categorical',
          count: csvData.rows.length,
          unique: new Set(csvData.rows.map(row => row[col.name])).size,
          missing: 0
        }))
      ]
    }
  });
  
  // Then add numerical statistics for the first numerical column
  if (csvData.numericalColumns.length > 0) {
    const firstNumCol = csvData.numericalColumns[0].name;
    const values = csvData.rows.map(row => row[firstNumCol]);
    
    visualizations.push({
      id: `${firstNumCol}-stats`,
      title: `${firstNumCol} Statistics`,
      description: `Statistical summary of ${firstNumCol}`,
      type: 'info-card-medium',
      metadata: {
        stats: [
          { 
            name: 'Mean', 
            value: values.reduce((a, b) => a + b, 0) / values.length,
            format: '0.00'
          },
          { 
            name: 'Min', 
            value: Math.min(...values),
            format: '0.00'
          },
          { 
            name: 'Max', 
            value: Math.max(...values),
            format: '0.00'
          },
          { 
            name: 'Median', 
            value: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
            format: '0.00'
          }
        ]
      }
    });
  }
  
  // Add different chart types based on the CSV data
  const vizTypes = [
    { type: 'bar-chart', title: 'Distribution by Category' },
    { type: 'line-chart', title: 'Trend Analysis' },
    { type: 'scatter-chart', title: 'Correlation Plot' },
    { type: 'pie-chart', title: 'Proportion Analysis' }
  ];
  
  for (let i = 0; i < Math.min(count - 2, vizTypes.length); i++) {
    const vizType = vizTypes[i];
    
    if (vizType.type === 'scatter-chart' && csvData.numericalColumns.length >= 2) {
      // Create a scatter plot with two numerical columns
      const xCol = csvData.numericalColumns[0].name;
      const yCol = csvData.numericalColumns[1].name;
      
      visualizations.push({
        id: `streamlit-viz-${i}`,
        title: `${xCol} vs ${yCol} ${vizType.title}`,
        description: `Showing relationship between ${xCol} and ${yCol}`,
        type: vizType.type,
        metadata: {
          xAxisLabel: xCol,
          yAxisLabel: yCol,
          data: csvData.rows.map(row => ({
            x: row[xCol],
            y: row[yCol],
            name: row.product || row.id
          }))
        }
      });
    } else if (vizType.type === 'bar-chart' && csvData.categoricalColumns.length > 0) {
      // Create a bar chart with categorical column
      const catCol = csvData.categoricalColumns[0].name;
      const numCol = csvData.numericalColumns[0].name;
      
      // Group by category and calculate average
      const categories = [...new Set(csvData.rows.map(row => row[catCol]))];
      const data = categories.map(cat => {
        const filteredRows = csvData.rows.filter(row => row[catCol] === cat);
        const avgValue = filteredRows.reduce((sum, row) => sum + row[numCol], 0) / filteredRows.length;
        
        return {
          name: cat,
          value: avgValue
        };
      });
      
      visualizations.push({
        id: `streamlit-viz-${i}`,
        title: `Average ${numCol} by ${catCol}`,
        description: `Bar chart showing average ${numCol} for each ${catCol}`,
        type: vizType.type,
        metadata: {
          xAxisLabel: catCol,
          yAxisLabel: `Average ${numCol}`,
          data: data
        }
      });
    } else if (vizType.type === 'line-chart' && csvData.numericalColumns.length > 1) {
      // Create a line chart showing a trend
      const numCol = csvData.numericalColumns[0].name;
      const secondNumCol = csvData.numericalColumns[1].name;
      
      // Sort rows by ID for a meaningful trend
      const sortedRows = [...csvData.rows].sort((a, b) => a.id - b.id);
      
      visualizations.push({
        id: `streamlit-viz-${i}`,
        title: `${numCol} and ${secondNumCol} Trend`,
        description: `Line chart showing the trend of ${numCol} and ${secondNumCol}`,
        type: vizType.type,
        metadata: {
          xAxisLabel: 'Index',
          yAxisLabel: 'Value',
          series: [
            {
              name: numCol,
              data: sortedRows.map((row, index) => ({ name: index, value: row[numCol] }))
            },
            {
              name: secondNumCol,
              data: sortedRows.map((row, index) => ({ name: index, value: row[secondNumCol] }))
            }
          ]
        }
      });
    } else if (vizType.type === 'pie-chart' && csvData.categoricalColumns.length > 0) {
      // Create a pie chart for category distribution
      const catCol = csvData.categoricalColumns[0].name;
      
      // Count occurrences of each category
      const categories = [...new Set(csvData.rows.map(row => row[catCol]))];
      const data = categories.map(cat => {
        const count = csvData.rows.filter(row => row[catCol] === cat).length;
        return {
          name: cat,
          value: count
        };
      });
      
      visualizations.push({
        id: `streamlit-viz-${i}`,
        title: `${catCol} Distribution`,
        description: `Pie chart showing the distribution of ${catCol}`,
        type: vizType.type,
        metadata: {
          data: data
        }
      });
    }
  }
  
  return visualizations;
}
