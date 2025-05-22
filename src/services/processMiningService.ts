
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = 'http://localhost:5000/api';

export interface ProcessMetadata {
  filename: string;
  totalEvents: number;
  totalCases: number;
  startDate: string;
  endDate: string;
}

export interface ProcessModel {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  statistics: {
    totalCases: number;
    totalEvents: number;
    activities: Record<string, number>;
  };
}

export interface ProcessNode {
  id: string;
  name: string;
  type: string;
}

export interface ProcessEdge {
  source: string;
  target: string;
  value: number;
}

export interface Outlier {
  id: string;
  type: string;
  entity_id: string;
  score: number;
  is_outlier: boolean;
}

export interface ProcessSummary {
  activityCount: number;
  activityFrequency: Record<string, number>;
  mostFrequentActivity: string;
  leastFrequentActivity: string;
}

export interface UploadResponse {
  success: boolean;
  file_id: string;
  filename: string;
  metrics: {
    totalEvents: number;
    totalCases: number;
    startDate: string;
    endDate: string;
  };
}

export async function uploadCsvFile(file: File): Promise<UploadResponse | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    toast({
      title: "Upload Failed",
      description: error instanceof Error ? error.message : 'Failed to upload file',
      variant: "destructive"
    });
    return null;
  }
}

export async function getProcessModel(fileId: string): Promise<ProcessModel | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/process/${fileId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch process model');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching process model:', error);
    return null;
  }
}

export async function getOutliers(fileId: string): Promise<Outlier[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/outliers/${fileId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch outliers');
    }

    const data = await response.json();
    return data.outliers;
  } catch (error) {
    console.error('Error fetching outliers:', error);
    return null;
  }
}

export async function getProcessMetadata(fileId: string): Promise<ProcessMetadata | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/metadata/${fileId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch metadata');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching process metadata:', error);
    return null;
  }
}

export async function getProcessSummary(fileId: string): Promise<ProcessSummary | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary/${fileId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch process summary');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching process summary:', error);
    return null;
  }
}

export function generateVisualizationsFromProcessData(
  processModel: ProcessModel,
  outliers: Outlier[],
  summary: ProcessSummary
): any[] {
  const visualizations = [];
  
  // Activity frequency bar chart
  if (summary && summary.activityFrequency) {
    const activityData = Object.entries(summary.activityFrequency).map(([name, value]) => ({
      name,
      value
    }));
    
    visualizations.push({
      id: 'activity-frequency',
      title: 'Activity Frequency',
      description: 'Frequency of activities in the process',
      type: 'bar-chart',
      metadata: {
        xAxisLabel: 'Activity',
        yAxisLabel: 'Frequency',
        data: activityData
      }
    });
  }
  
  // Process flow visualization
  if (processModel && processModel.nodes && processModel.edges) {
    visualizations.push({
      id: 'process-flow',
      title: 'Process Flow',
      description: 'Visualization of the process flow',
      type: 'flowchart-widget',
      metadata: {
        flowTitle: 'Process Model',
        nodes: processModel.nodes.map(node => ({
          id: node.id,
          name: node.name,
          type: node.type === 'activity' ? 'process' : node.type
        })),
        edges: processModel.edges.map(edge => ({
          from: edge.source,
          to: edge.target,
          value: edge.value
        }))
      }
    });
  }
  
  // Outlier visualization
  if (outliers && outliers.length > 0) {
    const outlierData = outliers.map(outlier => ({
      name: outlier.entity_id,
      score: outlier.score,
      isOutlier: outlier.is_outlier
    }));
    
    visualizations.push({
      id: 'outlier-analysis',
      title: 'Outlier Analysis',
      description: 'Analysis of outliers in the process',
      type: 'scatter-chart',
      metadata: {
        xAxisLabel: 'Entity',
        yAxisLabel: 'Score',
        data: outlierData.map((item, index) => ({
          x: item.name,
          y: item.score,
          outlier: item.isOutlier
        }))
      }
    });
  }
  
  // KPI summary
  if (processModel && processModel.statistics) {
    visualizations.push({
      id: 'process-kpis',
      title: 'Process KPIs',
      description: 'Key performance indicators of the process',
      type: 'info-card-medium',
      metadata: {
        metrics: [
          { label: 'Total Cases', value: processModel.statistics.totalCases },
          { label: 'Total Events', value: processModel.statistics.totalEvents },
          { label: 'Activities', value: Object.keys(processModel.statistics.activities).length }
        ]
      }
    });
  }
  
  return visualizations;
}
