// Configuration constants
const CONFIG = {
  // AI Service Configuration
  AI_PROVIDERS: {
    OPENAI: 'openai',
    GEMINI: 'gemini'
  },
  
  // Default settings
  DEFAULT_SETTINGS: {
    enabled: false,
    aiProvider: 'openai',
    apiKey: '',
    overlayPosition: { x: 20, y: 20 },
    overlayLocked: false,
    autoDetect: true,
    responseLanguage: 'id', // Indonesian
    maxResponseLength: 200
  },
  
  // Interview platform selectors
  PLATFORM_SELECTORS: {
    // Common selectors for detecting interview questions - Enhanced for better detection
    QUESTION_SELECTORS: [
      // Standard question selectors
      '[data-testid*="question"]',
      '[data-qa*="question"]',
      '[data-cy*="question"]',
      '.question-text',
      '.interview-question',
      '.question-content',
      '[class*="question"]',
      '[id*="question"]',
      
      // Content selectors
      '.prompt-text',
      '.prompt-content',
      '[class*="prompt"]',
      '[id*="prompt"]',
      
      // Generic content areas that might contain questions
      'main h1, main h2, main h3, main h4',
      'section h1, section h2, section h3, section h4',
      '.content h1, .content h2, .content h3, .content h4',
      
      // Interview platform specific
      '[data-automation*="question"]',
      '[aria-label*="question"]',
      '[role="heading"]',
      
      // Text containers that might have questions
      'p:only-child',
      '.text-content',
      '.interview-text',
      '[class*="interview"]',
      
      // Generic fallbacks (more specific)
      'div[class*="text"]:not([class*="button"]):not([class*="input"])',
      'span[class*="text"]:not([class*="button"]):not([class*="input"])'
    ],
    
    // Timer/countdown selectors
    TIMER_SELECTORS: [
      '[data-testid*="timer"]',
      '.countdown',
      '.timer',
      '[class*="countdown"]',
      '[id*="timer"]'
    ],
    
    // Recording indicator selectors
    RECORDING_SELECTORS: [
      '[data-testid*="recording"]',
      '.recording',
      '[class*="recording"]',
      '.rec-indicator'
    ]
  },
  
  // Overlay configuration
  OVERLAY: {
    MIN_WIDTH: 300,
    MIN_HEIGHT: 200,
    MAX_WIDTH: 500,
    MAX_HEIGHT: 400,
    Z_INDEX: 999999
  },
  
  // API endpoints
  API_ENDPOINTS: {
    OPENAI: 'https://api.openai.com/v1/chat/completions',
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  
  // Messages
  MESSAGES: {
    NO_API_KEY: 'Please set your AI API key in the extension popup',
    NO_QUESTION_DETECTED: 'No interview question detected on this page',
    GENERATING_ANSWER: 'Generating answer...',
    ERROR_GENERATING: 'Error generating answer. Please try again.',
    EXTENSION_DISABLED: 'Extension is disabled. Enable it in the popup.'
  }
};

// Make CONFIG globally available
window.AI_INTERVIEW_CONFIG = CONFIG;
