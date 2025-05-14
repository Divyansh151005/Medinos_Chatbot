// Language utility functions for the application

// Map language codes to their user-friendly names
export const languageNames: Record<string, string> = {
  'en': 'English',
  'hi': 'हिंदी (Hindi)',
  'hinglish': 'Hinglish',
  'es': 'Español (Spanish)',
  'fr': 'Français (French)',
};

// Map language codes to compatible formats for different APIs
export function mapLanguageCodeForSpeechRecognition(code: string): string {
  switch(code) {
    case 'en': return 'en-US';
    case 'hi': return 'hi-IN';
    case 'hinglish': return 'en-IN'; // Closest match for Hinglish
    case 'es': return 'es-ES';
    case 'fr': return 'fr-FR';
    default: return 'en-US';
  }
}

export function mapLanguageCodeForGemini(code: string): string {
  switch(code) {
    case 'en': return 'English';
    case 'hi': return 'Hindi';
    case 'hinglish': return 'Hinglish (a mix of Hindi and English)';
    case 'es': return 'Spanish';
    case 'fr': return 'French';
    default: return 'English';
  }
}

// Detect if text is likely to be in a specific language
export function detectLanguage(text: string): string {
  // This is a very basic detection - in a real app you might use a more sophisticated library
  
  // Hindi detection (check for Devanagari script)
  const hindiPattern = /[\u0900-\u097F]/;
  if (hindiPattern.test(text)) {
    // Check if it's mixed with English (Hinglish)
    const englishPattern = /[a-zA-Z]/;
    return englishPattern.test(text) ? 'hinglish' : 'hi';
  }
  
  // Spanish detection (check for Spanish-specific characters)
  const spanishPattern = /[áéíóúüñ¿¡]/i;
  if (spanishPattern.test(text)) {
    return 'es';
  }
  
  // French detection (check for French-specific characters)
  const frenchPattern = /[àâæçéèêëîïôœùûüÿ]/i;
  if (frenchPattern.test(text)) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
}
