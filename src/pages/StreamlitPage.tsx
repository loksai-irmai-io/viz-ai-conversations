
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
        sessionTitle="Streamlit Integration" 
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
            <h1 className="text-2xl font-bold">Streamlit Analysis Pipeline</h1>
            <p className="text-muted-foreground">
              Process data through our optimized Streamlit pipeline with real-time visualization updates
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
            <h2 className="text-lg font-medium mb-2">About the Optimized Pipeline</h2>
            <p className="text-sm mb-4">
              This interface provides access to our Streamlit analysis pipeline with significant optimizations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium mb-1">Asynchronous Processing</h3>
                <p className="text-xs text-muted-foreground">
                  Analysis runs in the background, delivering results as they become available
                </p>
              </div>
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium mb-1">Intelligent Caching</h3>
                <p className="text-xs text-muted-foreground">
                  Similar requests are cached to provide instant results when possible
                </p>
              </div>
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium mb-1">Real-time Updates</h3>
                <p className="text-xs text-muted-foreground">
                  Visualizations appear incrementally as they're processed, no need to wait for everything
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
