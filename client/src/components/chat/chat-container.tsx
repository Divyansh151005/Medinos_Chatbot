import { useEffect, useRef } from "react";
import { Message } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useQuery } from "@tanstack/react-query";

interface ChatContainerProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  sessionId: string;
  language: string;
  onNewChat?: () => void;
}

export default function ChatContainer({ 
  messages, 
  addMessage, 
  sessionId, 
  language,
  onNewChat 
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if this is an empty session
  const isEmpty = messages.length === 0 || (messages.length === 1 && messages[0].sender === 'assistant');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Empty State */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">How can I help you today?</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Ask me any medical question or describe your symptoms for assistance.
            </p>
            {onNewChat && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onNewChat}
              >
                <PlusCircle className="h-4 w-4" />
                New Chat
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Chat Messages */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {/* Chat Input */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <ChatInput 
          onSendMessage={addMessage} 
          sessionId={sessionId} 
          language={language}
        />
      </div>
    </div>
  );
}
