// Configuration constants
const CONFIG = {
  // AI Service Configuration
  AI_PROVIDERS: {
    OPENAI: 'openai',
    GEMINI: 'gemini'
  },
  
  // Default settings - can be overridden by environment variables
  DEFAULT_SETTINGS: {
    enabled: false,
    aiProvider: process?.env?.AI_PROVIDER || 'openai',
    apiKey: '',
    overlayPosition: { 
      x: parseInt(process?.env?.OVERLAY_DEFAULT_POSITION_X) || 20, 
      y: parseInt(process?.env?.OVERLAY_DEFAULT_POSITION_Y) || 20 
    },
    overlayLocked: process?.env?.OVERLAY_LOCKED === 'true' || false,
    autoDetect: process?.env?.AUTO_DETECT_QUESTIONS !== 'false',
    responseLanguage: process?.env?.DEFAULT_LANGUAGE || 'id',
    maxResponseLength: parseInt(process?.env?.MAX_RESPONSE_LENGTH) || 200,
    enableCache: process?.env?.ENABLE_RESPONSE_CACHE !== 'false',
    debugMode: process?.env?.DEBUG_MODE === 'true' || false
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
    MIN_WIDTH: parseInt(process?.env?.OVERLAY_MIN_WIDTH) || 300,
    MIN_HEIGHT: parseInt(process?.env?.OVERLAY_MIN_HEIGHT) || 200,
    MAX_WIDTH: 500,
    MAX_HEIGHT: 400,
    Z_INDEX: 999999
  },
  
  // Performance settings
  PERFORMANCE: {
    DETECTION_INTERVAL: parseInt(process?.env?.DETECTION_INTERVAL_MS) || 3000,
    DEBOUNCE_TIMEOUT: parseInt(process?.env?.DEBOUNCE_TIMEOUT_MS) || 500,
    MAX_HISTORY_ENTRIES: parseInt(process?.env?.MAX_HISTORY_ENTRIES) || 50,
    CACHE_EXPIRY_HOURS: parseInt(process?.env?.CACHE_EXPIRY_HOURS) || 24
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
