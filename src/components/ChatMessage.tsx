
import React from 'react';
import { Message } from '@/types';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';
import { cn } from '@/lib/utils';
import { Widget } from '@/data/mock-data';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={cn(
      "py-5 flex flex-col",
      message.role === 'user' ? "bg-white" : "bg-gray-50"
    )}>
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 flex flex-col gap-3">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
            {message.role === 'user' ? (
              <div className="bg-genui-accent rounded-full w-full h-full flex items-center justify-center">
                <span>U</span>
              </div>
            ) : (
              <div className="bg-genui-primary rounded-full w-full h-full flex items-center justify-center">
                <span>AI</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="prose prose-sm max-w-none">
              <p>{message.content}</p>
            </div>
            
            {message.widgets && message.widgets.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4">
                {message.widgets.map((widget, index) => (
                  <WidgetRenderer key={index} widget={widget as Widget} />
                ))}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
