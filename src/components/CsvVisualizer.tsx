
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
import { generateDataSummary } from '@/services/csvProcessingService';
import { 
  getProcessModel, 
  getOutliers, 
  getProcessSummary,
  generateVisualizationsFromProcessData,
  ProcessModel,
  Outlier,
  ProcessSummary
} from '@/services/processMiningService';
import { toast } from '@/components/ui/use-toast';

interface CsvVisualizerProps {
  fileName: string;
  data: any[];
  columns: string[];
  fileId?: string;
}

const CsvVisualizer: React.FC<CsvVisualizerProps> = ({ fileName, data, columns, fileId }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [summaryData, setSummaryData] = useState<any>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processData, setProcessData] = useState<ProcessModel | null>(null);
  const [outliers, setOutliers] = useState<Outlier[] | null>(null);
  const [processSummary, setProcessSummary] = useState<ProcessSummary | null>(null);
  
  // Process data on component mount
  useEffect(() => {
    const processCsvData = async () => {
      setIsLoading(true);
      
      try {
        // Generate summary statistics for the CSV data
        const summary = generateDataSummary(data, columns);
        setSummaryData(summary);
        
        if (fileId) {
          // If we have a fileId, fetch process mining data from the backend
          const [processModel, outlierData, processSummaryData] = await Promise.all([
            getProcessModel(fileId),
            getOutliers(fileId),
            getProcessSummary(fileId)
          ]);
          
          setProcessData(processModel);
          setOutliers(outlierData);
          setProcessSummary(processSummaryData);
          
          if (processModel && outlierData && processSummaryData) {
            // Generate visualizations based on process mining data
            const processVisualizations = generateVisualizationsFromProcessData(
              processModel, 
              outlierData, 
              processSummaryData
            );
            
            // Add them to the charts
            setCharts(processVisualizations);
            
            toast({
              title: "Process Analysis Complete",
              description: `Generated ${processVisualizations.length} visualizations from process data`,
            });
          } else {
            // If we couldn't get process data, fall back to basic CSV visualizations
            fallbackToBasicVisualizations();
          }
        } else {
          // If no fileId, use basic CSV visualizations
          fallbackToBasicVisualizations();
        }
      } catch (error) {
        console.error("Error processing data:", error);
        toast({
          title: "Error",
          description: "Failed to process data. Using basic visualizations.",
          variant: "destructive"
        });
        
        // Fall back to basic visualizations
        fallbackToBasicVisualizations();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Function to fall back to basic CSV visualizations when process data isn't available
    const fallbackToBasicVisualizations = () => {
      import('@/services/csvProcessingService').then(({ generateChartData }) => {
        // Generate various chart types from CSV data
        const chartTypes = ['bar', 'line', 'scatter', 'pie', 'data-table'];
        const generatedCharts = chartTypes
          .map(type => generateChartData(data, columns, type))
          .filter(chart => chart !== null);
          
        setCharts(generatedCharts as any[]);
      });
    };
    
    processCsvData();
  }, [data, columns, fileId]);
  
  // Download processed data as JSON
  const downloadJson = () => {
    const jsonData = JSON.stringify({
      summary: summaryData,
      processData: processData,
      outliers: outliers,
      processSummary: processSummary,
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
              {fileId && ' - Process Analysis Complete'}
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
                {/* Process Mining Stats (if available) */}
                {processData && processSummary && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Process Mining Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Process Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Cases:</span>
                            <span className="font-mono">{processData.statistics.totalCases}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Events:</span>
                            <span className="font-mono">{processData.statistics.totalEvents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activity Types:</span>
                            <span className="font-mono">{Object.keys(processData.statistics.activities).length}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Activity Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Most Frequent:</span>
                            <span className="font-mono">{processSummary.mostFrequentActivity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Least Frequent:</span>
                            <span className="font-mono">{processSummary.leastFrequentActivity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Outliers Detected:</span>
                            <span className="font-mono">{outliers?.filter(o => o.is_outlier).length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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
