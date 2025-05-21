
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
  
  // If still not found, parse the intent from the full sentence
  if (!visualization) {
    visualization = parseQueryIntent(normalizedQuery);
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
 * Parse the user's intent from their query
 * This is a more advanced version that considers the full sentence structure
 */
function parseQueryIntent(query: string): Widget | null {
  // Import all visualizations for matching
  const { visualizationLibrary } = require('@/data/visualization-library');
  
  // Extract potential visualization references from the query
  const showPatterns = [
    /show (?:me |us |the |)?(?:a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /display (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /view (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /visualize (?:the |a |an |)?(?:chart |graph |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /present (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /get (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /generate (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /create (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /i want to see (?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /can you show (?:me |us |)?(?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /i need (?:to see |)?(?:the |a |an |)?(?:chart |graph |visualization |report |data |statistics |metrics |analysis |information |details |)?(?:for |about |on |of |related to |regarding |)?(?:the |)?([^.?!]+)[.?!]?/i,
    /analyze (?:the |)?([^.?!]+)[.?!]?/i,
  ];
  
  // Try to extract potential visualization title from patterns
  let extractedPhrases = [];
  
  for (const pattern of showPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const extractedPhrase = match[1].trim();
      if (extractedPhrase.length > 2) { // Skip very short matches
        extractedPhrases.push(extractedPhrase);
      }
    }
  }
  
  // Special patterns for uploaded file analysis
  if (query.includes("file") && query.includes("upload")) {
    const analysisPatterns = [
      /analyze (?:the |this |)?(?:uploaded |)?file (?:for |about |on |regarding |)?([^.?!]+)[.?!]?/i,
      /examine (?:the |this |)?(?:uploaded |)?file (?:for |about |on |regarding |)?([^.?!]+)[.?!]?/i,
      /process (?:the |this |)?(?:uploaded |)?file (?:for |about |on |regarding |)?([^.?!]+)[.?!]?/i,
      /uploaded (?:a |the |)?file (?:about |for |regarding |on |)?([^.?!]+)[.?!]?/i,
    ];
    
    for (const pattern of analysisPatterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        const extractedPhrase = match[1].trim();
        if (extractedPhrase.length > 2) {
          extractedPhrases.push(extractedPhrase);
        }
      }
    }
  }
  
  // If we have extracted phrases, try to match them to visualization titles
  if (extractedPhrases.length > 0) {
    console.log("Extracted phrases for intent matching:", extractedPhrases);
    
    // First attempt: direct matching from extracted phrases
    for (const phrase of extractedPhrases) {
      const visualization = findVisualizationByTitle(phrase);
      if (visualization) {
        console.log(`Found visualization by extracted phrase: ${phrase}`);
        return visualization;
      }
    }
  }
  
  // Calculate semantic scores for all visualizations
  return performSemanticMatch(query);
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
    titleMatch: 15,        // Increased for exact title matches
    titleWordMatch: 10,    // Words in title
    keywordMatch: 8,       // Keywords explicitly defined
    descriptionMatch: 5,   // Words in description
    moduleMatch: 4,        // Module name match
    typeMatch: 7,          // Chart type match
    contextMatch: 6        // Context-specific terms
  };
  
  // Define common chart type terms and their variations
  const chartTypeMapping = {
    'bar': ['bar chart', 'bar graph', 'column chart', 'histogram'],
    'pie': ['pie chart', 'pie graph', 'donut chart', 'circle graph'],
    'line': ['line chart', 'line graph', 'trend line', 'time series'],
    'scatter': ['scatter plot', 'scatter chart', 'scatter graph', 'dot plot'],
    'heatmap': ['heat map', 'heatmap', 'color map', 'density map'],
    'table': ['table', 'data table', 'grid', 'matrix'],
    'flowchart': ['flow chart', 'flowchart', 'process flow', 'workflow diagram'],
    'treemap': ['tree map', 'treemap', 'hierarchy chart'],
    'gauge': ['gauge chart', 'gauge', 'meter chart', 'dial chart'],
    'kpi': ['kpi dashboard', 'metrics dashboard', 'performance indicators']
  };
  
  // Domain-specific terms
  const domainTerms = {
    'resource': ['resource', 'personnel', 'staff', 'employee', 'worker', 'human'],
    'failure': ['failure', 'error', 'issue', 'problem', 'breakdown', 'fault'],
    'pattern': ['pattern', 'trend', 'behavior', 'sequence', 'occurrence'],
    'object': ['object', 'entity', 'item', 'element', 'component'],
    'trade': ['trade', 'transaction', 'exchange', 'deal', 'business'],
    'performance': ['performance', 'efficiency', 'effectiveness', 'productivity'],
    'distribution': ['distribution', 'allocation', 'spread', 'dispersion', 'arrangement'],
    'summary': ['summary', 'overview', 'synopsis', 'digest', 'breakdown'],
    'lifecycle': ['lifecycle', 'life cycle', 'workflow', 'process', 'journey'],
    'activity': ['activity', 'action', 'task', 'operation', 'step'],
    'duration': ['duration', 'time', 'period', 'interval', 'span'],
    'outlier': ['outlier', 'anomaly', 'exception', 'unusual', 'atypical'],
    'event': ['event', 'occurrence', 'incident', 'happening'],
    'case': ['case', 'instance', 'example', 'scenario']
  };
  
  // Calculate scores for each visualization
  const scores = Object.values(visualizationLibrary).map((vis: Widget) => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // 1. Exact title match (highest priority)
    if (queryLower.includes(vis.title.toLowerCase())) {
      score += weights.titleMatch * 2;  // Double points for exact title match
    }
    
    // 2. Title word matching
    const titleWords = vis.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 3 && queryLower.includes(word)) {
        score += weights.titleWordMatch;
      }
    });
    
    // 3. Keyword matching
    if (vis.keywords) {
      vis.keywords.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += weights.keywordMatch;
        }
      });
    }
    
    // 4. Description matching
    if (vis.description) {
      const descWords = vis.description.toLowerCase().split(/\s+/);
      descWords.forEach(word => {
        if (word.length > 4 && queryLower.includes(word)) {
          score += weights.descriptionMatch;
        }
      });
    }
    
    // 5. Module matching
    if (vis.module && queryLower.includes(vis.module.toLowerCase())) {
      score += weights.moduleMatch;
    }
    
    // 6. Chart type matching
    Object.entries(chartTypeMapping).forEach(([type, variations]) => {
      if (vis.type.toLowerCase().includes(type)) {
        variations.forEach(term => {
          if (queryLower.includes(term.toLowerCase())) {
            score += weights.typeMatch;
          }
        });
      }
    });
    
    // 7. Domain-specific term matching
    Object.entries(domainTerms).forEach(([domain, variations]) => {
      if (vis.title.toLowerCase().includes(domain)) {
        variations.forEach(term => {
          if (queryLower.includes(term.toLowerCase())) {
            score += weights.contextMatch;
          }
        });
      }
    });
    
    // 8. Special cases for common requests

    // Object Type Interactions specifically
    if (vis.title === "Object Type Interactions" && 
        queryLower.includes("object type") && 
        (queryLower.includes("interaction") || queryLower.includes("heatmap"))) {
      score += weights.titleMatch * 1.5;
    }
    
    // Object Type Distribution specifically
    if (vis.title === "Object Type Distribution" && 
        queryLower.includes("object type") && 
        queryLower.includes("distribution")) {
      score += weights.titleMatch * 1.5;
    }
    
    // Resource Summary Table specifically
    if (vis.title === "Resource Summary Table" && 
        (queryLower.includes("resource") && 
         (queryLower.includes("summary") || queryLower.includes("table")))) {
      score += weights.titleMatch * 1.5;
    }
    
    // Failure Pattern Analysis
    if (vis.title === "Failure Pattern Analysis" && 
        (queryLower.includes("failure") && queryLower.includes("pattern"))) {
      score += weights.titleMatch * 1.5;
    }
    
    // Resource Performance
    if (vis.title === "Resource Performance" && 
        (queryLower.includes("resource") && queryLower.includes("performance"))) {
      score += weights.titleMatch * 1.5;
    }

    // Activity Duration Outliers
    if (vis.title === "Activity Duration Outliers" && 
        (queryLower.includes("activity") && 
         (queryLower.includes("duration") || queryLower.includes("outlier")))) {
      score += weights.titleMatch * 1.5;
    }

    // Process Failure Patterns Distribution
    if (vis.title === "Process Failure Patterns Distribution" && 
        queryLower.includes("failure") && 
        queryLower.includes("distribution")) {
      score += weights.titleMatch * 1.5;
    }
    
    // Time Gaps Distribution
    if (vis.title.includes("Distribution of Time Gaps") && 
        (queryLower.includes("time gap") || queryLower.includes("gap distribution"))) {
      score += weights.titleMatch * 1.5;
    }
    
    // Event Distribution
    if (vis.title === "Event Distribution by Case Type" && 
        (queryLower.includes("event") && queryLower.includes("distribution"))) {
      score += weights.titleMatch * 1.5;
    }

    // Activities by ABAKER
    if (vis.title === "Activities Performed by ABAKER" && 
        queryLower.includes("abaker")) {
      score += weights.titleMatch * 2;
    }

    // Case Complexity
    if ((vis.title.includes("Case Complexity")) && 
        queryLower.includes("case") && 
        (queryLower.includes("complexity") || queryLower.includes("analysis"))) {
      score += weights.titleMatch * 1.5;
    }
    
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
  
  // Return the top match only if it has a reasonable score and significantly outscores the second match
  if (scores.length > 0 && scores[0].score > 10) {
    // If there's a second result and it's close in score, log a warning about ambiguity
    if (scores.length > 1 && scores[0].score - scores[1].score < 5) {
      console.log("Warning: Top matches are close in score, potential ambiguity");
    }
    return scores[0].visualization;
  }
  
  return null;
}
