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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div 
        className={`
          max-w-[85%] rounded-lg py-3 px-4 shadow-sm
          ${isUser 
            ? "bg-primary-light text-white dark:bg-primary" 
            : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600"}
        `}
      >
        {!isUser && <div className="font-medium mb-1 text-primary dark:text-gray-200">Dr. MediChat</div>}
        
        {isLoading ? (
          <div className="flex space-x-2 justify-center items-center">
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">{formatContent(message.content)}</div>
        )}
      </div>
    </div>
  );
}
