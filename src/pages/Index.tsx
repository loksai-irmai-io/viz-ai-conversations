
import React, { useState, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import { Message, Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { findWidgetsByQuery } from '@/data/mock-data';
import { toast } from '@/components/ui/use-toast';
import { processQuery } from '@/services/api';
import { processChartQuery } from '@/services/chart-processing';

const Index = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  
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
        const response = await processQuery("ping");
        setIsBackendAvailable(!!response.data);
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
  };
  
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSidebarOpen(false); // Close sidebar on mobile when selecting a session
  };
  
  const handleFileUpload = (fileName: string, parsedData: any[], columns: string[]) => {
    setUploadedFile(fileName);
    setCsvData(parsedData);
    setCsvColumns(columns);
    
    // Add system message about file upload
    if (activeSessionId) {
      const uploadMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `File "${fileName}" has been uploaded and parsed successfully:
- ${parsedData.length} rows
- ${columns.length} columns
- Columns: ${columns.join(', ')}

The data is now ready for visualization. You can request specific visualizations by name.`,
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
    
    // Common chart settings
    const chartBase = {
      id: `csv-chart-${Date.now()}`,
      title: title,
      description: `Visualization from uploaded CSV: ${uploadedFile}`,
    };
    
    // Default to column headers for axes and first 20 rows of data for demonstration
    const dataToUse = csvData.slice(0, Math.min(20, csvData.length));
    
    if (titleLower.includes('scatter') || titleLower.includes('plot')) {
      // Scatter plot - needs x and y coordinates
      const xKey = csvColumns[0];
      const yKey = csvColumns[1];
      
      return {
        ...chartBase,
        type: 'scatter-chart',
        metadata: {
          xAxisLabel: xKey,
          yAxisLabel: yKey,
          data: dataToUse.map((row) => ({
            x: parseFloat(row[xKey]) || 0,
            y: parseFloat(row[yKey]) || 0
          }))
        }
      };
    } else if (titleLower.includes('bar')) {
      // Bar chart
      const categoryKey = csvColumns[0];
      const valueKey = csvColumns[1];
      
      return {
        ...chartBase,
        type: 'bar-chart',
        metadata: {
          xAxis: categoryKey,
          yAxis: valueKey,
          data: dataToUse.map((row) => ({
            [categoryKey]: row[categoryKey],
            [valueKey]: parseFloat(row[valueKey]) || 0
          }))
        }
      };
    } else if (titleLower.includes('line')) {
      // Line chart
      const categoryKey = csvColumns[0];
      const valueKeys = csvColumns.slice(1, 3); // Take up to 2 value columns
      
      return {
        ...chartBase,
        type: 'line-chart',
        metadata: {
          xAxis: categoryKey,
          data: dataToUse.map((row) => {
            const dataPoint: any = {
              [categoryKey]: row[categoryKey]
            };
            valueKeys.forEach(key => {
              dataPoint[key] = parseFloat(row[key]) || 0;
            });
            return dataPoint;
          })
        }
      };
    } else if (titleLower.includes('pie') || titleLower.includes('distribution')) {
      // Pie chart
      const nameKey = csvColumns[0];
      const valueKey = csvColumns[1];
      
      return {
        ...chartBase,
        type: 'pie-chart',
        metadata: {
          data: dataToUse.map((row) => ({
            name: row[nameKey],
            value: parseFloat(row[valueKey]) || 0
          }))
        }
      };
    } else if (titleLower.includes('table')) {
      // Data table
      return {
        ...chartBase,
        type: 'data-table',
        metadata: {
          columns: csvColumns.map(col => ({ key: col, header: col })),
          data: dataToUse
        }
      };
    }
    
    // Default to bar chart if no specific type is detected
    const categoryKey = csvColumns[0];
    const valueKey = csvColumns[1];
    
    return {
      ...chartBase,
      type: 'bar-chart',
      metadata: {
        xAxis: categoryKey,
        yAxis: valueKey,
        data: dataToUse.map((row) => ({
          [categoryKey]: row[categoryKey],
          [valueKey]: parseFloat(row[valueKey]) || 0
        }))
      }
    };
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
      
      // If there's an uploaded file and the message is likely a visualization request
      // Check if it's a simple title request for CSV visualization
      if (uploadedFile && csvData.length > 0 && message.trim().length > 0) {
        console.log("Checking for CSV-based visualization request");
        
        // If the message appears to be just a chart title request
        const csvChart = generateChartFromCSV(message);
        
        if (csvChart) {
          responseText = `Here's the "${csvChart.title}" visualization based on your uploaded CSV data.`;
          matchedWidgets = [csvChart];
          console.log(`Generated CSV visualization: ${csvChart.title}`, csvChart);
        }
        // If no CSV chart was generated, continue with normal flow
        else {
          // First, try to interpret the message as a visualization request using the semantic matching
          const chartWidget = processChartQuery(message);
          
          if (chartWidget) {
            // Found a matching visualization
            responseText = `Here's the "${chartWidget.title}" visualization: ${chartWidget.description || ''}`;
            matchedWidgets = [chartWidget];
            console.log(`Matched visualization: ${chartWidget.title}`);
          } 
          // If no chart match, try backend or fallback
          else if (isBackendAvailable) {
            const apiResponse = await processQuery(message);
            
            if (apiResponse.data) {
              // Use the backend response
              responseText = apiResponse.data.text;
              matchedWidgets = apiResponse.data.widgets || [];
              console.log("Backend response:", apiResponse.data);
            } else {
              // Fall back to client-side processing
              const fallbackResponse = await processFallbackQuery(message);
              responseText = fallbackResponse.text;
              matchedWidgets = fallbackResponse.widgets;
            }
          } else {
            // Use client-side processing if backend isn't available
            const fallbackResponse = await processFallbackQuery(message);
            responseText = fallbackResponse.text;
            matchedWidgets = fallbackResponse.widgets;
          }
        }
      } else {
        // Regular flow for non-CSV requests
        const queryWithContext = uploadedFile 
          ? `Analysis for uploaded file "${uploadedFile}": ${message}`
          : message;
        
        // First, try to interpret the message as a visualization request
        const chartWidget = processChartQuery(queryWithContext);
        
        if (chartWidget) {
          // Found a matching visualization
          responseText = `Here's the "${chartWidget.title}" visualization: ${chartWidget.description || ''}`;
          matchedWidgets = [chartWidget];
          console.log(`Matched visualization: ${chartWidget.title}`);
        } 
        // If no chart match, try backend or fallback
        else if (isBackendAvailable) {
          const apiResponse = await processQuery(queryWithContext);
          
          if (apiResponse.data) {
            // Use the backend response
            responseText = apiResponse.data.text;
            matchedWidgets = apiResponse.data.widgets || [];
            console.log("Backend response:", apiResponse.data);
          } else {
            // Fall back to client-side processing
            const fallbackResponse = await processFallbackQuery(queryWithContext);
            responseText = fallbackResponse.text;
            matchedWidgets = fallbackResponse.widgets;
          }
        } else {
          // Use client-side processing if backend isn't available
          const fallbackResponse = await processFallbackQuery(queryWithContext);
          responseText = fallbackResponse.text;
          matchedWidgets = fallbackResponse.widgets;
        }
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
  
  // Fallback query processing for when the backend is unavailable
  const processFallbackQuery = async (query: string): Promise<{text: string, widgets: any[]}> => {
    // Wait for a short delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Try one more time with full text-based matching using processChartQuery
    const chartWidget = processChartQuery(query);
    if (chartWidget) {
      return {
        text: `Here's the "${chartWidget.title}" visualization: ${chartWidget.description}`,
        widgets: [chartWidget]
      };
    }
    
    // Find widgets based on the query using older method as final fallback
    const matchedWidgets = findWidgetsByQuery(query);
    
    // Generate response text based on matched widgets
    let responseText: string;
    
    if (matchedWidgets.length > 0) {
      // If we found widgets based on the query, respond with contextual information
      if (matchedWidgets.length === 1) {
        responseText = `Here's the "${matchedWidgets[0].title}" visualization: ${matchedWidgets[0].description || ''}`;
      } else {
        responseText = `Here are ${matchedWidgets.length} visualizations related to your query:`;
      }
      
      return { text: responseText, widgets: matchedWidgets };
    } else if (uploadedFile) {
      // Special response for uploaded files when no visualization matches
      responseText = `I've analyzed the uploaded file "${uploadedFile}", but couldn't find a specific visualization matching your query. Try asking for specific visualizations or specify the chart type such as:
      
- "Bar chart of [column name]"
- "Scatter plot of [column X] vs [column Y]"
- "Line chart showing [column name] trend"
- "Pie chart distribution of [column name]"
- "Data table of the CSV content"`;
      
      return { text: responseText, widgets: [] };
    } else {
      responseText = "I couldn't find a specific visualization matching your query. Try asking for specific visualizations like:";
      
      // List available visualization types as examples
      const visualizationExamples = [
        "Object Type Interactions",
        "Resource Summary Table",
        "Failure Pattern Analysis",
        "Resource Performance",
        "Activity Duration Outliers",
        "Event Distribution by Case Type",
        "Case Complexity Analysis"
      ];
      
      // Add the examples to the response
      responseText += visualizationExamples.map(example => `\n- "Show me ${example}"`).join('');
      
      return { text: responseText, widgets: [] };
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
        />
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
