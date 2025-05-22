
import { parse } from 'papaparse';

// Interfaces for data processing
interface ColumnSummary {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'unknown';
  count: number;
  unique?: number;
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  stdDev?: number;
  quartiles?: [number, number, number];
}

interface DataSummary {
  rowCount: number;
  columnCount: number;
  columns: ColumnSummary[];
  correlations?: Record<string, Record<string, number>>;
  sampleData: any[];
}

// Process CSV data to generate summary statistics
export const generateDataSummary = (data: any[], columns: string[]): DataSummary => {
  const columnSummaries: ColumnSummary[] = [];
  const numericColumns: string[] = [];
  
  // Process each column
  columns.forEach(colName => {
    const columnData = data.map(row => row[colName]);
    
    // Determine column type and calculate statistics
    const numericValues = columnData
      .map(val => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) ? parsed : null;
      })
      .filter(val => val !== null) as number[];
    
    const isNumeric = numericValues.length > 0.5 * columnData.length;
    
    if (isNumeric) {
      numericColumns.push(colName);
      
      // Sort values for percentile calculations
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      const count = numericValues.length;
      
      // Calculate statistics
      const sum = numericValues.reduce((acc, val) => acc + val, 0);
      const mean = sum / count;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      
      // Calculate median and quartiles
      const median = sortedValues[Math.floor(count / 2)];
      const q1 = sortedValues[Math.floor(count / 4)];
      const q3 = sortedValues[Math.floor(3 * count / 4)];
      
      // Standard deviation
      const squareDiffs = numericValues.map(val => Math.pow(val - mean, 2));
      const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / count;
      const stdDev = Math.sqrt(avgSquareDiff);
      
      columnSummaries.push({
        name: colName,
        type: 'numeric',
        count,
        unique: new Set(numericValues).size,
        mean,
        median,
        min,
        max,
        stdDev,
        quartiles: [q1, median, q3]
      });
    } else {
      // Handle categorical data
      const uniqueValues = new Set(columnData);
      
      columnSummaries.push({
        name: colName,
        type: 'categorical',
        count: columnData.length,
        unique: uniqueValues.size
      });
    }
  });
  
  // Calculate correlations between numeric columns
  const correlations: Record<string, Record<string, number>> = {};
  
  if (numericColumns.length > 1) {
    numericColumns.forEach(col1 => {
      correlations[col1] = {};
      
      numericColumns.forEach(col2 => {
        if (col1 === col2) {
          correlations[col1][col2] = 1;
        } else {
          // Calculate correlation coefficient
          const values1 = data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
          const values2 = data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
          
          const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
          const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;
          
          const pairs = data
            .map(row => ({
              val1: parseFloat(row[col1]),
              val2: parseFloat(row[col2])
            }))
            .filter(pair => !isNaN(pair.val1) && !isNaN(pair.val2));
          
          // Pearson correlation calculation
          let sumNum = 0;
          let sumDen1 = 0;
          let sumDen2 = 0;
          
          pairs.forEach(pair => {
            const diff1 = pair.val1 - mean1;
            const diff2 = pair.val2 - mean2;
            
            sumNum += diff1 * diff2;
            sumDen1 += diff1 * diff1;
            sumDen2 += diff2 * diff2;
          });
          
          const correlation = sumDen1 > 0 && sumDen2 > 0 
            ? sumNum / (Math.sqrt(sumDen1) * Math.sqrt(sumDen2))
            : 0;
            
          correlations[col1][col2] = parseFloat(correlation.toFixed(3));
        }
      });
    });
  }
  
  return {
    rowCount: data.length,
    columnCount: columns.length,
    columns: columnSummaries,
    correlations: numericColumns.length > 1 ? correlations : undefined,
    sampleData: data.slice(0, 5)
  };
};

// Generate chart data for different visualization types
export const generateChartData = (data: any[], columns: string[], chartType: string) => {
  const isNumeric = (colName: string) => {
    const values = data.map(row => row[colName]);
    const numericValues = values
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));
      
    return numericValues.length > 0.5 * values.length;
  };

  // Get numeric and categorical columns
  const numericColumns = columns.filter(col => isNumeric(col));
  const categoricalColumns = columns.filter(col => !isNumeric(col));
  
  switch (chartType) {
    case 'bar': {
      // Default: first categorical column for x-axis, first numeric for y-axis
      const xAxis = categoricalColumns[0] || columns[0];
      const yAxis = numericColumns[0] || (xAxis !== columns[1] ? columns[1] : columns[2] || columns[0]);
      
      // Aggregate data by category
      const aggregated = new Map();
      
      data.forEach(row => {
        const category = row[xAxis];
        const value = parseFloat(row[yAxis]) || 0;
        
        if (!aggregated.has(category)) {
          aggregated.set(category, { [xAxis]: category, [yAxis]: value, count: 1 });
        } else {
          const current = aggregated.get(category);
          aggregated.set(category, {
            ...current,
            [yAxis]: current[yAxis] + value,
            count: current.count + 1
          });
        }
      });
      
      // Convert to array
      const result = Array.from(aggregated.values())
        .map(item => ({
          [xAxis]: item[xAxis],
          [yAxis]: parseFloat((item[yAxis] / item.count).toFixed(2))
        }))
        .sort((a, b) => (b[yAxis] as number) - (a[yAxis] as number))
        .slice(0, 15); // Limit to top 15 for readability
        
      return {
        type: 'bar-chart',
        title: `${yAxis} by ${xAxis}`,
        description: `Bar chart showing average ${yAxis} for each ${xAxis}`,
        metadata: {
          xAxis,
          yAxis,
          data: result
        }
      };
    }
    
    case 'line': {
      // For line charts, try to find time/date/sequential column for x-axis
      // For simplicity, we'll use the first column as x and first numeric as y
      const xAxis = columns[0];
      const yAxes = numericColumns.slice(0, 2); // Use up to 2 numeric columns for multi-line
      
      if (yAxes.length === 0) return null; // No numeric columns
      
      // Get unique x values and sort them
      const uniqueXValues = Array.from(new Set(data.map(row => row[xAxis])));
      const sortedXValues = uniqueXValues.sort();
      
      // Prepare result with one row per x value
      const result = sortedXValues.map(xValue => {
        const matchingRows = data.filter(row => row[xAxis] === xValue);
        
        const resultRow: any = { [xAxis]: xValue };
        
        yAxes.forEach(yAxis => {
          const values = matchingRows.map(row => parseFloat(row[yAxis]) || 0);
          const sum = values.reduce((acc, val) => acc + val, 0);
          resultRow[yAxis] = parseFloat((sum / values.length).toFixed(2));
        });
        
        return resultRow;
      });
      
      return {
        type: 'line-chart',
        title: `${yAxes.join(' & ')} over ${xAxis}`,
        description: `Line chart showing ${yAxes.join(' and ')} trends across ${xAxis}`,
        metadata: {
          xAxis: xAxis,
          data: result
        }
      };
    }
    
    case 'scatter': {
      // Use first two numeric columns for scatter plot
      if (numericColumns.length < 2) return null;
      
      const xAxis = numericColumns[0];
      const yAxis = numericColumns[1];
      
      const result = data.map(row => ({
        x: row[xAxis],
        y: parseFloat(row[yAxis]) || 0
      })).filter(item => !isNaN(item.y));
      
      return {
        type: 'scatter-chart',
        title: `${yAxis} vs ${xAxis}`,
        description: `Scatter plot showing relationship between ${xAxis} and ${yAxis}`,
        metadata: {
          xAxisLabel: xAxis,
          yAxisLabel: yAxis,
          data: result
        }
      };
    }
    
    case 'pie': {
      // Use first categorical column and count occurrences or sum by first numeric
      const categoryColumn = categoricalColumns[0] || columns[0];
      const valueColumn = numericColumns[0];
      
      // Count or sum by category
      const aggregated = new Map();
      
      data.forEach(row => {
        const category = row[categoryColumn];
        const value = valueColumn ? parseFloat(row[valueColumn]) || 0 : 1;
        
        if (!aggregated.has(category)) {
          aggregated.set(category, { name: category, value });
        } else {
          const current = aggregated.get(category);
          aggregated.set(category, {
            ...current,
            value: current.value + value
          });
        }
      });
      
      // Convert to array and sort
      const result = Array.from(aggregated.values())
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Limit to top 10 for pie chart readability
        
      return {
        type: 'pie-chart',
        title: valueColumn 
          ? `${categoryColumn} Distribution by ${valueColumn}`
          : `${categoryColumn} Distribution`,
        description: `Pie chart showing distribution of ${valueColumn || 'count'} across ${categoryColumn} categories`,
        metadata: {
          data: result
        }
      };
    }
    
    case 'data-table': {
      return {
        type: 'data-table',
        title: 'Data Table',
        description: 'Tabular view of the CSV data',
        metadata: {
          columns: columns.map(col => ({ key: col, header: col })),
          data: data.slice(0, 100) // Limit to first 100 rows for performance
        }
      };
    }
    
    default:
      return null;
  }
};
