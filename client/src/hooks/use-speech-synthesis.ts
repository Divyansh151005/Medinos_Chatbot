import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string, language?: string) => void;
  speaking: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false);
      return;
    }
    
    setSupported(true);
    
    // Set available voices
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    // Initial load of voices
    updateVoices();
    
    // Update speaking state when synthesis state changes
    const handleStateUpdate = () => {
      setSpeaking(window.speechSynthesis.speaking);
    };
    
    // Clean up synthesis on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Find the best voice for a given language
  const getBestVoiceForLanguage = (languageCode: string): SpeechSynthesisVoice | null => {
    // Map language codes to their speech synthesis compatible format
    const mappedLanguage = mapLanguageCode(languageCode);
    
    // First try to find a voice that exactly matches the language
    let matchedVoice = voices.find(voice => voice.lang.startsWith(mappedLanguage));
    
    // If no exact match, try a broader match
    if (!matchedVoice && mappedLanguage.includes('-')) {
      const languageRoot = mappedLanguage.split('-')[0];
      matchedVoice = voices.find(voice => voice.lang.startsWith(languageRoot));
    }
    
    // Fallback to default voice
    return matchedVoice || (voices.length > 0 ? voices[0] : null);
  };

  // Map language code to a compatible format for speech synthesis
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

  const speak = useCallback((text: string, language = 'en') => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const voice = getBestVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set language
    utterance.lang = mapLanguageCode(language);
    
    // Set reasonable speech rate
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeaking(false);
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [supported, voices]);

  const pause = useCallback(() => {
    if (supported) window.speechSynthesis.pause();
  }, [supported]);

  const resume = useCallback(() => {
    if (supported) window.speechSynthesis.resume();
  }, [supported]);

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return {
    speak,
    speaking,
    supported,
    voices,
    pause,
    resume,
    cancel
  };
}
