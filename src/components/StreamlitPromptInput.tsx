
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { submitStreamlitPrompt, uploadCsvToStreamlit } from '@/services/streamlitService';

interface StreamlitPromptInputProps {
  onSubmit: (requestId: string, type: 'prompt' | 'file', content: string) => void;
  onClose?: () => void;
}

const StreamlitPromptInput: React.FC<StreamlitPromptInputProps> = ({ onSubmit, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'upload'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitStreamlitPrompt(prompt);
      
      if (response.requestId) {
        toast({
          title: "Processing Started",
          description: "Your prompt is being analyzed. This may take some time.",
        });
        onSubmit(response.requestId, 'prompt', prompt);
      } else {
        throw new Error("No request ID returned");
      }
    } catch (error) {
      console.error("Error submitting prompt:", error);
      toast({
        title: "Error",
        description: "Failed to submit your prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await uploadCsvToStreamlit(file);
      
      if (response.requestId) {
        toast({
          title: "File Upload Started",
          description: "Your file is being processed. This may take some time.",
        });
        onSubmit(response.requestId, 'file', file.name);
      } else {
        throw new Error("No request ID returned");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Start Streamlit Analysis</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'prompt' | 'upload')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="prompt" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Text Prompt
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Enter a prompt to analyze data or generate visualizations
              </p>
              <div className="flex">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Generate a bar chart of monthly sales by category"
                  className="flex-1"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                More detailed prompts yield better results.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a CSV file to analyze
              </p>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium mb-1">
                  {file ? file.name : "Click to select a CSV file"}
                </p>
                <p className="text-xs text-gray-500">
                  {!file && "CSV files only (max 50MB)"}
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        {onClose && (
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={activeTab === 'prompt' ? handleSubmitPrompt : handleFileUpload} 
          disabled={isSubmitting || (activeTab === 'prompt' ? !prompt.trim() : !file)}
          className="bg-genui-primary hover:bg-genui-secondary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Start Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StreamlitPromptInput;
