import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ChatContainer from "@/components/chat/chat-container";
import ChatSidebar from "@/components/sidebar/chat-sidebar";
import { Message } from "@shared/schema";
import { nanoid } from "nanoid";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [activeSessionId, setActiveSessionId] = useState<string>(() => nanoid());
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Fetch messages for the active session
  const { data: sessionMessages, isLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${activeSessionId}`],
    enabled: !!activeSessionId,
    refetchOnWindowFocus: false,
  });

  // Update local messages when sessionMessages changes
  useEffect(() => {
    const messages = sessionMessages || [];
    if (messages.length > 0) {
      setMessages(messages);
    } else if (activeSessionId && !isLoading && messages.length === 0) {
      // If no messages were found, add a welcome message
      setMessages([
        {
          id: 0,
          content: "Hello! I'm Dr. MediChat. How can I help you today?",
          sender: "assistant",
          timestamp: new Date(),
          sessionId: activeSessionId,
          language: language
        }
      ]);
    }
  }, [sessionMessages, activeSessionId, isLoading]);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Add a new message to the current chat
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  // Start a new chat session
  const handleNewChat = () => {
    const newSessionId = nanoid();
    setActiveSessionId(newSessionId);
    setMessages([
      {
        id: 0,
        content: "Hello! I'm Dr. MediChat. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
        sessionId: newSessionId,
        language: language
      }
    ]);
    
    // Close the sidebar on mobile when starting a new chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Select an existing chat session
  const handleChatSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    
    // Close the sidebar on mobile when selecting a chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Calculate main content padding based on sidebar state
  const contentPadding = isMobile ? "pl-0" : (isSidebarOpen ? "pl-64" : "pl-12");

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange} 
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      
      {/* Chat sidebar */}
      <ChatSidebar 
        activeChatId={activeSessionId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        language={language}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      {/* Main content */}
      <main className={`flex-1 overflow-hidden pt-16 transition-all duration-300 ${contentPadding}`}>
        <div className="h-full">
          <ChatContainer 
            messages={messages} 
            addMessage={addMessage} 
            sessionId={activeSessionId} 
            language={language}
            onNewChat={handleNewChat}
          />
        </div>
      </main>
    </div>
  );
}
