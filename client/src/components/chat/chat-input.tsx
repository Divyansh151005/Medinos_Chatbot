import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Mic, MicOff, Send, Pause, Square } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { queryClient } from "@/lib/queryClient";

interface ChatInputProps {
  onSendMessage: (message: Message) => void;
  sessionId: string;
  language: string;
}

export default function ChatInput({ onSendMessage, sessionId, language }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Speech recognition hook
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ language });

  // Speech synthesis hook
  const {
    speak,
    speaking,
    pause,
    resume,
    cancel,
    supported: browserSupportsSpeechSynthesis
  } = useSpeechSynthesis();

  // Update textarea height on input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Chat API mutation
  const chatMutation = useMutation({
    mutationFn: async (data: { prompt: string; language: string; sessionId: string }) => {
      const response = await apiRequest("POST", "/api/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Add user message to the UI
      onSendMessage(data.userMessage);
      
      // Add assistant message to the UI
      onSendMessage(data.assistantMessage);
      
      // Speak the response if voice is enabled
      if (isVoiceEnabled && browserSupportsSpeechSynthesis) {
        speak(data.assistantMessage.content, language);
      }
      
      // Clear input
      setInputValue("");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${sessionId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = inputValue.trim();
    if (!message) return;
    
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    
    // Send message to API
    chatMutation.mutate({
      prompt: message,
      language,
      sessionId
    });
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!browserSupportsSpeechRecognition) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition. Please try using Chrome.",
          variant: "destructive",
        });
        return;
      }
      startListening();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-neutral-light">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={toggleVoiceInput}
            className={`rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}
            size="icon"
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              id="user-input"
              placeholder="Type your medical question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="resize-none min-h-[50px] max-h-[150px] rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {isListening && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute opacity-75"></div>
                    <div className="w-3 h-3 bg-primary rounded-full relative"></div>
                  </div>
                  <span className="text-primary-dark">Listening...</span>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="rounded-full bg-primary hover:bg-primary-dark"
            size="icon"
            disabled={chatMutation.isPending || !inputValue.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Voice Output Controls */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-neutral-dark">
            <Checkbox 
              id="voice-output" 
              checked={isVoiceEnabled}
              onCheckedChange={(checked) => setIsVoiceEnabled(checked === true)}
            />
            <label htmlFor="voice-output" className="cursor-pointer">Voice response</label>
          </div>
          
          <div className="flex items-center gap-2 text-neutral-dark">
            {speaking && (
              <>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0" 
                  onClick={pause}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0" 
                  onClick={cancel}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}
            <div className="text-xs text-neutral-dark italic">Powered by Gemini API</div>
          </div>
        </div>
      </form>
    </div>
  );
}
