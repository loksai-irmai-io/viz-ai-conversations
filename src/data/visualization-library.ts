
import { Widget } from './mock-data';

// Define a comprehensive mapping of chart titles to their configurations
export const visualizationLibrary: Record<string, Widget> = {
  "Object Type Interactions": {
    id: "object-type-interactions",
    type: "heatmap",
    title: "Object Type Interactions",
    description: "A heatmap visualizing interaction levels between four object types: Market, Risk, Settlement, and Trade.",
    module: "outlier-analysis",
    keywords: ["heatmap", "object", "interaction", "intensity"],
    image: "",
    metadata: {
      data: [
        { x: "Market", y: "Market", value: 80000 },
        { x: "Market", y: "Risk", value: 120000 },
        { x: "Market", y: "Settlement", value: 100000 },
        { x: "Market", y: "Trade", value: 90000 },
        { x: "Risk", y: "Market", value: 120000 },
        { x: "Risk", y: "Risk", value: 70000 },
        { x: "Risk", y: "Settlement", value: 60000 },
        { x: "Risk", y: "Trade", value: 110000 },
        { x: "Settlement", y: "Market", value: 100000 },
        { x: "Settlement", y: "Risk", value: 60000 },
        { x: "Settlement", y: "Settlement", value: 50000 },
        { x: "Settlement", y: "Trade", value: 130000 },
        { x: "Trade", y: "Market", value: 90000 },
        { x: "Trade", y: "Risk", value: 110000 },
        { x: "Trade", y: "Settlement", value: 130000 },
        { x: "Trade", y: "Trade", value: 200000 },
      ],
      xAxis: "Object Type",
      yAxis: "Object Type"
    }
  },
  "Object Type Metrics": {
    id: "object-type-metrics-bar",
    type: "bar-chart",
    title: "Object Type Metrics",
    description: "A bar chart showing metrics for the object types: Trade, Market, Risk, and Settlement.",
    module: "outlier-analysis",
    keywords: ["bar chart", "metrics", "object type"],
    image: "",
    metadata: {
      data: [
        { name: "Trade", value: 12 },
        { name: "Market", value: 8 },
        { name: "Risk", value: 5 },
        { name: "Settlement", value: 7 }
      ],
      xAxis: "Object Type",
      yAxis: "Metric Value"
    }
  },
  "Object Type Distribution": {
    id: "object-type-metrics-pie",
    type: "pie-chart",
    title: "Object Type Distribution",
    description: "A pie chart depicting the distribution of object types.",
    module: "outlier-analysis",
    keywords: ["pie chart", "distribution", "object type"],
    image: "",
    metadata: {
      data: [
        { name: "Trade", value: 60 },
        { name: "Market", value: 18 },
        { name: "Risk", value: 10 },
        { name: "Settlement", value: 12 }
      ]
    }
  },
  "Trade Object Lifecycle": {
    id: "trade-object-lifecycle",
    type: "flowchart-widget", // Custom type for flowchart
    title: "Trade Object Lifecycle",
    description: "A flowchart describing the stages of a trade object's life, including decision points and loops.",
    module: "process-discovery",
    keywords: ["flowchart", "lifecycle", "trade"],
    image: "",
    metadata: {
      nodes: [
        { id: "1", name: "Application Submission", type: "start" },
        { id: "2", name: "Initial Assessment", type: "process" },
        { id: "3", name: "Rejected", type: "end" },
        { id: "4", name: "Pre-Approval", type: "process" },
        { id: "5", name: "Appraisal Request", type: "process" },
        { id: "6", name: "Valuation issues", type: "decision" },
        { id: "7", name: "Valuation Accepted", type: "process" },
        { id: "8", name: "Additional Info", type: "process" },
        { id: "9", name: "Underwriting Approved", type: "process" },
        { id: "10", name: "Final Approval", type: "process" },
        { id: "11", name: "Underwriting Rejected", type: "process" },
        { id: "12", name: "Signing of Loan Agreement", type: "process" },
        { id: "13", name: "Loan Funding", type: "process" },
        { id: "14", name: "Disbursement of funds", type: "process" },
        { id: "15", name: "Loan Closure", type: "end" }
      ],
      edges: [
        { from: "1", to: "2" },
        { from: "2", to: "3", condition: "Reject" },
        { from: "2", to: "4", condition: "Approve" },
        { from: "4", to: "5" },
        { from: "5", to: "6" },
        { from: "6", to: "5", condition: "Issues" },
        { from: "6", to: "7", condition: "No Issues" },
        { from: "7", to: "8" },
        { from: "8", to: "9" },
        { from: "9", to: "10" },
        { from: "9", to: "11", condition: "Reject" },
        { from: "11", to: "3" },
        { from: "10", to: "12" },
        { from: "12", to: "13" },
        { from: "13", to: "14" },
        { from: "14", to: "15" }
      ]
    }
  },
  "Failure Pattern Analysis": {
    id: "failure-pattern-analysis",
    type: "bar-chart",
    title: "Failure Pattern Analysis",
    description: "A bar graph showing Failure Patterns by SOP Pattern (Case Count/Outlier Sum) across 13 SOP patterns.",
    module: "outlier-analysis",
    keywords: ["bar chart", "failure", "patterns", "sop"],
    image: "",
    metadata: {
      data: [
        { pattern: "1", count: 1200, outliers: 150 },
        { pattern: "2", count: 2200, outliers: 300 },
        { pattern: "3", count: 2300, outliers: 350 },
        { pattern: "4", count: 1100, outliers: 100 },
        { pattern: "5", count: 900, outliers: 80 },
        { pattern: "6", count: 800, outliers: 70 },
        { pattern: "7", count: 2000, outliers: 280 },
        { pattern: "8", count: 700, outliers: 60 },
        { pattern: "9", count: 600, outliers: 50 },
        { pattern: "10", count: 500, outliers: 40 },
        { pattern: "11", count: 400, outliers: 30 },
        { pattern: "12", count: 300, outliers: 25 },
        { pattern: "13", count: 200, outliers: 20 }
      ],
      xAxis: "SOP Pattern",
      yAxis: "Count",
      peaks: [2, 3, 7]
    }
  },
  "Process Failure Patterns Distribution": {
    id: "process-failure-patterns",
    type: "bar-chart",
    title: "Process Failure Patterns Distribution",
    description: "Bar chart summarizing counts/outlier sums for various failure pattern types.",
    module: "outlier-analysis",
    keywords: ["bar chart", "failure", "distribution"],
    image: "",
    metadata: {
      data: [
        { name: "SOP Deviations", value: 14470 },
        { name: "Operational Overhead", value: 6180 },
        { name: "Long Running", value: 213 },
        { name: "Resource Switches", value: 93 },
        { name: "Incomplete Cases", value: 1 },
        { name: "Timing Violations", value: 2 }
      ],
      xAxis: "Failure Type",
      yAxis: "Count/Sum"
    }
  },
  "Resource Performance": {
    id: "resource-performance",
    type: "scatter-chart",
    title: "Resource Performance (Avg Step Duration)",
    description: "A scatter plot showing average step duration by resource.",
    module: "outlier-analysis",
    keywords: ["scatter plot", "resource", "performance", "duration"],
    image: "",
    metadata: {
      data: [
        { resource: "TFOSTER", duration: 85.7, isOutlier: true },
        { resource: "WDAVIS", duration: 83.2, isOutlier: false },
        { resource: "TPARKER", duration: 82.9, isOutlier: false },
        { resource: "SGARCIA", duration: 83.5, isOutlier: false },
        { resource: "RPA", duration: 82.7, isOutlier: false },
        { resource: "PMITCHELL", duration: 83.8, isOutlier: false },
        { resource: "PMILLER", duration: 83.9, isOutlier: false },
        { resource: "MBROWN", duration: 82.8, isOutlier: false },
        { resource: "MALLEN", duration: 83.6, isOutlier: false },
        { resource: "LWILSON", duration: 84.0, isOutlier: false },
        { resource: "LJONES", duration: 83.3, isOutlier: false },
        { resource: "KCLARK", duration: 83.7, isOutlier: false },
        { resource: "JSMITH", duration: 83.1, isOutlier: false },
        { resource: "HCOOPER", duration: 82.5, isOutlier: false },
        { resource: "HBAKER", duration: 83.0, isOutlier: false },
        { resource: "EADAMS", duration: 84.1, isOutlier: false },
        { resource: "DJOHNSON", duration: 83.4, isOutlier: false },
        { resource: "CMARTIN", duration: 82.6, isOutlier: false },
        { resource: "ABAKER", duration: 82.4, isOutlier: false }
      ],
      xAxis: "Resource",
      yAxis: "Avg. Duration (Hours)",
      outliers: ["TFOSTER"]
    }
  },
  "Distribution of Time Gaps": {
    id: "time-gaps-distribution",
    type: "bar-chart",
    title: "Distribution of Time Gaps: Application Submission -> Initial Assessment",
    description: "Histogram showing the time gap distribution between the two activities.",
    module: "outlier-analysis",
    keywords: ["histogram", "time gaps", "distribution"],
    image: "",
    metadata: {
      data: [
        { range: "80-100", count: 400 },
        { range: "100-120", count: 800 },
        { range: "120-140", count: 1200 },
        { range: "140-160", count: 1500 },
        { range: "160-180", count: 900 },
        { range: "180-200", count: 300 },
        { range: "200-220", count: 100 }
      ],
      threshold: 180.54,
      xAxis: "Hours",
      yAxis: "Count",
      distribution: "right-skewed"
    }
  },
  // Adding a few more visualizations. For a complete implementation, all 20 would need to be defined.
  "Case Complexity Analysis": {
    id: "case-complexity-analysis",
    type: "scatter-chart",
    title: "Case Complexity Analysis",
    description: "Scatter plot analyzing complexity outliers using Z-score.",
    module: "outlier-analysis",
    keywords: ["scatter plot", "complexity", "z-score"],
    image: "",
    metadata: {
      data: Array.from({ length: 30 }, (_, i) => ({
        caseId: `CASE_${1000 + i}`,
        zScore: 1.5 + Math.random() * 1.3,
        isOutlier: false
      })),
      threshold: 3.0,
      xAxis: "Case ID",
      yAxis: "Composite Z-Score"
    }
  }
  // Additional visualizations would follow the same pattern
};

// Function to find a visualization by title match
export function findVisualizationByTitle(title: string): Widget | null {
  // Exact match
  if (visualizationLibrary[title]) {
    return visualizationLibrary[title];
  }
  
  // Partial match (title contains)
  const lowerTitle = title.toLowerCase();
  const partialMatch = Object.keys(visualizationLibrary).find(key => 
    lowerTitle.includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    return visualizationLibrary[partialMatch];
  }
  
  // Keywords match
  const matchByKeywords = Object.values(visualizationLibrary).find(vis => 
    vis.keywords.some(keyword => lowerTitle.includes(keyword.toLowerCase()))
  );
  
  if (matchByKeywords) {
    return matchByKeywords;
  }
  
  return null;
}

// Function to normalize large datasets if needed
export function normalizeData(data: any[], maxPoints: number = 50): any[] {
  if (data.length <= maxPoints) return data;
  
  // Simple sampling for large datasets
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
}

// Function to detect and add analysis markers
export function enhanceChart(widget: Widget): Widget {
  const enhancedWidget = { ...widget };
  
  if (!enhancedWidget.metadata) {
    enhancedWidget.metadata = {};
  }
  
  // Add threshold markers if needed
  if (widget.type === "bar-chart" || widget.type === "line-chart" || widget.type === "histogram") {
    if (!enhancedWidget.metadata.thresholds && widget.type === "bar-chart") {
      // Calculate a simple threshold as 80% of the maximum value
      const maxValue = Math.max(...widget.metadata.data.map((d: any) => d.value || d.count || 0));
      enhancedWidget.metadata.thresholds = [{ value: maxValue * 0.8, label: "Threshold", color: "#ff0000" }];
    }
  }
  
  // For scatter plots, highlight outliers
  if (widget.type === "scatter-chart" && widget.metadata.outliers) {
    enhancedWidget.metadata.data = widget.metadata.data.map((point: any) => ({
      ...point,
      highlighted: widget.metadata.outliers.includes(point.resource || point.caseId)
    }));
  }
  
  return enhancedWidget;
}
