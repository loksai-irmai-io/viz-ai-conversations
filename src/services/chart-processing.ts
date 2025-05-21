
import { Widget } from '@/data/mock-data';
import { findVisualizationByTitle, enhanceChart } from '@/data/visualization-library';

/**
 * Processes a user query to find and enhance the relevant chart
 * Uses semantic matching to identify the correct visualization
 */
export function processChartQuery(query: string): Widget | null {
  // Normalize the query by removing punctuation and converting to lowercase
  const normalizedQuery = query.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  console.log(`Processing query: "${normalizedQuery}"`);
  
  // Check for direct title match first (highest priority)
  const directTitle = query.trim();
  console.log(`Looking for visualization with title: ${directTitle}`);
  let visualization = findVisualizationByTitle(directTitle);
  
  // If not found by direct title, check for title in brackets
  if (!visualization) {
    const titleRegex = /\[([^\]]+)\]/;
    const match = query.match(titleRegex);
    
    if (match && match[1]) {
      const bracketTitle = match[1].trim();
      console.log(`Looking for visualization with bracketed title: ${bracketTitle}`);
      visualization = findVisualizationByTitle(bracketTitle);
    }
  }
  
  // If still not found, look for semantic matches using common visualization request patterns
  if (!visualization) {
    // Extract potential visualization references from the query
    const showPatterns = [
      /show me (?:the )?(.*?)(?:\s|$)/i,
      /display (?:the )?(.*?)(?:\s|$)/i,
      /view (?:the )?(.*?)(?:\s|$)/i,
      /visualize (?:the )?(.*?)(?:\s|$)/i,
      /present (?:the )?(.*?)(?:\s|$)/i,
      /get (?:the )?(.*?)(?:\s|$)/i,
      /generate (?:a |an )?(.*?)(?:\s|$)/i,
      /create (?:a |an )?(.*?)(?:\s|$)/i,
      /i want to see (?:the )?(.*?)(?:\s|$)/i,
      /can you show (?:the )?(.*?)(?:\s|$)/i
    ];
    
    // Try to extract potential visualization title from patterns
    let potentialTitle = null;
    for (const pattern of showPatterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        potentialTitle = match[1].trim();
        if (potentialTitle.length > 3) { // Skip very short matches
          console.log(`Found potential title from pattern: ${potentialTitle}`);
          visualization = findVisualizationByTitle(potentialTitle);
          if (visualization) break;
        }
      }
    }
    
    // If still not found, perform semantic matching on the entire query
    if (!visualization) {
      console.log(`Performing semantic matching on full query: ${normalizedQuery}`);
      visualization = performSemanticMatch(normalizedQuery);
    }
  }
  
  if (visualization) {
    // Enhance the chart with analysis markers
    const enhancedVisualization = enhanceChart(visualization);
    console.log(`Found and enhanced visualization: ${enhancedVisualization.title}`);
    return enhancedVisualization;
  }
  
  console.log("No matching visualization found");
  return null;
}

/**
 * Performs semantic matching on the query to find the most relevant visualization
 * Uses a weighted scoring system based on visualization metadata
 */
function performSemanticMatch(query: string): Widget | null {
  // Import all visualizations for matching
  const { visualizationLibrary } = require('@/data/visualization-library');
  
  // Define semantic scoring weights
  const weights = {
    titleMatch: 10,
    keywordMatch: 5,
    descriptionMatch: 3,
    moduleMatch: 2
  };
  
  // Calculate scores for each visualization
  const scores = Object.values(visualizationLibrary).map((vis: Widget) => {
    let score = 0;
    
    // Title matching (most important)
    const titleWords = vis.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 3 && query.includes(word.toLowerCase())) {
        score += weights.titleMatch;
      }
    });
    
    // Exact title substring match gives bonus points
    if (query.includes(vis.title.toLowerCase())) {
      score += weights.titleMatch * 2;
    }
    
    // Keyword matching
    if (vis.keywords) {
      vis.keywords.forEach(keyword => {
        if (query.includes(keyword.toLowerCase())) {
          score += weights.keywordMatch;
        }
      });
    }
    
    // Description matching
    if (vis.description) {
      const descWords = vis.description.toLowerCase().split(/\s+/);
      descWords.forEach(word => {
        if (word.length > 3 && query.includes(word.toLowerCase())) {
          score += weights.descriptionMatch;
        }
      });
    }
    
    // Context-specific matches (module, data types, etc)
    if (vis.module && query.includes(vis.module.toLowerCase())) {
      score += weights.moduleMatch;
    }
    
    // Special case for charts with specific subject matter
    if (vis.title.includes("Resource") && query.includes("resource")) {
      score += weights.titleMatch;
    }
    
    if (vis.title.includes("Failure") && query.includes("failure")) {
      score += weights.titleMatch;
    }
    
    // Special case for common visualization terms
    const chartTypes = ["table", "chart", "graph", "heatmap", "pie", "bar", "scatter", "histogram"];
    chartTypes.forEach(type => {
      if (query.includes(type) && vis.type.toLowerCase().includes(type)) {
        score += weights.keywordMatch;
      }
    });
    
    return { visualization: vis, score };
  });
  
  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);
  
  // For debugging
  const topResults = scores.slice(0, 3);
  console.log("Top matching results:");
  topResults.forEach(result => {
    console.log(`- "${result.visualization.title}" (Score: ${result.score})`);
  });
  
  // Return the top match if it has a minimum score threshold
  if (scores.length > 0 && scores[0].score > 5) {
    return scores[0].visualization;
  }
  
  return null;
}
