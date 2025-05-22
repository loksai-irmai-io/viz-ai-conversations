import React, { useState, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import CsvVisualizer from '@/components/CsvVisualizer';
import { Message, Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { findWidgetsByQuery } from '@/data/mock-data';
import { toast } from '@/components/ui/use-toast';
import { processQuery } from '@/services/api';
import { processChartQuery } from '@/services/chart-processing';
import { generateChartData } from '@/services/csvProcessingService';
import { getProcessModel, getOutliers, getProcessSummary, generateVisualizationsFromProcessData } from '@/services/processMiningService';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [processingFileId, setProcessingFileId] = useState<string | null>(null);
  
  // Get the active session or create a new one
  const activeSession = sessions.find((s) => s.id === activeSessionId) || {
    id: '',
    title: 'New Conversation',
    lastUpdated: new Date(),
    messages: []
  };
  
  // Check if backend is available on initial load
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try to make a simple query to the backend
        const response = await fetch('http://localhost:5000/api/metadata/test');
        setIsBackendAvailable(response.status !== 404);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setIsBackendAvailable(false);
      }
    };
    
    checkBackend();
  }, []);
  
  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('genui-sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          lastUpdated: new Date(session.lastUpdated),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
        
        // Set active session to the most recent one
        if (sessionsWithDates.length > 0) {
          setActiveSessionId(sessionsWithDates[0].id);
        }
      } catch (error) {
        console.error('Failed to parse sessions from localStorage:', error);
      }
    }
  }, []);
  
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('genui-sessions', JSON.stringify(sessions));
  }, [sessions]);
  
  const handleNewChat = () => {
    const newSessionId = uuidv4();
    setSessions((prev) => [
      {
        id: newSessionId,
        title: 'New Conversation',
        lastUpdated: new Date(),
        messages: []
      },
      ...prev
    ]);
    setActiveSessionId(newSessionId);
    setIsSidebarOpen(false); // Close sidebar on mobile when starting new chat
    setUploadedFile(null); // Clear uploaded file when starting a new chat
    setCsvData([]);
    setCsvColumns([]);
    setShowVisualizer(false);
    setProcessingFileId(null); // Clear processing file ID
  };
  
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSidebarOpen(false); // Close sidebar on mobile when selecting a session
  };
  
  const handleFileUpload = (fileName: string, parsedData: any[], columns: string[], fileId?: string) => {
    setUploadedFile(fileName);
    setCsvData(parsedData);
    setCsvColumns(columns);
    setShowVisualizer(true);
    
    if (fileId) {
      setProcessingFileId(fileId);
    } else {
      setProcessingFileId(null);
    }
    
    // Add system message about file upload
    if (activeSessionId) {
      const uploadMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `File "${fileName}" has been uploaded and parsed successfully:
- ${parsedData.length} rows
- ${columns.length} columns
- Columns: ${columns.join(', ')}
${fileId ? '\nBackend process mining pipeline has been activated.' : ''}

The data is now ready for visualization. You can request specific visualizations by name or view the automatic visualizations in the CSV analyzer above.`,
        timestamp: new Date()
      };
      
      setSessions((prev) => prev.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            lastUpdated: new Date(),
            messages: [...session.messages, uploadMessage]
          };
        }
        return session;
      }));
    }
  };

  // Generate a chart from CSV data based on title
  const generateChartFromCSV = (title: string) => {
    if (!csvData.length || !csvColumns.length) {
      return null;
    }
    
    // Create appropriate chart type based on title
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('scatter')) {
      return generateChartData(csvData, csvColumns, 'scatter');
    } else if (titleLower.includes('bar')) {
      return generateChartData(csvData, csvColumns, 'bar');
    } else if (titleLower.includes('line')) {
      return generateChartData(csvData, csvColumns, 'line');
    } else if (titleLower.includes('pie') || titleLower.includes('distribution')) {
      return generateChartData(csvData, csvColumns, 'pie');
    } else if (titleLower.includes('table')) {
      return generateChartData(csvData, csvColumns, 'data-table');
    }
    
    // Default to bar chart if no specific type is detected
    return generateChartData(csvData, csvColumns, 'bar');
  };
  
  const handleSubmit = async (message: string) => {
    if (!activeSessionId) {
      // Create a new session if there isn't one active
      handleNewChat();
    }
    
    // Create a user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    // Update the session with the user message
    setSessions((prev) => prev.map((session) => {
      if (session.id === activeSessionId) {
        // Update session title based on first user message if it's still "New Conversation"
        const shouldUpdateTitle = session.title === 'New Conversation' && session.messages.length === 0;
        return {
          ...session,
          title: shouldUpdateTitle ? (message.length > 30 ? `${message.substring(0, 30)}...` : message) : session.title,
          lastUpdated: new Date(),
          messages: [...session.messages, userMessage]
        };
      }
      return session;
    }));
    
    // Process the user query
    setIsLoading(true);
    
    try {
      let responseText: string;
      let matchedWidgets: any[] = [];
      
      // If there's an uploaded file with a processing fileId
      if (uploadedFile && processingFileId) {
        console.log("Using process mining pipeline data");
        
        try {
          // Fetch process mining data
          const [processModel, outliers, processSummary] = await Promise.all([
            getProcessModel(processingFileId),
            getOutliers(processingFileId),
            getProcessSummary(processingFileId)
          ]);
          
          if (processModel && outliers && processSummary) {
            // Generate visualizations from process mining data
            const processVisualizations = generateVisualizationsFromProcessData(
              processModel,
              outliers,
              processSummary
            );
            
            responseText = `Here are the process mining visualizations based on your uploaded data: ${message}.`;
            matchedWidgets = processVisualizations;
          } else {
            // Fall back to regular CSV processing
            const response = await useCsvBasedVisualization(message);
            responseText = response.text;
            matchedWidgets = response.widgets;
          }
        } catch (error) {
          console.error("Error fetching process mining data:", error);
          // Fall back to regular CSV processing
          const response = await useCsvBasedVisualization(message);
          responseText = response.text;
          matchedWidgets = response.widgets;
        }
      } 
      // If there's an uploaded file but no processing fileId
      else if (uploadedFile && csvData.length > 0) {
        console.log("Using regular CSV data");
        const response = await useCsvBasedVisualization(message);
        responseText = response.text;
        matchedWidgets = response.widgets;
      }
      // Standard query without CSV data
      else {
        console.log("No CSV data, using regular query");
        const response = await processRegularQuery(message);
        responseText = response.text;
        matchedWidgets = response.widgets;
      }
      
      // Create AI response message
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: responseText,
        timestamp: new Date(),
        widgets: matchedWidgets
      };
      
      // Update session with AI response
      setSessions((prev) => prev.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            lastUpdated: new Date(),
            messages: [...session.messages, aiMessage]
          };
        }
        return session;
      }));
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function for CSV-based visualization
  const useCsvBasedVisualization = async (message: string): Promise<{text: string, widgets: any[]}> => {
    // Check if it's a simple title request for CSV visualization
    const csvChart = generateChartData(csvData, csvColumns, getChartTypeFromMessage(message));
    
    if (csvChart) {
      return {
        text: `Here's the "${csvChart.title}" visualization based on your uploaded CSV data.`,
        widgets: [csvChart]
      };
    }
    
    // If no CSV chart was generated, continue with normal flow
    const chartWidget = processChartQuery(message);
    
    if (chartWidget) {
      // Found a matching visualization
      return {
        text: `Here's the "${chartWidget.title}" visualization: ${chartWidget.description || ''}`,
        widgets: [chartWidget]
      };
    }
    
    // If no match, try backend or fallback
    if (isBackendAvailable) {
      try {
        const apiResponse = await processQuery(message);
        
        if (apiResponse.data) {
          return {
            text: apiResponse.data.text,
            widgets: apiResponse.data.widgets || []
          };
        }
      } catch (error) {
        console.error("API error:", error);
      }
    }
    
    // Fall back to client-side processing
    return processFallbackQuery(message);
  };
  
  // Helper function to determine chart type from message
  const getChartTypeFromMessage = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('scatter') || lowerMsg.includes('plot')) {
      return 'scatter';
    } else if (lowerMsg.includes('bar') || lowerMsg.includes('column')) {
      return 'bar';
    } else if (lowerMsg.includes('line') || lowerMsg.includes('trend')) {
      return 'line';
    } else if (lowerMsg.includes('pie') || lowerMsg.includes('distribution')) {
      return 'pie';
    } else if (lowerMsg.includes('table')) {
      return 'data-table';
    }
    
    return 'bar'; // Default
  };
  
  // Helper function for regular queries (no CSV data)
  const processRegularQuery = async (message: string): Promise<{text: string, widgets: any[]}> => {
    // First, try to interpret the message as a visualization request
    const chartWidget = processChartQuery(message);
    
    if (chartWidget) {
      return {
        text: `Here's the "${chartWidget.title}" visualization: ${chartWidget.description || ''}`,
        widgets: [chartWidget]
      };
    }
    
    // If no chart match, try backend or fallback
    if (isBackendAvailable) {
      try {
        const apiResponse = await processQuery(message);
        
        if (apiResponse.data) {
          return {
            text: apiResponse.data.text,
            widgets: apiResponse.data.widgets || []
          };
        }
      } catch (error) {
        console.error("API error:", error);
      }
    }
    
    // Fall back to client-side processing
    return processFallbackQuery(message);
  };
  
  // Fallback query processing for when the backend is unavailable
  const processFallbackQuery = async (query: string): Promise<{text: string, widgets: any[]}> => {
    // Wait for a short delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Try one more time with full text-based matching
    const chartWidget = processChartQuery(query);
    if (chartWidget) {
      return {
        text: `Here's the "${chartWidget.title}" visualization: ${chartWidget.description}`,
        widgets: [chartWidget]
      };
    }
    
    // Find widgets based on the query
    const matchedWidgets = findWidgetsByQuery(query);
    
    // Generate response text based on matched widgets
    if (matchedWidgets.length > 0) {
      // If we found widgets based on the query, respond with contextual information
      if (matchedWidgets.length === 1) {
        return {
          text: `Here's the "${matchedWidgets[0].title}" visualization: ${matchedWidgets[0].description || ''}`,
          widgets: matchedWidgets
        };
      } else {
        return {
          text: `Here are ${matchedWidgets.length} visualizations related to your query:`,
          widgets: matchedWidgets
        };
      }
    } else if (uploadedFile) {
      // Special response for uploaded files when no visualization matches
      return {
        text: `I've analyzed the uploaded file "${uploadedFile}", but couldn't find a specific visualization matching your query. Try asking for specific visualizations or specify the chart type such as:
        
- "Bar chart of [column name]"
- "Scatter plot of [column X] vs [column Y]"
- "Line chart showing [column name] trend"
- "Pie chart distribution of [column name]"
- "Data table of the CSV content"`,
        widgets: []
      };
    } else {
      // Generic response when no matches and no CSV
      return {
        text: "I couldn't find a specific visualization matching your query. Try asking for specific visualizations like process models, activity frequency, or outlier analysis.",
        widgets: []
      };
    }
  };
  
  return (
    <div className="h-screen flex">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader 
          onNewChat={handleNewChat} 
          sessionTitle={activeSession.title} 
          customActions={
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/streamlit')}
              className="mr-2"
            >
              Streamlit Integration
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          }
        />
        
        {/* CSV Visualizer */}
        {showVisualizer && uploadedFile && csvData.length > 0 && (
          <div className="px-4 py-4 overflow-y-auto">
            <CsvVisualizer 
              fileName={uploadedFile}
              data={csvData}
              columns={csvColumns}
              fileId={processingFileId || undefined}
            />
          </div>
        )}
        
        <ChatContainer 
          messages={activeSession.messages} 
          isLoading={isLoading} 
        />
        <ChatInput 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Index;
