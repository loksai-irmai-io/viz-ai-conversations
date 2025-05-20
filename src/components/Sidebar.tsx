
import React from 'react';
import { Button } from '@/components/ui/button';
import { Session } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  isSidebarOpen,
  toggleSidebar
}) => {
  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-gray-50 border-r w-64 flex flex-col h-screen fixed md:static transition-transform z-30",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-genui-primary">Gen-UI</h1>
          <p className="text-xs text-gray-500">Conversational Analytics</p>
        </div>

        <div className="p-4">
          <Button 
            onClick={onNewChat} 
            className="w-full bg-genui-primary hover:bg-genui-secondary"
          >
            New Conversation
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <h2 className="px-2 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">History</h2>
          {sessions.length > 0 ? (
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={cn(
                    "w-full text-left px-2 py-2 text-sm rounded-md hover:bg-gray-200 transition-colors",
                    session.id === activeSessionId ? "bg-gray-200" : ""
                  )}
                >
                  <div className="truncate">{session.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(session.lastUpdated).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 px-2">No conversation history</div>
          )}
        </div>

        <div className="p-4 border-t text-xs text-gray-500">
          <p>Gen-UI v1.0.0</p>
          <p>© 2025 Conversational Analytics</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
