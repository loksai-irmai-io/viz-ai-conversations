
import React, { useState, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import { Message, Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { findWidgetsByQuery } from '@/data/mock-data';
import { toast } from '@/components/ui/use-toast';
import WeatherCard from '@/components/InfoCards/WeatherCard';
import NewsCard from '@/components/InfoCards/NewsCard';
import TimeCard from '@/components/InfoCards/TimeCard';
import { processQuery } from '@/services/api';

const Index = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Get the active session or create a new one
  const activeSession = sessions.find((s) => s.id === activeSessionId) || {
    id: '',
    title: 'New Conversation',
    lastUpdated: new Date(),
    messages: []
  };
  
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
  };
  
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSidebarOpen(false); // Close sidebar on mobile when selecting a session
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
      // Try to get a response from the backend first
      const apiResponse = await processQuery(message);
      
      let responseText: string;
      let matchedWidgets: any[] = [];
      
      if (apiResponse.data) {
        // Use the backend response if available
        responseText = apiResponse.data.text;
        matchedWidgets = apiResponse.data.widgets;
      } else {
        // Fall back to client-side processing
        // Wait for a short delay to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Find widgets based on the query
        matchedWidgets = findWidgetsByQuery(message);
        
        // Generate response text based on matched widgets
        if (matchedWidgets.length > 0) {
          responseText = `Here are the visualizations related to your query: "${message}"`;
        } else {
          // Check for specific keywords for info cards
          if (message.toLowerCase().includes('weather')) {
            responseText = "Here's the current weather information:";
            // Add weather widget
            matchedWidgets.push({
              id: 'weather-card',
              type: 'weather-card',
              title: 'Current Weather',
              description: 'Current weather conditions',
              module: 'outlier-analysis',
              image: '',
              keywords: ['weather'],
              metadata: {}
            });
          } else if (message.toLowerCase().includes('news')) {
            responseText = "Here are the latest news headlines:";
            // Add news widget
            matchedWidgets.push({
              id: 'news-card',
              type: 'news-card',
              title: 'Latest News',
              description: 'Recent news headlines',
              module: 'outlier-analysis',
              image: '',
              keywords: ['news'],
              metadata: {}
            });
          } else if (message.toLowerCase().includes('time')) {
            responseText = "Here's the current time:";
            // Add time widget
            matchedWidgets.push({
              id: 'time-card',
              type: 'time-card',
              title: 'Current Time',
              description: 'Current date and time',
              module: 'outlier-analysis',
              image: '',
              keywords: ['time'],
              metadata: {}
            });
          } else {
            responseText = "I couldn't find specific visualizations for your query. Try asking about failure patterns, process execution, control effectiveness, risk concentrations, or other analytics topics.";
          }
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
        />
      </div>
    </div>
  );
};

export default Index;
