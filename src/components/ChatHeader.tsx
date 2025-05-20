
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat: () => void;
  sessionTitle: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat, sessionTitle }) => {
  return (
    <div className="border-b bg-white py-3 px-4 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {sessionTitle || 'New Conversation'}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewChat}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
