
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { parse } from 'papaparse';

interface FileUploaderProps {
  onFileUpload: (fileName: string, parsedData: any[], columns: string[]) => void;
  onClose: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parseResults, setParseResults] = useState<{ data: any[], columns: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Parse CSV immediately when file is selected
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        parseCSV(selectedFile);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const parseCSV = (file: File) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const columns = results.meta.fields || [];
          setParseResults({
            data: results.data,
            columns: columns
          });
          
          toast({
            title: "CSV parsed successfully",
            description: `Found ${results.data.length} rows and ${columns.length} columns`,
          });
        } else {
          toast({
            title: "Parsing issue",
            description: "The CSV file appears to be empty or invalid",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !parseResults) {
      toast({
        title: "No file or parsing results",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Use the parsed data
      onFileUpload(file.name, parseResults.data, parseResults.columns);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem processing your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Upload CSV File</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
               onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium mb-1">
              {file ? file.name : "Click to select a CSV file"}
            </p>
            <p className="text-xs text-gray-500">
              {!file && "CSV files only (max 10MB)"}
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          
          {file && (
            <div className="text-sm">
              <p>File size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              {parseResults && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-1">File Summary:</h4>
                  <p>Rows: {parseResults.data.length}</p>
                  <p>Columns: {parseResults.columns.length}</p>
                  
                  {parseResults.columns.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Column Headers:</p>
                      <div className="max-h-20 overflow-y-auto mt-1 text-xs">
                        {parseResults.columns.map((column, i) => (
                          <span key={i} className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
          disabled={!file || !parseResults || isUploading}
          className="bg-genui-primary hover:bg-genui-secondary"
        >
          {isUploading ? 'Processing...' : 'Upload & Prepare for Visualization'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
