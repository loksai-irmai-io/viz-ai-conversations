
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
  };
  
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSidebarOpen(false); // Close sidebar on mobile when selecting a session
  };
  
  const handleFileUpload = (fileName: string) => {
    setUploadedFile(fileName);
    
    // Add system message about file upload
    if (activeSessionId) {
      const uploadMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `File "${fileName}" has been uploaded successfully. You can now ask questions about this file. Try asking for specific visualizations like "Show me failure patterns", "Display resource performance", or "Show object type interactions".`,
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
      
      // If there's an uploaded file, include it in the context
      const queryWithContext = uploadedFile 
        ? `Analysis for uploaded file "${uploadedFile}": ${message}`
        : message;
      
      // First, try to interpret the message as a visualization request
      // using the enhanced semantic matching in processChartQuery
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
      responseText = `I've analyzed the uploaded file "${uploadedFile}", but couldn't find a specific visualization matching your query. Try asking for specific visualizations like:
      
- "Show me failure patterns"
- "Display resource summary table"
- "Show object type interactions"
- "Show me resource performance"
- "Show me case complexity analysis"
- "View activity duration outliers"
- "Show me event distribution by case type"`;
      
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
