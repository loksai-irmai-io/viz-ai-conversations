
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ChatHeader from '@/components/ChatHeader';
import StreamlitVisualizer from '@/components/StreamlitVisualizer';
import StreamlitPromptInput from '@/components/StreamlitPromptInput';
import { useNavigate } from 'react-router-dom';

const StreamlitPage = () => {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [analysisType, setAnalysisType] = useState<'prompt' | 'file' | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(undefined);
  const [showInput, setShowInput] = useState(true);

  const handleSubmit = (newRequestId: string, type: 'prompt' | 'file', inputContent: string) => {
    setRequestId(newRequestId);
    setAnalysisType(type);
    setContent(inputContent);
    setShowInput(false);
  };

  const handleNewRequest = () => {
    setShowInput(true);
    setRequestId(undefined);
    setAnalysisType(undefined);
    setContent(undefined);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ChatHeader 
        sessionTitle="Data Visualization Studio" 
        customActions={
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Interactive Data Analysis</h1>
            <p className="text-muted-foreground">
              Upload your CSV file to explore summary statistics and visualize the data. Scatter plots and charts will automatically be generated based on the detected numerical features.
            </p>
          </div>

          {showInput ? (
            <StreamlitPromptInput onSubmit={handleSubmit} />
          ) : (
            <StreamlitVisualizer 
              requestId={requestId} 
              prompt={analysisType === 'prompt' ? content : undefined}
              csvFileName={analysisType === 'file' ? content : undefined}
              onNewRequest={handleNewRequest}
            />
          )}
          
          <div className="mt-8 bg-muted rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">How It Works</h2>
            <p className="text-sm mb-4">
              Our analysis process intelligently processes your data through these steps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium mb-1">Smart Column Detection</h3>
                <p className="text-xs text-muted-foreground">
                  We automatically identify numerical columns for visualization and analyze data types for the best chart selection
                </p>
              </div>
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium mb-1">Real-time Processing</h3>
                <p className="text-xs text-muted-foreground">
                  See initial results immediately while more complex visualizations are processed in the background
                </p>
              </div>
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium mb-1">Meaningful Insights</h3>
                <p className="text-xs text-muted-foreground">
                  Get statistical summaries, identify outliers, and view relationships between your data variables
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamlitPage;
