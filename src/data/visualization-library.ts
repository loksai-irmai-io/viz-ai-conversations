
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
    type: "flowchart-widget", 
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
  "Activities Performed by ABAKER": {
    id: "activities-by-abaker",
    type: "bar-chart",
    title: "Activities Performed by ABAKER",
    description: "A bar graph showing activity counts by resource ABAKER.",
    module: "outlier-analysis",
    keywords: ["bar chart", "activities", "resource", "ABAKER"],
    image: "",
    metadata: {
      data: [
        { name: "Application Submission", value: 2800 },
        { name: "Appraisal Request", value: 1200 },
        { name: "Valuation Accepted", value: 900 },
        { name: "Final Approval", value: 1500 },
        { name: "Loan Closure", value: 800 },
        { name: "Signing of Loan Agreement", value: 1100 },
        { name: "Disbursement of funds", value: 1300 },
        { name: "Loan funding", value: 700 },
        { name: "Rejected", value: 300 },
        { name: "Additional info required", value: 1000 },
        { name: "Valuation issues", value: 500 },
        { name: "Underwriting rejected", value: 200 }
      ],
      xAxis: "Activity",
      yAxis: "Count"
    }
  },
  "Resource Summary Table": {
    id: "resource-summary-table",
    type: "data-table",
    title: "Resource Summary Table",
    description: "A table summarizing resource-level performance data.",
    module: "outlier-analysis",
    keywords: ["table", "resource", "performance", "summary"],
    image: "",
    metadata: {
      columns: [
        { header: "Resource", key: "resource" },
        { header: "Total Events", key: "events" },
        { header: "Avg. Step Dur (H)", key: "avgDuration" },
        { header: "Workload IQR Outlier", key: "workloadOutlier" },
        { header: "Step Dur IQR Outlier", key: "durationOutlier" }
      ],
      data: [
        { resource: "ABAKER", events: 12405, avgDuration: 82.4, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "CMARTIN", events: 10982, avgDuration: 82.6, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "DJOHNSON", events: 11567, avgDuration: 83.4, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "EADAMS", events: 13102, avgDuration: 84.1, workloadOutlier: "Yes", durationOutlier: "No" },
        { resource: "HBAKER", events: 11234, avgDuration: 83.0, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "HCOOPER", events: 10789, avgDuration: 82.5, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "JSMITH", events: 11324, avgDuration: 83.1, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "KCLARK", events: 11876, avgDuration: 83.7, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "LJONES", events: 11456, avgDuration: 83.3, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "LWILSON", events: 12087, avgDuration: 84.0, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "MALLEN", events: 11654, avgDuration: 83.6, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "MBROWN", events: 10923, avgDuration: 82.8, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "PMILLER", events: 11987, avgDuration: 83.9, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "PMITCHELL", events: 11876, avgDuration: 83.8, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "RPA", events: 10876, avgDuration: 82.7, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "SGARCIA", events: 11543, avgDuration: 83.5, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "TPARKER", events: 11123, avgDuration: 82.9, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "WDAVIS", events: 11345, avgDuration: 83.2, workloadOutlier: "No", durationOutlier: "No" },
        { resource: "TFOSTER", events: 14587, avgDuration: 85.7, workloadOutlier: "Yes", durationOutlier: "Yes" }
      ],
      highlightRows: ["TFOSTER", "EADAMS"]
    }
  },
  "Activity Duration Outliers": {
    id: "activity-duration-outliers",
    type: "line-chart",
    title: "Activity Duration Outliers (Based on Timing Violations)",
    description: "A line chart showing severity scores per activity based on timing violations.",
    module: "outlier-analysis",
    keywords: ["line chart", "activity", "duration", "outliers", "timing violations"],
    image: "",
    metadata: {
      data: [
        { activity: "Application Submission", score: 1.8 },
        { activity: "Initial Assessment", score: 2.1 },
        { activity: "Pre-Approval", score: 1.5 },
        { activity: "Appraisal Request", score: 2.3 },
        { activity: "Valuation issues", score: 1.7 },
        { activity: "Valuation Accepted", score: 2.2 },
        { activity: "Additional info", score: 1.9 },
        { activity: "Underwriting", score: 2.5 },
        { activity: "Final Approval", score: 2.0 },
        { activity: "Signing of Loan Agreement", score: 1.6 },
        { activity: "Loan funding", score: 2.4 },
        { activity: "Disbursement", score: 2.7 }
      ],
      threshold: 3.0,
      xAxis: "Activity",
      yAxis: "Severity Score"
    }
  },
  "Activity Timing Summary": {
    id: "activity-timing-summary",
    type: "data-table",
    title: "Activity Timing Summary (Based on Gaps After)",
    description: "A table summarizing timing data for various activities.",
    module: "outlier-analysis",
    keywords: ["table", "activity", "timing", "summary"],
    image: "",
    metadata: {
      columns: [
        { header: "Activity", key: "activity" },
        { header: "Score", key: "score" },
        { header: "Outlier", key: "outlier" },
        { header: "Violation Rate (%)", key: "violationRate" },
        { header: "Violations", key: "violations" },
        { header: "Total Events", key: "events" }
      ],
      data: [
        { activity: "Application Submission", score: 1.8, outlier: "No", violationRate: 4.3, violations: 125, events: 2908 },
        { activity: "Initial Assessment", score: 2.1, outlier: "No", violationRate: 5.1, violations: 143, events: 2804 },
        { activity: "Pre-Approval", score: 1.5, outlier: "No", violationRate: 3.2, violations: 83, events: 2594 },
        { activity: "Appraisal Request", score: 2.3, outlier: "No", violationRate: 6.7, violations: 168, events: 2507 },
        { activity: "Valuation issues", score: 1.7, outlier: "No", violationRate: 4.5, violations: 98, events: 2178 },
        { activity: "Valuation Accepted", score: 2.2, outlier: "No", violationRate: 5.6, violations: 120, events: 2143 },
        { activity: "Additional info", score: 1.9, outlier: "No", violationRate: 4.9, violations: 95, events: 1939 },
        { activity: "Underwriting", score: 2.5, outlier: "No", violationRate: 7.1, violations: 133, events: 1873 },
        { activity: "Final Approval", score: 2.0, outlier: "No", violationRate: 5.2, violations: 94, events: 1808 },
        { activity: "Signing of Loan Agreement", score: 1.6, outlier: "No", violationRate: 3.8, violations: 63, events: 1658 },
        { activity: "Loan funding", score: 2.4, outlier: "No", violationRate: 6.9, violations: 98, events: 1420 },
        { activity: "Disbursement", score: 2.7, outlier: "No", violationRate: 8.3, violations: 102, events: 1229 }
      ]
    }
  },
  "Activity Pair Summary Stats": {
    id: "activity-pair-summary",
    type: "data-table",
    title: "Activity Pair Summary Stats",
    description: "Table of transition time metrics between pairs of activities.",
    module: "outlier-analysis",
    keywords: ["table", "activity", "pair", "transition", "summary"],
    image: "",
    metadata: {
      columns: [
        { header: "Transition", key: "transition" },
        { header: "Threshold (h)", key: "threshold" },
        { header: "Avg (h)", key: "avg" },
        { header: "Median (h)", key: "median" },
        { header: "Min (h)", key: "min" },
        { header: "Max (h)", key: "max" },
        { header: "Occurrences", key: "occurrences" }
      ],
      data: [
        { transition: "Application Submission -> Initial Assessment", threshold: 180.54, avg: 142.3, median: 145.2, min: 86.5, max: 212.8, occurrences: 2804 },
        { transition: "Initial Assessment -> Pre-Approval", threshold: 120.87, avg: 98.5, median: 102.3, min: 56.8, max: 178.9, occurrences: 2594 },
        { transition: "Pre-Approval -> Appraisal Request", threshold: 96.42, avg: 78.9, median: 76.5, min: 43.2, max: 156.7, occurrences: 2507 },
        { transition: "Appraisal Request -> Valuation issues", threshold: 72.36, avg: 58.4, median: 62.1, min: 24.5, max: 128.3, occurrences: 345 },
        { transition: "Appraisal Request -> Valuation Accepted", threshold: 84.21, avg: 67.8, median: 70.2, min: 36.7, max: 142.5, occurrences: 2162 },
        { transition: "Valuation issues -> Valuation Accepted", threshold: 48.75, avg: 35.6, median: 38.9, min: 18.3, max: 86.4, occurrences: 345 },
        { transition: "Valuation Accepted -> Additional info", threshold: 60.18, avg: 46.3, median: 49.5, min: 22.1, max: 96.7, occurrences: 2143 },
        { transition: "Additional info -> Underwriting", threshold: 72.93, avg: 56.8, median: 58.4, min: 28.9, max: 118.5, occurrences: 1939 },
        { transition: "Underwriting -> Final Approval", threshold: 48.36, avg: 32.5, median: 35.7, min: 15.6, max: 82.3, occurrences: 1808 },
        { transition: "Underwriting -> Rejected", threshold: 36.84, avg: 24.7, median: 26.8, min: 12.4, max: 64.9, occurrences: 131 },
        { transition: "Final Approval -> Signing of Loan Agreement", threshold: 72.51, avg: 58.3, median: 59.7, min: 32.4, max: 116.8, occurrences: 1658 },
        { transition: "Signing of Loan Agreement -> Loan funding", threshold: 60.27, avg: 48.9, median: 46.3, min: 25.7, max: 97.2, occurrences: 1420 },
        { transition: "Loan funding -> Disbursement", threshold: 48.69, avg: 36.2, median: 38.5, min: 18.9, max: 76.8, occurrences: 1229 },
        { transition: "Disbursement -> Loan Closure", threshold: 36.42, avg: 28.7, median: 26.9, min: 14.2, max: 62.5, occurrences: 1229 }
      ]
    }
  },
  "Case Details": {
    id: "case-details",
    type: "data-table",
    title: "Case Details for: Application Submission -> Initial Assessment",
    description: "A detailed case-level table showing transition times.",
    module: "outlier-analysis",
    keywords: ["table", "case", "details", "transition", "time"],
    image: "",
    metadata: {
      columns: [
        { header: "Case ID", key: "caseId" },
        { header: "Hours", key: "hours" },
        { header: "Minutes", key: "minutes" },
        { header: "Exceeds", key: "exceeds" }
      ],
      data: [
        { caseId: "MORT_1001", hours: 165.8, minutes: 9948.0, exceeds: "No" },
        { caseId: "MORT_1023", hours: 142.3, minutes: 8538.0, exceeds: "No" },
        { caseId: "MORT_1045", hours: 178.2, minutes: 10692.0, exceeds: "No" },
        { caseId: "MORT_1067", hours: 156.5, minutes: 9390.0, exceeds: "No" },
        { caseId: "MORT_1089", hours: 189.7, minutes: 11382.0, exceeds: "Yes" },
        { caseId: "MORT_1112", hours: 132.4, minutes: 7944.0, exceeds: "No" },
        { caseId: "MORT_1134", hours: 168.9, minutes: 10134.0, exceeds: "No" },
        { caseId: "MORT_1156", hours: 183.6, minutes: 11016.0, exceeds: "Yes" },
        { caseId: "MORT_1178", hours: 145.7, minutes: 8742.0, exceeds: "No" },
        { caseId: "MORT_1201", hours: 172.3, minutes: 10338.0, exceeds: "No" }
      ],
      threshold: 180.54
    }
  },
  "Distribution of Time Gaps Combined": {
    id: "time-gaps-combined",
    type: "bar-chart",
    title: "Distribution of Time Gaps: Application Submission + Initial Assessment",
    description: "Histogram showing combined time gaps for the two activities.",
    module: "outlier-analysis",
    keywords: ["histogram", "time gaps", "distribution", "combined"],
    image: "",
    metadata: {
      data: [
        { range: "60-80", count: 250 },
        { range: "80-100", count: 580 },
        { range: "100-120", count: 920 },
        { range: "120-140", count: 1380 },
        { range: "140-160", count: 1650 },
        { range: "160-180", count: 1020 },
        { range: "180-200", count: 420 },
        { range: "200-220", count: 180 },
        { range: "220-240", count: 50 }
      ],
      threshold: 180.54,
      xAxis: "Hours",
      yAxis: "Count",
      distribution: "right-skewed"
    }
  },
  "Case Complexity Evaluation": {
    id: "case-complexity-evaluation",
    type: "scatter-chart",
    title: "Case Complexity Evaluation",
    description: "Scatter plot evaluating case complexity based on Z-score and event count.",
    module: "outlier-analysis",
    keywords: ["scatter plot", "case", "complexity", "evaluation", "z-score"],
    image: "",
    metadata: {
      data: [
        { caseId: "MORT_1001", zScore: 1.72, eventCount: 18, isOutlier: false },
        { caseId: "MORT_1023", zScore: 1.85, eventCount: 20, isOutlier: false },
        { caseId: "MORT_1045", zScore: 2.13, eventCount: 24, isOutlier: false },
        { caseId: "MORT_1067", zScore: 2.45, eventCount: 26, isOutlier: false },
        { caseId: "MORT_1089", zScore: 2.78, eventCount: 32, isOutlier: false },
        { caseId: "MORT_1112", zScore: 1.94, eventCount: 22, isOutlier: false },
        { caseId: "MORT_1134", zScore: 2.36, eventCount: 26, isOutlier: false },
        { caseId: "MORT_1156", zScore: 2.67, eventCount: 30, isOutlier: false },
        { caseId: "MORT_1178", zScore: 1.58, eventCount: 16, isOutlier: false },
        { caseId: "MORT_1201", zScore: 2.24, eventCount: 25, isOutlier: false }
      ],
      xAxis: "Z-Score",
      yAxis: "Event Count",
      threshold: 3.0
    }
  },
  "Case Complexity Scatter Plot": {
    id: "case-complexity-scatter-plot",
    type: "scatter-chart",
    title: "Case Complexity Scatter Plot",
    description: "Detailed view of case IDs against Z-scores.",
    module: "outlier-analysis",
    keywords: ["scatter plot", "case", "complexity", "z-score"],
    image: "",
    metadata: {
      data: [
        { caseId: "MORT_1001", zScore: 1.72 },
        { caseId: "MORT_1023", zScore: 1.85 },
        { caseId: "MORT_1045", zScore: 2.13 },
        { caseId: "MORT_1067", zScore: 2.45 },
        { caseId: "MORT_1089", zScore: 2.78 },
        { caseId: "MORT_1112", zScore: 1.94 },
        { caseId: "MORT_1134", zScore: 2.36 },
        { caseId: "MORT_1156", zScore: 2.67 },
        { caseId: "MORT_1178", zScore: 1.58 },
        { caseId: "MORT_1201", zScore: 2.24 },
        { caseId: "MORT_2001", zScore: 1.79 },
        { caseId: "MORT_3001", zScore: 2.01 },
        { caseId: "MORT_4001", zScore: 2.56 },
        { caseId: "MORT_5001", zScore: 1.87 },
        { caseId: "MORT_6001", zScore: 2.32 },
        { caseId: "MORT_7001", zScore: 2.45 },
        { caseId: "MORT_8001", zScore: 1.92 },
        { caseId: "MORT_8890", zScore: 2.61 }
      ],
      xAxis: "Case ID",
      yAxis: "Z-Score",
      threshold: 3.0
    }
  },
  "Activity Time Distribution": {
    id: "activity-time-distribution",
    type: "bar-chart",
    title: "Activity Time Distribution for Initial Review",
    description: "Bar chart showing average time spent in the 'Initial Review' step.",
    module: "outlier-analysis",
    keywords: ["bar chart", "activity", "time", "distribution", "initial review"],
    image: "",
    metadata: {
      data: [
        { category: "Less than 1 hour", count: 150 },
        { category: "1-2 hours", count: 450 },
        { category: "2-4 hours", count: 780 },
        { category: "4-8 hours", count: 920 },
        { category: "8-16 hours", count: 380 },
        { category: "16-24 hours", count: 120 },
        { category: "More than 24 hours", count: 45 }
      ],
      xAxis: "Time Category",
      yAxis: "Count",
      average: 5.2
    }
  },
  "Event Distribution by Case Type": {
    id: "event-distribution-by-case-type",
    type: "bar-chart",
    title: "Event Distribution by Case Type",
    description: "Bar chart showing distribution of event types across different case categories.",
    module: "outlier-analysis",
    keywords: ["bar chart", "event", "distribution", "case type"],
    image: "",
    metadata: {
      data: [
        { type: "Mortgage Application", events: 8750 },
        { type: "Refinancing", events: 6320 },
        { type: "Home Equity", events: 4580 },
        { type: "Commercial Loan", events: 3260 },
        { type: "Auto Loan", events: 2840 },
        { type: "Personal Loan", events: 2150 }
      ],
      xAxis: "Case Type",
      yAxis: "Event Count",
      total: 27900
    }
  },
  "Case Complexity Analysis": {
    id: "case-complexity-analysis",
    type: "scatter-chart",
    title: "Case Complexity Analysis",
    description: "Scatter plot analyzing complexity outliers using Z-score.",
    module: "outlier-analysis",
    keywords: ["scatter plot", "case", "complexity", "analysis", "z-score"],
    image: "",
    metadata: {
      data: [
        { caseId: "MORT_1001", zScore: 1.72 },
        { caseId: "MORT_1023", zScore: 1.85 },
        { caseId: "MORT_1045", zScore: 2.13 },
        { caseId: "MORT_1067", zScore: 2.45 },
        { caseId: "MORT_1089", zScore: 2.78 },
        { caseId: "MORT_1112", zScore: 1.94 },
        { caseId: "MORT_1134", zScore: 2.36 },
        { caseId: "MORT_1156", zScore: 2.67 }
      ],
      xAxis: "Case ID",
      yAxis: "Composite Z-Score",
      threshold: 3.0
    }
  }
};

// Function to find a visualization by title match
export function findVisualizationByTitle(title: string): Widget | null {
  // Exact match
  if (visualizationLibrary[title]) {
    return visualizationLibrary[title];
  }
  
  // Case-insensitive exact match
  const caseInsensitiveMatch = Object.keys(visualizationLibrary).find(key => 
    key.toLowerCase() === title.toLowerCase()
  );
  
  if (caseInsensitiveMatch) {
    return visualizationLibrary[caseInsensitiveMatch];
  }
  
  // Partial match (title contains)
  const lowerTitle = title.toLowerCase();
  const partialMatch = Object.keys(visualizationLibrary).find(key => 
    lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)
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
