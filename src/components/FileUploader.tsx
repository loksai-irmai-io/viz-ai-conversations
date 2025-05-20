
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  onFileUpload: (fileName: string) => void;
  onClose: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload - in a real implementation, you'd send to a server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onFileUpload(file.name);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Upload File</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
               onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium mb-1">
              {file ? file.name : "Click to select a file"}
            </p>
            <p className="text-xs text-gray-500">
              {!file && "CSV, Excel, PDF, Text files (max 10MB)"}
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.pdf,.txt"
              onChange={handleFileChange}
            />
          </div>
          
          {file && (
            <div className="text-sm">
              <p>File size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-3">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!file || isUploading}
          className="bg-genui-primary hover:bg-genui-secondary"
        >
          {isUploading ? 'Uploading...' : 'Upload & Analyze'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
