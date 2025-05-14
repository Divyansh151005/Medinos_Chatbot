import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionProps {
  language?: string;
  continuous?: boolean;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  browserSupportsSpeechRecognition: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Define type for the SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition({
  language = 'en-US',
  continuous = false,
}: SpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [browserSupported, setBrowserSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setBrowserSupported(false);
      return;
    }
    
    setBrowserSupported(true);
    
    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = mapLanguageCode(language);
    
    recognitionInstance.onresult = (event) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;
      setTranscript(transcript);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [continuous, language]);

  // Map language code to a compatible format for speech recognition
  const mapLanguageCode = (code: string): string => {
    switch(code) {
      case 'en': return 'en-US';
      case 'hi': return 'hi-IN';
      case 'hinglish': return 'en-IN'; // Closest match for Hinglish
      case 'es': return 'es-ES';
      case 'fr': return 'fr-FR';
      default: return 'en-US';
    }
  };
  
  const startListening = useCallback(() => {
    setTranscript('');
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    transcript,
    isListening,
    browserSupportsSpeechRecognition: browserSupported,
    startListening,
    stopListening,
    resetTranscript
  };
}
