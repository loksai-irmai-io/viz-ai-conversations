import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, Table as TableIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { parse } from 'papaparse';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadCsvFile } from '@/services/processMiningService';

interface FileUploaderProps {
  onFileUpload: (fileName: string, parsedData: any[], columns: string[], fileId?: string) => void;
  onClose: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parseResults, setParseResults] = useState<{ data: any[], columns: string[] } | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [summaryStats, setSummaryStats] = useState<Record<string, any>>({});
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
          const data = results.data;
          
          setParseResults({
            data: data,
            columns: columns
          });
          
          // Generate preview data (first 5 rows)
          setPreviewData(data.slice(0, 5));
          
          // Generate summary statistics
          generateSummaryStats(data, columns);
          
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

  // Generate basic summary statistics for numerical columns
  const generateSummaryStats = (data: any[], columns: string[]) => {
    const stats: Record<string, any> = {};
    
    columns.forEach(col => {
      // Check if column contains numerical values
      const numericValues = data
        .map(row => {
          const value = parseFloat(row[col]);
          return !isNaN(value) ? value : null;
        })
        .filter(val => val !== null) as number[];
      
      if (numericValues.length > 0) {
        // Calculate basic statistics
        const sum = numericValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / numericValues.length;
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        
        // Calculate standard deviation
        const squareDiffs = numericValues.map(val => (val - mean) ** 2);
        const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / numericValues.length;
        const stdDev = Math.sqrt(avgSquareDiff);
        
        stats[col] = {
          count: numericValues.length,
          mean: mean.toFixed(2),
          min: min.toFixed(2),
          max: max.toFixed(2),
          stdDev: stdDev.toFixed(2)
        };
      } else {
        // For non-numeric columns, just count unique values
        const uniqueValues = new Set();
        data.forEach(row => {
          if (row[col] !== undefined && row[col] !== null) {
            uniqueValues.add(row[col]);
          }
        });
        
        stats[col] = {
          count: data.length,
          unique: uniqueValues.size
        };
      }
    });
    
    setSummaryStats(stats);
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
      // First, try to upload to the backend for process mining
      const uploadResult = await uploadCsvFile(file);
      
      if (uploadResult && uploadResult.success) {
        // If backend upload was successful, pass both the parsed data and the fileId
        onFileUpload(
          file.name, 
          parseResults.data, 
          parseResults.columns, 
          uploadResult.file_id
        );
        
        toast({
          title: "Processing Complete",
          description: `File "${file.name}" was processed through the process mining pipeline`,
        });
      } else {
        // If backend upload failed, just use the parsed data
        console.warn("Backend upload failed, using client-side parsing only");
        onFileUpload(file.name, parseResults.data, parseResults.columns);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      // Fall back to client-side parsing
      onFileUpload(file.name, parseResults.data, parseResults.columns);
      
      toast({
        title: "Backend processing failed",
        description: "Using client-side analysis only. Some advanced features may be unavailable.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          Upload CSV File
        </CardTitle>
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
                <Tabs defaultValue="summary" className="mt-4">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="preview">Data Preview</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="p-3 bg-gray-50 rounded-lg mt-2">
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
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-2">
                    <div className="overflow-x-auto max-h-64">
                      <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                          <tr>
                            {parseResults.columns.map((column, i) => (
                              <th key={i} scope="col" className="px-3 py-2 text-xs font-medium text-gray-500 tracking-wider text-left">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {parseResults.columns.map((column, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} className="px-3 py-1 text-xs whitespace-nowrap">
                                  {row[column]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Showing first 5 rows of {parseResults.data.length} total rows
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="statistics" className="mt-2">
                    <div className="overflow-x-auto max-h-64">
                      <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-xs font-medium text-gray-500 text-left">Column</th>
                            <th className="px-3 py-2 text-xs font-medium text-gray-500 text-left">Type</th>
                            <th className="px-3 py-2 text-xs font-medium text-gray-500 text-left">Count</th>
                            <th className="px-3 py-2 text-xs font-medium text-gray-500 text-left">Statistics</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(summaryStats).map(([column, stats], i) => (
                            <tr key={i}>
                              <td className="px-3 py-1 text-xs">{column}</td>
                              <td className="px-3 py-1 text-xs">{stats.mean ? 'Numeric' : 'Categorical'}</td>
                              <td className="px-3 py-1 text-xs">{stats.count}</td>
                              <td className="px-3 py-1 text-xs">
                                {stats.mean ? (
                                  <>
                                    Mean: {stats.mean}, Min: {stats.min}, Max: {stats.max}, Std: {stats.stdDev}
                                  </>
                                ) : (
                                  <>Unique values: {stats.unique}</>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
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
          {isUploading ? 'Processing...' : 'Upload & Process with Backend Analysis'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
