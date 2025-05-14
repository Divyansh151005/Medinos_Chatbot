import { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.sender === "user";
  
  // Function to format message content with lists if needed
  const formatContent = (content: string) => {
    // Split by line breaks
    const lines = content.split("\n");
    
    return lines.map((line, i) => {
      // Check if line is a list item
      if (line.match(/^\s*[-*•]\s+/) || line.match(/^\s*\d+\.\s+/)) {
        return <li key={i} className="ml-4 list-disc list-inside">{line.replace(/^\s*[-*•]\s+/, "").replace(/^\s*\d+\.\s+/, "")}</li>;
      }
      
      // Empty line becomes a break
      if (line.trim() === "") {
        return <br key={i} />;
      }
      
      // Regular text line
      return <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>;
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div 
        className={`
          max-w-[80%] rounded-lg py-2 px-4 shadow-sm
          ${isUser 
            ? "bg-secondary-light text-primary-dark" 
            : "bg-primary text-white"}
        `}
      >
        {!isUser && <div className="font-medium mb-1">Dr. MediChat</div>}
        
        {isLoading ? (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div>{formatContent(message.content)}</div>
        )}
      </div>
    </div>
  );
}
