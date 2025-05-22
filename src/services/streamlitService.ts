
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

// Mock visualization fetching for development purposes
async function mockFetchVisualizations(requestId: string): Promise<StreamlitVisualizationResult> {
  // Extract timestamp from requestId to track progress
  const timestamp = parseInt(requestId.split('-')[1] || '0');
  const elapsedSeconds = (Date.now() - timestamp) / 1000;
  
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
      partialVisualizations: generateMockVisualizations(1, 2),
      streamlitImages: [
        'https://via.placeholder.com/1200x800.png?text=Streamlit+View+(Loading)'
      ]
    };
  } else if (elapsedSeconds < 60) {
    // 40-60 seconds - more partial results
    return {
      status: 'processing',
      estimatedTimeRemaining: requestId.startsWith('file') ? 600 - elapsedSeconds : 300 - elapsedSeconds,
      partialVisualizations: generateMockVisualizations(2, 4),
      streamlitImages: [
        'https://via.placeholder.com/1200x800.png?text=Streamlit+View+1+(Processing)',
        'https://via.placeholder.com/1200x800.png?text=Streamlit+View+2+(Processing)'
      ]
    };
  } else {
    // After 60 seconds - complete
    return {
      status: 'completed',
      visualizations: generateMockVisualizations(4, 6),
      streamlitImages: [
        'https://via.placeholder.com/1200x800.png?text=Streamlit+View+1+(Complete)',
        'https://via.placeholder.com/1200x800.png?text=Streamlit+View+2+(Complete)',
        'https://via.placeholder.com/1200x800.png?text=Streamlit+View+3+(Complete)'
      ]
    };
  }
}

// Generate mock visualizations for development
function generateMockVisualizations(min: number, max: number): any[] {
  const visualizations = [];
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  
  const vizTypes = ['bar-chart', 'line-chart', 'scatter-chart', 'pie-chart', 'data-table'];
  
  for (let i = 0; i < count; i++) {
    const vizType = vizTypes[Math.floor(Math.random() * vizTypes.length)];
    
    visualizations.push({
      id: `streamlit-viz-${i}`,
      title: `Streamlit ${formatVizType(vizType)} ${i + 1}`,
      description: `Generated from Streamlit processing pipeline`,
      type: vizType,
      metadata: generateMockMetadata(vizType)
    });
  }
  
  return visualizations;
}

function formatVizType(type: string): string {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function generateMockMetadata(type: string): any {
  switch (type) {
    case 'bar-chart':
      return {
        xAxisLabel: 'Category',
        yAxisLabel: 'Value',
        data: [
          { name: 'Category A', value: Math.floor(Math.random() * 100) },
          { name: 'Category B', value: Math.floor(Math.random() * 100) },
          { name: 'Category C', value: Math.floor(Math.random() * 100) },
          { name: 'Category D', value: Math.floor(Math.random() * 100) },
          { name: 'Category E', value: Math.floor(Math.random() * 100) }
        ]
      };
    case 'line-chart':
      return {
        xAxisLabel: 'Time',
        yAxisLabel: 'Value',
        data: Array.from({ length: 10 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: Math.floor(Math.random() * 100)
        }))
      };
    case 'scatter-chart':
      return {
        xAxisLabel: 'X Value',
        yAxisLabel: 'Y Value',
        data: Array.from({ length: 20 }, () => ({
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100)
        }))
      };
    case 'pie-chart':
      return {
        data: [
          { name: 'Category A', value: Math.floor(Math.random() * 100) },
          { name: 'Category B', value: Math.floor(Math.random() * 100) },
          { name: 'Category C', value: Math.floor(Math.random() * 100) },
          { name: 'Category D', value: Math.floor(Math.random() * 100) }
        ]
      };
    case 'data-table':
      return {
        columns: [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'value', header: 'Value' },
          { key: 'category', header: 'Category' }
        ],
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
        }))
      };
    default:
      return {};
  }
}
