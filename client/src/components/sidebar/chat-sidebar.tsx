import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, X, Menu } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSession } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ChatSidebarProps {
  activeChatId: string | null;
  onChatSelect: (sessionId: string) => void;
  onNewChat: () => void;
  language: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function ChatSidebar({ 
  activeChatId,
  onChatSelect,
  onNewChat,
  language,
  isSidebarOpen,
  toggleSidebar
}: ChatSidebarProps) {
  const isMobile = useIsMobile();
  const sidebarWidth = isMobile ? "w-full" : "w-64";
  
  // Fetch chat sessions
  const { data: chatSessions = [], isLoading: isLoadingSessions } = useQuery<ChatSession[]>({
    queryKey: ['/api/sessions'],
    refetchOnWindowFocus: false,
  });
  
  // Sort sessions by updatedAt date, most recent first
  const sortedSessions = [...(Array.isArray(chatSessions) ? chatSessions : [])].sort((a: ChatSession, b: ChatSession) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (!isSidebarOpen && !isMobile) {
    // Collapsed sidebar for desktop
    return (
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-primary-dark dark:bg-gray-800 text-white z-10 w-12 flex flex-col items-center py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mb-4 text-white hover:bg-primary-light dark:hover:bg-gray-700"
        >
          <Menu />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNewChat}
          className="text-white hover:bg-primary-light dark:hover:bg-gray-700"
        >
          <PlusCircle />
        </Button>
      </div>
    );
  }
  
  // Full sidebar (mobile or expanded desktop)
  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${sidebarWidth} bg-primary-dark dark:bg-gray-800 text-white z-20 flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b border-primary-light dark:border-gray-700">
        <h2 className="text-xl font-semibold text-white">Chat History</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-primary-light dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full bg-primary dark:bg-gray-700 text-white border-primary-light dark:border-gray-600 hover:bg-primary-light dark:hover:bg-gray-600 flex items-center justify-center gap-2"
          onClick={onNewChat}
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingSessions ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : sortedSessions.length === 0 ? (
          <div className="text-center text-white/70 dark:text-gray-300 p-4">
            No chat history yet
          </div>
        ) : (
          sortedSessions.map((session: ChatSession) => (
            <div 
              key={session.sessionId}
              className={`p-3 mb-2 rounded-md cursor-pointer flex items-start gap-2 transition-colors
                ${activeChatId === session.sessionId 
                  ? 'bg-primary-light dark:bg-gray-700 text-white' 
                  : 'bg-transparent text-white hover:bg-primary-light/70 dark:hover:bg-gray-700/70'}`}
              onClick={() => onChatSelect(session.sessionId)}
            >
              <MessageSquare className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="overflow-hidden">
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-white/70 dark:text-gray-300 truncate">
                  {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}