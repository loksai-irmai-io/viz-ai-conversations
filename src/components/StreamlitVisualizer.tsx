import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, RefreshCw, Download, Clock, LineChart, 
  ExternalLink, ChartBar, Eye, Database
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import WidgetRenderer from './widgets/WidgetRenderer';
import { fetchStreamlitVisualizations, cancelStreamlitRequest } from '@/services/streamlitService';
import { fetchStagingCharts, StagingChart } from '@/services/stagingChartsService';

interface StreamlitVisualizerProps {
  requestId?: string;
  prompt?: string;
  csvFileName?: string;
  onNewRequest?: () => void;
}

const StreamlitVisualizer: React.FC<StreamlitVisualizerProps> = ({ 
  requestId, 
  prompt, 
  csvFileName,
  onNewRequest 
}) => {
  const [activeTab, setActiveTab] = useState('visualizations');
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const [streamlitImages, setStreamlitImages] = useState<string[]>([]);
  const [stagingCharts, setStagingCharts] = useState<StagingChart[]>([]);
  const [loadingStagingCharts, setLoadingStagingCharts] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  
  // Start polling when component mounts with a requestId
  useEffect(() => {
    if (requestId) {
      setIsLoading(true);
      setIsPolling(true);
      const startTime = Date.now();
      let pollCount = 0;
      
      const pollInterval = setInterval(async () => {
        pollCount++;
        try {
          const result = await fetchStreamlitVisualizations(requestId);
          
          // Update processing time
          const currentProcessingTime = Math.floor((Date.now() - startTime) / 1000);
          setProcessingTime(currentProcessingTime);
          
          if (result.status === 'completed') {
            // Request completed successfully
            setIsPolling(false);
            setIsLoading(false);
            clearInterval(pollInterval);
            
            if (result.visualizations) {
              setVisualizations(result.visualizations);
            }
            
            if (result.streamlitImages && result.streamlitImages.length > 0) {
              setStreamlitImages(result.streamlitImages);
            }
            
            toast({
              title: "Processing Complete",
              description: "All visualizations have been generated successfully.",
            });
          } else if (result.status === 'processing') {
            // Still processing, update the estimated time
            if (result.estimatedTimeRemaining) {
              setEstimatedTimeRemaining(result.estimatedTimeRemaining);
            } else {
              // If no estimate provided, make a rough guess based on poll count
              // Assume 20 minutes max (1200 seconds) divided into 120 polls (every 10 seconds)
              const remainingPolls = 120 - pollCount;
              setEstimatedTimeRemaining(Math.max(0, remainingPolls * 10));
            }
            
            // If we have partial results, show them
            if (result.partialVisualizations) {
              setVisualizations(result.partialVisualizations);
            }
            
            if (result.streamlitImages && result.streamlitImages.length > 0) {
              setStreamlitImages(result.streamlitImages);
            }
          } else if (result.status === 'failed') {
            // Request failed
            setIsPolling(false);
            setIsLoading(false);
            clearInterval(pollInterval);
            
            toast({
              title: "Processing Failed",
              description: result.error || "An unknown error occurred during processing.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error polling for results:", error);
          
          // After 15 minutes (900 seconds), stop polling automatically
          const currentProcessingTime = Math.floor((Date.now() - startTime) / 1000);
          if (currentProcessingTime > 900) {
            setIsPolling(false);
            setIsLoading(false);
            clearInterval(pollInterval);
            
            toast({
              title: "Processing Timeout",
              description: "The request took too long to complete. Please try again.",
              variant: "destructive"
            });
          }
        }
      }, 10000); // Poll every 10 seconds
      
      // Cleanup interval on component unmount
      return () => {
        clearInterval(pollInterval);
        // If we're still polling, cancel the request
        if (isPolling) {
          cancelStreamlitRequest(requestId).catch(console.error);
        }
      };
    }
  }, [requestId]);
  
  // Handle manual cancel
  const handleCancelRequest = async () => {
    if (requestId) {
      try {
        await cancelStreamlitRequest(requestId);
        setIsPolling(false);
        setIsLoading(false);
        
        toast({
          title: "Request Cancelled",
          description: "The processing request has been cancelled.",
        });
      } catch (error) {
        console.error("Error cancelling request:", error);
        
        toast({
          title: "Error",
          description: "Failed to cancel the request. It may continue processing in the background.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Load staging charts
  const handleLoadStagingCharts = async () => {
    setLoadingStagingCharts(true);
    
    try {
      const response = await fetchStagingCharts();
      
      if (response.status === 'success') {
        setStagingCharts(response.charts);
        setActiveTab('staging-charts');
        
        toast({
          title: "Charts Loaded",
          description: `Successfully loaded ${response.charts.length} charts from staging.`,
        });
      } else {
        toast({
          title: "Failed to Load Charts",
          description: response.message || "Could not connect to staging charts API.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading staging charts:", error);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the staging charts API at localhost:8000.",
        variant: "destructive"
      });
    } finally {
      setLoadingStagingCharts(false);
    }
  };
  
  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle download all visualizations
  const handleDownload = () => {
    const allData = {
      requestId,
      prompt,
      csvFileName,
      visualizations,
      stagingCharts,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = csvFileName 
      ? `streamlit-${csvFileName}-results.json` 
      : `streamlit-results-${requestId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // If we don't have a requestId yet, show a placeholder
  if (!requestId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Streamlit Integration</CardTitle>
          <CardDescription>Upload a CSV file or enter a prompt to begin analysis</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <ChartBar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              Ready to process your data
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Upload your CSV file to explore summary statistics and visualize the data. Scatter plots and charts will automatically be generated based on the detected numerical features.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {isLoading ? "Processing Your Data..." : "Analysis Results"}
            </CardTitle>
            <CardDescription>
              {csvFileName ? `Based on file: ${csvFileName}` : 
               prompt ? `Prompt: ${prompt}` : "Interactive visualizations"}
              {isLoading && estimatedTimeRemaining !== null && (
                <span className="ml-2 font-medium text-amber-600">
                  Est. time remaining: {formatTimeRemaining(estimatedTimeRemaining)}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadStagingCharts}
              disabled={loadingStagingCharts}
            >
              {loadingStagingCharts ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-1" />
              )}
              Load Staging Charts
            </Button>
            {isPolling ? (
              <Button variant="outline" size="sm" onClick={handleCancelRequest}>
                Cancel Processing
              </Button>
            ) : (visualizations.length > 0 || stagingCharts.length > 0) && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Export Results
              </Button>
            )}
            {!isLoading && onNewRequest && (
              <Button size="sm" onClick={onNewRequest}>
                New Analysis
              </Button>
            )}
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 mt-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>
              Processing time: {formatTimeRemaining(processingTime)}
            </span>
          </div>
        )}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="visualizations" className="flex items-center">
              <BarChart className="h-4 w-4 mr-1" />
              Visualizations
            </TabsTrigger>
            <TabsTrigger value="staging-charts" className="flex items-center">
              <Database className="h-4 w-4 mr-1" />
              Staging Charts
            </TabsTrigger>
            <TabsTrigger value="streamlit" className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Streamlit Views
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Processing Timeline
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="visualizations">
            {isLoading && visualizations.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[200px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : visualizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visualizations.map((viz, index) => (
                  <div key={index} className={isLoading ? "opacity-80" : ""}>
                    <WidgetRenderer widget={viz} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  No visualizations available yet
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {isLoading ? 
                    "We're analyzing your data and identifying the best visualizations based on your dataset's features." : 
                    "Try uploading a different file or entering a new prompt with more specific analysis requirements."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="staging-charts">
            {stagingCharts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stagingCharts.map((chart, index) => (
                  <div key={chart.id || index}>
                    <WidgetRenderer widget={chart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Database className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  No staging charts loaded
                </p>
                <p className="text-muted-foreground text-sm mt-2 text-center">
                  Click "Load Staging Charts" to fetch visualizations from the staging API at localhost:8000/charts.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={handleLoadStagingCharts}
                  disabled={loadingStagingCharts}
                >
                  {loadingStagingCharts ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 mr-1" />
                  )}
                  Load Staging Charts
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="streamlit">
            {streamlitImages.length > 0 ? (
              <div className="space-y-6">
                {streamlitImages.map((img, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Streamlit View {index + 1}</span>
                      <a 
                        href={img} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-blue-600 hover:underline"
                      >
                        View Full Size <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <img 
                      src={img} 
                      alt={`Streamlit visualization ${index + 1}`} 
                      className="w-full max-h-[600px] object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Eye className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  No Streamlit images available
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {isLoading ? 
                    "We're generating interactive Streamlit views based on your data's statistical properties." : 
                    "Once processing is complete, Streamlit screenshots will appear here showing detailed data analysis."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Processing Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Request Started:</span>
                    <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Processing Time:</span>
                    <span className="font-mono">{formatTimeRemaining(processingTime)}</span>
                  </div>
                  {estimatedTimeRemaining !== null && (
                    <div className="flex justify-between items-center">
                      <span>Estimated Completion:</span>
                      <span className="font-mono">
                        {formatTimeRemaining(estimatedTimeRemaining)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <span className={`font-medium ${
                      isLoading ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {isLoading ? 'Processing' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Data Analysis Process</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Your data is being processed through these steps:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </div>
                    <span>Data validation and column type detection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </div>
                    <span>Statistical summary generation (mean, median, outliers)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </div>
                    <span>Automatic chart selection based on identified data patterns</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </div>
                    <span>Chart rendering with proper numerical column selection</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      {isLoading && (
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Your data is being processed. Numerical columns are automatically detected to create accurate visualizations.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default StreamlitVisualizer;
