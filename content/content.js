// Main content script for AI Interview Assistant
class AIInterviewAssistant {
  constructor() {
    this.overlay = null;
    this.isEnabled = false;
    this.settings = null;
    
    this.storage = window.storageManager;
    this.detector = window.questionDetector;
    this.aiService = window.aiService;
    
    this.init();
  }
  
  async init() {
    try {
      // Wait for page to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.start());
      } else {
        await this.start();
      }
    } catch (error) {
      console.error('Error initializing AI Interview Assistant:', error);
    }
  }
  
  async start() {
    // Load settings
    this.settings = await this.storage.getSettings();
    this.isEnabled = this.settings.enabled;
    
    if (!this.isEnabled) {
      console.log('AI Interview Assistant is disabled');
      return;
    }
    
    // Initialize components
    await this.initializeOverlay();
    await this.initializeDetector();
    await this.setupMessageListener();
    
    console.log('AI Interview Assistant initialized successfully');
  }
  
  async initializeOverlay() {
    try {
      // Create overlay instance
      this.overlay = new window.InterviewOverlay();
      
      // Show overlay
      await this.overlay.show();
      
      console.log('Overlay initialized');
    } catch (error) {
      console.error('Error initializing overlay:', error);
    }
  }
  
  async initializeDetector() {
    try {
      // Set up question detection callback
      this.detector.onQuestionDetected((question, context) => {
        this.handleQuestionDetected(question, context);
      });
      
      // Start monitoring if auto-detect is enabled
      if (this.settings.autoDetect) {
        this.detector.startMonitoring();
        console.log('Question detector started');
      }
    } catch (error) {
      console.error('Error initializing detector:', error);
    }
  }
  
  async setupMessageListener() {
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }
  
  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'toggle':
          await this.toggle();
          sendResponse({ success: true, enabled: this.isEnabled });
          break;
          
        case 'updateSettings':
          await this.updateSettings(message.settings);
          sendResponse({ success: true });
          break;
          
        case 'getStatus':
          sendResponse({
            success: true,
            status: {
              enabled: this.isEnabled,
              hasQuestion: !!this.detector.getCurrentQuestion(),
              overlayVisible: this.overlay?.isShown() || false
            }
          });
          break;
          
        case 'forceDetection':
          this.detector.detectQuestion();
          sendResponse({ success: true });
          break;
          
        case 'regenerateAnswer':
          if (this.overlay && this.detector.getCurrentQuestion()) {
            await this.overlay.handleRegenerate();
          }
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  async handleQuestionDetected(question, context) {
    try {
      console.log('Question detected:', question);
      
      // Notify overlay
      if (this.overlay) {
        await this.overlay.onQuestionDetected(question, context);
      }
      
      // Send notification to background script
      chrome.runtime.sendMessage({
        action: 'questionDetected',
        question,
        context,
        url: window.location.href
      }).catch(error => {
        // Ignore errors if background script is not available
        console.log('Background script not available:', error);
      });
      
    } catch (error) {
      console.error('Error handling question detection:', error);
    }
  }
  
  async toggle() {
    this.isEnabled = !this.isEnabled;
    
    // Update settings
    await this.storage.updateSetting('enabled', this.isEnabled);
    
    if (this.isEnabled) {
      // Enable extension
      if (!this.overlay) {
        await this.initializeOverlay();
      } else {
        this.overlay.show();
      }
      
      if (this.settings.autoDetect) {
        this.detector.startMonitoring();
      }
      
      console.log('AI Interview Assistant enabled');
    } else {
      // Disable extension
      if (this.overlay) {
        this.overlay.hide();
      }
      
      this.detector.stopMonitoring();
      
      console.log('AI Interview Assistant disabled');
    }
  }
  
  async updateSettings(newSettings) {
    // Merge with existing settings
    this.settings = { ...this.settings, ...newSettings };
    
    // Save to storage
    await this.storage.saveSettings(this.settings);
    
    // Apply changes
    if (newSettings.hasOwnProperty('enabled')) {
      if (newSettings.enabled !== this.isEnabled) {
        await this.toggle();
      }
    }
    
    if (newSettings.hasOwnProperty('autoDetect')) {
      if (newSettings.autoDetect && this.isEnabled) {
        this.detector.startMonitoring();
      } else {
        this.detector.stopMonitoring();
      }
    }
    
    console.log('Settings updated:', this.settings);
  }
  
  // Check if we're on a supported interview platform
  isSupportedPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    
    const supportedDomains = [
      'hirevue.com',
      'myinterview.com',
      'spark-hire.com',
      'vidcruiter.com',
      'talview.com',
      'interview.com',
      'zoom.us',
      'meet.google.com',
      'teams.microsoft.com'
    ];
    
    return supportedDomains.some(domain => hostname.includes(domain));
  }
  
  // Get current status
  getStatus() {
    return {
      enabled: this.isEnabled,
      hasOverlay: !!this.overlay,
      overlayVisible: this.overlay?.isShown() || false,
      isMonitoring: this.detector.isMonitoring,
      currentQuestion: this.detector.getCurrentQuestion(),
      supportedPlatform: this.isSupportedPlatform(),
      url: window.location.href
    };
  }
}

// Initialize the assistant when script loads
let assistant = null;

// Wait for all dependencies to load
function initializeAssistant() {
  if (window.storageManager && 
      window.questionDetector && 
      window.aiService && 
      window.InterviewOverlay) {
    assistant = new AIInterviewAssistant();
  } else {
    // Retry after a short delay
    setTimeout(initializeAssistant, 100);
  }
}

// Start initialization
initializeAssistant();
