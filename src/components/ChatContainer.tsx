
import React from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="py-5 flex flex-col bg-gray-50">
          <div className="max-w-3xl mx-auto w-full px-4 md:px-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-genui-primary text-white flex items-center justify-center">
                <span>AI</span>
              </div>
              <div className="flex-1">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Gen-UI</h2>
            <p className="text-gray-500 mb-4">
              Ask me about analytics, visualizations, or data insights! I can create charts, tables, and other visual widgets to help you understand your data.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Try asking questions like:</p>
              <ul className="text-left space-y-2 text-gray-700">
                <li>"Show me failure patterns by SOP category"</li>
                <li>"What's our process execution timeline look like?"</li>
                <li>"Display control effectiveness distribution"</li>
                <li>"Where are our risk concentrations?"</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
