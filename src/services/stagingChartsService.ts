
import { toast } from '@/components/ui/use-toast';

const STAGING_CHARTS_API_URL = 'http://localhost:8000/charts';

export interface StagingChart {
  id: string;
  title: string;
  description?: string;
  type: string;
  metadata: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface StagingChartsResponse {
  charts: StagingChart[];
  status: 'success' | 'error';
  message?: string;
}

/**
 * Fetch charts from the staging folder
 */
export async function fetchStagingCharts(): Promise<StagingChartsResponse> {
  try {
    console.log('Fetching charts from staging API:', STAGING_CHARTS_API_URL);
    
    const response = await fetch(STAGING_CHARTS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Ensure the response has the expected structure
    if (!data.charts || !Array.isArray(data.charts)) {
      console.warn('Invalid response structure from staging API:', data);
      return {
        charts: [],
        status: 'error',
        message: 'Invalid response structure from staging API'
      };
    }
    
    console.log('Successfully fetched charts from staging:', data.charts.length);
    
    return {
      charts: data.charts,
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching staging charts:', error);
    
    return {
      charts: [],
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check if the staging charts API is available
 */
export async function checkStagingApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${STAGING_CHARTS_API_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Staging API health check failed:', error);
    return false;
  }
}
