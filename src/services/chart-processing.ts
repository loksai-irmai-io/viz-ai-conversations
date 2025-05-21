
import { Widget } from '@/data/mock-data';
import { findVisualizationByTitle, enhanceChart } from '@/data/visualization-library';

// Process a user query to find and enhance the relevant chart
export function processChartQuery(query: string): Widget | null {
  // Check if query contains title indicators
  const titleRegex = /\[([^\]]+)\]/;
  const match = query.match(titleRegex);
  
  if (match && match[1]) {
    const title = match[1].trim();
    console.log(`Looking for visualization with title: ${title}`);
    
    // Find the visualization by title
    const visualization = findVisualizationByTitle(title);
    
    if (visualization) {
      // Enhance the chart with analysis markers
      const enhancedVisualization = enhanceChart(visualization);
      console.log(`Found and enhanced visualization: ${enhancedVisualization.title}`);
      return enhancedVisualization;
    }
  }
  
  return null;
}
