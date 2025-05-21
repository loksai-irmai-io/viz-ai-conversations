
import { Widget } from '@/data/mock-data';
import { findVisualizationByTitle, enhanceChart } from '@/data/visualization-library';

// Process a user query to find and enhance the relevant chart
export function processChartQuery(query: string): Widget | null {
  // Check if query is a direct title match without brackets
  const directTitle = query.trim();
  console.log(`Looking for visualization with title: ${directTitle}`);
  
  // Find the visualization by direct title match
  let visualization = findVisualizationByTitle(directTitle);
  
  // If not found, check if query contains title indicators with brackets
  if (!visualization) {
    const titleRegex = /\[([^\]]+)\]/;
    const match = query.match(titleRegex);
    
    if (match && match[1]) {
      const bracketTitle = match[1].trim();
      console.log(`Looking for visualization with bracketed title: ${bracketTitle}`);
      visualization = findVisualizationByTitle(bracketTitle);
    }
  }
  
  if (visualization) {
    // Enhance the chart with analysis markers
    const enhancedVisualization = enhanceChart(visualization);
    console.log(`Found and enhanced visualization: ${enhancedVisualization.title}`);
    return enhancedVisualization;
  }
  
  return null;
}
