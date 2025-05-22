
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, LineChart, ScatterChart, PieChart, ListFilter,
  Table as TableIcon, Download, RefreshCw
} from 'lucide-react';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import WidgetRenderer from './widgets/WidgetRenderer';
import { generateDataSummary, generateChartData } from '@/services/csvProcessingService';

interface CsvVisualizerProps {
  fileName: string;
  data: any[];
  columns: string[];
}

const CsvVisualizer: React.FC<CsvVisualizerProps> = ({ fileName, data, columns }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [summaryData, setSummaryData] = useState<any>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Process data on component mount
  useEffect(() => {
    const processCsvData = async () => {
      setIsLoading(true);
      
      try {
        // Generate summary statistics
        const summary = generateDataSummary(data, columns);
        setSummaryData(summary);
        
        // Generate various chart types
        const chartTypes = ['bar', 'line', 'scatter', 'pie', 'data-table'];
        const generatedCharts = chartTypes
          .map(type => generateChartData(data, columns, type))
          .filter(chart => chart !== null);
          
        setCharts(generatedCharts as any[]);
      } catch (error) {
        console.error("Error processing CSV data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    processCsvData();
  }, [data, columns]);
  
  // Download processed data as JSON
  const downloadJson = () => {
    const jsonData = JSON.stringify({
      summary: summaryData,
      charts: charts
    }, null, 2);
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.csv', '')}_analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analyzing {fileName}</CardTitle>
          <CardDescription>Generating visualizations and statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>CSV Analysis: {fileName}</CardTitle>
            <CardDescription>
              {data.length} rows, {columns.length} columns
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={downloadJson}>
            <Download className="h-4 w-4 mr-1" />
            Export Analysis
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="summary" className="flex items-center">
              <TableIcon className="h-4 w-4 mr-1" />
              Data Summary
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center">
              <BarChart className="h-4 w-4 mr-1" />
              Visualizations
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center">
              <ListFilter className="h-4 w-4 mr-1" />
              Data Explorer
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="summary">
            {summaryData && (
              <div className="space-y-6">
                {/* Numerical Columns */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Numerical Columns</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column Name</TableHead>
                          <TableHead>Count</TableHead>
                          <TableHead>Mean</TableHead>
                          <TableHead>Min</TableHead>
                          <TableHead>Max</TableHead>
                          <TableHead>Std Dev</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryData.columns
                          .filter(col => col.type === 'numeric')
                          .map((col, i) => (
                            <TableRow key={i}>
                              <TableCell>{col.name}</TableCell>
                              <TableCell>{col.count}</TableCell>
                              <TableCell>{col.mean?.toFixed(2)}</TableCell>
                              <TableCell>{col.min?.toFixed(2)}</TableCell>
                              <TableCell>{col.max?.toFixed(2)}</TableCell>
                              <TableCell>{col.stdDev?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Categorical Columns */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Categorical Columns</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column Name</TableHead>
                          <TableHead>Count</TableHead>
                          <TableHead>Unique Values</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryData.columns
                          .filter(col => col.type === 'categorical')
                          .map((col, i) => (
                            <TableRow key={i}>
                              <TableCell>{col.name}</TableCell>
                              <TableCell>{col.count}</TableCell>
                              <TableCell>{col.unique}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Correlation Matrix */}
                {summaryData.correlations && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Correlation Matrix</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            {Object.keys(summaryData.correlations).map((col, i) => (
                              <TableHead key={i}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(summaryData.correlations).map(([col, values], i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{col}</TableCell>
                              {Object.values(values as Record<string, number>).map((value, j) => (
                                <TableCell 
                                  key={j}
                                  className={
                                    value === 1 ? 'bg-blue-100' :
                                    value > 0.7 ? 'bg-green-100' :
                                    value < -0.7 ? 'bg-red-100' : ''
                                  }
                                >
                                  {value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Values close to 1 indicate positive correlation, values close to -1 indicate negative correlation
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="visualize">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {charts.map((chart, index) => (
                <div key={index}>
                  <WidgetRenderer widget={chart} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="explore">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>First 100 rows of data</TableCaption>
                <TableHeader>
                  <TableRow>
                    {columns.map((col, i) => (
                      <TableHead key={i}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 100).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((col, colIndex) => (
                        <TableCell key={`${rowIndex}-${colIndex}`}>{row[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default CsvVisualizer;
