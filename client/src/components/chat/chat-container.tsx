import { useEffect, useRef } from "react";
import { Message } from "@shared/schema";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useQuery } from "@tanstack/react-query";

interface ChatContainerProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  sessionId: string;
  language: string;
}

export default function ChatContainer({ messages, addMessage, sessionId, language }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch conversation history
  const { data: historyMessages } = useQuery({
    queryKey: [`/api/messages/${sessionId}`],
    enabled: false, // Only fetch when needed (e.g., resuming a previous session)
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white rounded-xl shadow-md h-[calc(100%-10rem)] overflow-hidden flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <ChatInput 
        onSendMessage={addMessage} 
        sessionId={sessionId} 
        language={language}
      />
    </div>
  );
}
