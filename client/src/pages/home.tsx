import { useState } from "react";
import Header from "@/components/layout/header";
import WelcomeSection from "@/components/welcome-section";
import ChatContainer from "@/components/chat/chat-container";
import { Message } from "@shared/schema";
import { nanoid } from "nanoid";

export default function Home() {
  const [sessionId] = useState(() => nanoid());
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      content: "Hello! I'm your medical assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
      sessionId: sessionId,
      language: language
    }
  ]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-1 overflow-hidden pt-16 pb-4">
        <div className="container mx-auto h-full px-4">
          <WelcomeSection />
          <ChatContainer 
            messages={messages} 
            addMessage={addMessage} 
            sessionId={sessionId} 
            language={language}
          />
        </div>
      </main>
    </div>
  );
}
