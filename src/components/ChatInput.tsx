
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Upload } from 'lucide-react';
import FileUploader from './FileUploader';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { toast } from '@/components/ui/use-toast';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onFileUpload?: (fileName: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, onFileUpload, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech recognition hook
  const { startListening, stopListening, transcript, isListening, error } = useSpeechRecognition();

  // Handle file upload
  const handleFileUpload = (fileName: string) => {
    if (onFileUpload) {
      onFileUpload(fileName);
    } else {
      setMessage(prev => `Analyze the uploaded file "${fileName}": ${prev}`);
    }
    setShowFileUploader(false);
    toast({
      title: "File uploaded successfully",
      description: `"${fileName}" is ready for analysis.`,
    });
  };

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
      setIsRecording(false);
    } else {
      startListening();
      setIsRecording(true);
    }
  };

  // Update message when transcript changes
  React.useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Handle speech recognition error
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive",
      });
      setIsRecording(false);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="border-t bg-white py-4 px-4 sticky bottom-0 z-10">
      <div className="max-w-3xl mx-auto">
        {showFileUploader && (
          <div className="mb-4">
            <FileUploader onFileUpload={handleFileUpload} onClose={() => setShowFileUploader(false)} />
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setShowFileUploader(!showFileUploader)}
            className="flex-shrink-0"
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleSpeechRecognition}
            className="flex-shrink-0"
            disabled={isLoading}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about analytics or data visualization..."
            className="flex-1 py-6 bg-white"
            disabled={isLoading}
            autoFocus
          />
          
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !message.trim()}
            className="bg-genui-primary hover:bg-genui-secondary flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
