
export interface Widget {
  id: string;
  type: string;
  title: string;
  description: string;
  module: 'outlier-analysis' | 'process-discovery' | 'controls-monitoring';
  image: string;
  keywords: string[];
  metadata: Record<string, any>;
}

export const mockWidgets: Widget[] = [
  {
    id: "w1",
    type: "bar-chart",
    title: "Failure Pattern Analysis",
    description: "Analysis of failure patterns by SOP category",
    module: "outlier-analysis",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    keywords: ["failure", "pattern", "sop", "analysis", "outlier"],
    metadata: {
      xAxis: "SOP Categories",
      yAxis: "Failure Count",
      legend: ["Critical", "Major", "Minor"],
      data: [
        { category: "Documentation", critical: 24, major: 18, minor: 30 },
        { category: "Process", critical: 14, major: 22, minor: 42 },
        { category: "Training", critical: 8, major: 15, minor: 20 },
        { category: "Equipment", critical: 18, major: 10, minor: 15 },
        { category: "Materials", critical: 6, major: 12, minor: 18 }
      ]
    }
  },
  {
    id: "w2",
    type: "line-chart",
    title: "Process Execution Timeline",
    description: "Timeline analysis of process execution efficiency",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    keywords: ["process", "timeline", "execution", "efficiency", "discovery"],
    metadata: {
      xAxis: "Time Period",
      yAxis: "Execution Time (minutes)",
      legend: ["Actual", "Expected", "Threshold"],
      data: [
        { period: "Jan", actual: 45, expected: 30, threshold: 60 },
        { period: "Feb", actual: 42, expected: 30, threshold: 60 },
        { period: "Mar", actual: 38, expected: 30, threshold: 60 },
        { period: "Apr", actual: 35, expected: 30, threshold: 60 },
        { period: "May", actual: 32, expected: 30, threshold: 60 },
        { period: "Jun", actual: 29, expected: 30, threshold: 60 }
      ]
    }
  },
  {
    id: "w3",
    type: "pie-chart",
    title: "Control Effectiveness Distribution",
    description: "Distribution analysis of control effectiveness by category",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    keywords: ["control", "effectiveness", "distribution", "monitoring"],
    metadata: {
      legend: ["Effective", "Partially Effective", "Ineffective", "Not Tested"],
      data: [
        { name: "Effective", value: 65 },
        { name: "Partially Effective", value: 20 },
        { name: "Ineffective", value: 10 },
        { name: "Not Tested", value: 5 }
      ]
    }
  },
  {
    id: "w4",
    type: "heatmap",
    title: "Risk Concentration Map",
    description: "Visualization of risk concentration across processes and departments",
    module: "outlier-analysis",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    keywords: ["risk", "concentration", "map", "outlier", "visualization"],
    metadata: {
      xAxis: "Departments",
      yAxis: "Process Areas",
      data: [
        { x: "Finance", y: "Reporting", value: 85 },
        { x: "Finance", y: "Transactions", value: 60 },
        { x: "Finance", y: "Compliance", value: 75 },
        { x: "Operations", y: "Reporting", value: 40 },
        { x: "Operations", y: "Transactions", value: 70 },
        { x: "Operations", y: "Compliance", value: 50 },
        { x: "IT", y: "Reporting", value: 55 },
        { x: "IT", y: "Transactions", value: 65 },
        { x: "IT", y: "Compliance", value: 80 }
      ]
    }
  },
  {
    id: "w5",
    type: "data-table",
    title: "Control Testing Results",
    description: "Detailed results from control testing activities",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    keywords: ["control", "testing", "results", "monitoring", "detailed"],
    metadata: {
      columns: [
        { header: "Control ID", key: "id" },
        { header: "Description", key: "description" },
        { header: "Status", key: "status" },
        { header: "Last Test", key: "lastTest" },
        { header: "Frequency", key: "frequency" }
      ],
      data: [
        { id: "CTL-001", description: "Invoice approval process", status: "Effective", lastTest: "2023-04-15", frequency: "Monthly" },
        { id: "CTL-002", description: "User access review", status: "Partially Effective", lastTest: "2023-03-28", frequency: "Quarterly" },
        { id: "CTL-003", description: "Segregation of duties", status: "Effective", lastTest: "2023-04-01", frequency: "Monthly" },
        { id: "CTL-004", description: "Change management", status: "Ineffective", lastTest: "2023-03-15", frequency: "Per Change" },
        { id: "CTL-005", description: "Backup and recovery", status: "Effective", lastTest: "2023-04-10", frequency: "Weekly" }
      ]
    }
  },
  {
    id: "w6",
    type: "gauge-widget",
    title: "Overall Compliance Score",
    description: "Overall compliance score for current reporting period",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    keywords: ["compliance", "score", "gauge", "monitoring", "overall"],
    metadata: {
      min: 0,
      max: 100,
      value: 78,
      thresholds: [
        { value: 0, color: "red", label: "Low" },
        { value: 60, color: "yellow", label: "Medium" },
        { value: 80, color: "green", label: "High" }
      ]
    }
  },
  {
    id: "w7",
    type: "timeline-widget",
    title: "Process Execution Sequence",
    description: "Sequential timeline of process execution events",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    keywords: ["timeline", "sequence", "process", "events", "discovery"],
    metadata: {
      events: [
        { id: 1, date: "2023-04-01T09:00:00", title: "Process Start", description: "Initial trigger received" },
        { id: 2, date: "2023-04-01T09:15:00", title: "Data Validation", description: "Input data validated" },
        { id: 3, date: "2023-04-01T10:30:00", title: "Processing Complete", description: "Core processing activities completed" },
        { id: 4, date: "2023-04-01T11:45:00", title: "Quality Check", description: "Output quality verification performed" },
        { id: 5, date: "2023-04-01T13:00:00", title: "Process Complete", description: "Process execution finished" }
      ]
    }
  },
  {
    id: "w8",
    type: "kpi-widget",
    title: "Key Performance Metrics",
    description: "Summary of key performance indicators with trend analysis",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    keywords: ["kpi", "metrics", "performance", "trend", "summary", "discovery"],
    metadata: {
      metrics: [
        { name: "Process Efficiency", value: "85%", trend: "up", changePercent: 5 },
        { name: "Error Rate", value: "2.3%", trend: "down", changePercent: 1.5 },
        { name: "Compliance Score", value: "92%", trend: "up", changePercent: 3 },
        { name: "Cycle Time", value: "4.2 days", trend: "down", changePercent: 8 }
      ]
    }
  },
  {
    id: "w9",
    type: "map-widget",
    title: "Geographical Process Distribution",
    description: "Visualization of process execution across geographic regions",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    keywords: ["map", "geographical", "distribution", "regions", "discovery"],
    metadata: {
      regions: [
        { id: "NA", name: "North America", value: 245, color: "#67B7DC" },
        { id: "EU", name: "Europe", value: 185, color: "#6771DC" },
        { id: "AS", name: "Asia", value: 310, color: "#67DCBC" },
        { id: "SA", name: "South America", value: 85, color: "#DC67CE" },
        { id: "AF", name: "Africa", value: 40, color: "#DCCE67" },
        { id: "OC", name: "Oceania", value: 65, color: "#DC8A67" }
      ]
    }
  },
  {
    id: "w10",
    type: "treemap-widget",
    title: "Control Framework Hierarchy",
    description: "Hierarchical visualization of the control framework structure",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    keywords: ["treemap", "hierarchy", "control", "framework", "structure", "monitoring"],
    metadata: {
      data: {
        name: "Controls",
        children: [
          {
            name: "Financial",
            children: [
              { name: "Reporting", value: 35 },
              { name: "Treasury", value: 20 },
              { name: "Tax", value: 15 }
            ]
          },
          {
            name: "Operational",
            children: [
              { name: "Supply Chain", value: 25 },
              { name: "Manufacturing", value: 30 }
            ]
          },
          {
            name: "IT",
            children: [
              { name: "Security", value: 40 },
              { name: "Change Management", value: 25 },
              { name: "Disaster Recovery", value: 18 }
            ]
          }
        ]
      }
    }
  },
  {
    id: "w11",
    type: "bullet-chart",
    title: "Target vs Actual Performance",
    description: "Comparison of actual performance against targets",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    keywords: ["bullet", "target", "actual", "performance", "comparison", "discovery"],
    metadata: {
      metrics: [
        { name: "Revenue", actual: 85, target: 100, ranges: [50, 75, 100] },
        { name: "Cost", actual: 65, target: 50, ranges: [100, 75, 50] },
        { name: "Customer Satisfaction", actual: 78, target: 80, ranges: [60, 70, 80] },
        { name: "Process Efficiency", actual: 82, target: 75, ranges: [50, 65, 80] }
      ]
    }
  },
  {
    id: "w12",
    type: "wordcloud-widget",
    title: "Common Control Failure Reasons",
    description: "Visualization of common reasons for control failures",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    keywords: ["wordcloud", "control", "failure", "reasons", "monitoring"],
    metadata: {
      words: [
        { text: "Documentation", value: 85 },
        { text: "Training", value: 65 },
        { text: "Communication", value: 75 },
        { text: "Resources", value: 45 },
        { text: "Technology", value: 60 },
        { text: "Knowledge", value: 55 },
        { text: "Procedures", value: 70 },
        { text: "Oversight", value: 65 },
        { text: "Complexity", value: 50 },
        { text: "Turnover", value: 45 }
      ]
    }
  },
  {
    id: "w13",
    type: "accordion-widget",
    title: "Detailed Control Documentation",
    description: "Expandable sections with detailed control documentation",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    keywords: ["accordion", "control", "documentation", "detailed", "monitoring"],
    metadata: {
      sections: [
        {
          title: "Control Objective",
          content: "Ensure all financial transactions are properly authorized and recorded in accordance with company policies and accounting standards."
        },
        {
          title: "Control Activities",
          content: "1. Review and approval of transactions by appropriate personnel.\n2. Segregation of duties between transaction initiation, approval, and recording.\n3. Regular reconciliation of accounts and ledgers."
        },
        {
          title: "Testing Procedures",
          content: "1. Sample selection of transactions for detailed testing.\n2. Documentation review of approvals and supporting evidence.\n3. Interviews with key personnel responsible for control execution."
        },
        {
          title: "Remediation Process",
          content: "1. Documentation of control failures and root cause analysis.\n2. Development of remediation plans with clear ownership.\n3. Follow-up testing to confirm effectiveness of remediation actions."
        }
      ]
    }
  },
  {
    id: "w14",
    type: "progress-widget",
    title: "Control Implementation Progress",
    description: "Visualization of control implementation progress by area",
    module: "controls-monitoring",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    keywords: ["progress", "control", "implementation", "monitoring"],
    metadata: {
      areas: [
        { name: "Financial Controls", progress: 85 },
        { name: "IT Controls", progress: 70 },
        { name: "Operational Controls", progress: 60 },
        { name: "Compliance Controls", progress: 90 },
        { name: "Reporting Controls", progress: 75 }
      ]
    }
  },
  {
    id: "w15",
    type: "info-card-small",
    title: "Process Execution Summary",
    description: "Quick summary of process execution statistics",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    keywords: ["summary", "process", "execution", "statistics", "discovery"],
    metadata: {
      stats: [
        { label: "Total Executions", value: "1,245" },
        { label: "Avg Duration", value: "4.2 min" },
        { label: "Success Rate", value: "94.8%" }
      ]
    }
  },
  {
    id: "w16",
    type: "list-widget",
    title: "Top Process Bottlenecks",
    description: "Sortable list of identified process bottlenecks",
    module: "process-discovery",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    keywords: ["list", "bottlenecks", "process", "sortable", "discovery"],
    metadata: {
      items: [
        { id: 1, name: "Manual Data Entry", impact: "High", frequency: "Daily", timeImpact: "45 min" },
        { id: 2, name: "Approval Delays", impact: "Medium", frequency: "Weekly", timeImpact: "2 hours" },
        { id: 3, name: "System Integration Issues", impact: "High", frequency: "Monthly", timeImpact: "4 hours" },
        { id: 4, name: "Documentation Requirements", impact: "Low", frequency: "Daily", timeImpact: "20 min" },
        { id: 5, name: "Resource Availability", impact: "Medium", frequency: "Weekly", timeImpact: "3 hours" }
      ],
      sortOptions: ["impact", "frequency", "timeImpact"]
    }
  }
];

export function findWidgetsByQuery(query: string): Widget[] {
  const normalizedQuery = query.toLowerCase();
  return mockWidgets.filter(widget => {
    // Check if any keywords match
    const keywordMatch = widget.keywords.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase())
    );
    
    // Check if title or description match
    const titleMatch = widget.title.toLowerCase().includes(normalizedQuery);
    const descMatch = widget.description.toLowerCase().includes(normalizedQuery);
    
    return keywordMatch || titleMatch || descMatch;
  });
}

// Mock data for weather card
export const weatherData = {
  location: "New York, NY",
  temperature: 72,
  condition: "Partly Cloudy",
  humidity: 65,
  wind: "8 mph"
};

// Mock data for news card
export const newsData = [
  {
    title: "AI Developments Transform Business Analytics",
    source: "Tech Insights",
    url: "#"
  },
  {
    title: "New Regulatory Framework for Process Controls",
    source: "Business Weekly",
    url: "#"
  },
  {
    title: "Companies Adopting Advanced Analytics at Record Pace",
    source: "Data Science Journal",
    url: "#"
  }
];
