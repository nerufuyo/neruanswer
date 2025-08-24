// Question detector for interview platforms
class QuestionDetector {
  constructor() {
    this.currentQuestion = null;
    this.lastQuestion = null;
    this.observers = [];
    this.callbacks = [];
    this.isMonitoring = false;
    this.detectionInterval = null;
  }
  
  // Start monitoring for questions
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupMutationObserver();
    this.setupPeriodicCheck();
    this.performInitialScan();
  }
  
  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    
    // Clear observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    // Clear interval
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }
  
  // Add callback for when new question is detected
  onQuestionDetected(callback) {
    this.callbacks.push(callback);
  }
  
  // Setup mutation observer to detect DOM changes
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        // Check if new nodes were added
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
        
        // Check if text content changed
        if (mutation.type === 'characterData') {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck) {
        // Debounce the check to avoid too many calls
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.detectQuestion();
        }, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    this.observers.push(observer);
  }
  
  // Setup periodic check as fallback
  setupPeriodicCheck() {
    this.detectionInterval = setInterval(() => {
      this.detectQuestion();
    }, 3000); // Check every 3 seconds
  }
  
  // Perform initial scan when starting
  performInitialScan() {
    setTimeout(() => {
      this.detectQuestion();
    }, 1000); // Wait a bit for page to load
  }
  
  // Main question detection logic
  detectQuestion() {
    if (!this.isMonitoring) return;
    
    const question = this.findQuestionOnPage();
    
    if (question && question !== this.lastQuestion) {
      this.currentQuestion = question;
      this.lastQuestion = question;
      
      // Notify all callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(question, this.getQuestionContext());
        } catch (error) {
          console.error('Error in question detection callback:', error);
        }
      });
    }
  }
  
  // Find question text on the page
  findQuestionOnPage() {
    const selectors = CONFIG.PLATFORM_SELECTORS.QUESTION_SELECTORS;
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      
      for (const element of elements) {
        const text = this.extractQuestionText(element);
        if (this.isValidQuestion(text)) {
          return text;
        }
      }
    }
    
    return null;
  }
  
  // Extract and clean question text from element
  extractQuestionText(element) {
    if (!element) return '';
    
    // Get text content and clean it up
    let text = element.textContent || element.innerText || '';
    
    // Remove extra whitespace and newlines
    text = text.replace(/\s+/g, ' ').trim();
    
    // Remove common prefixes
    text = text.replace(/^(Question|Q\d*\.?|Interview Question|Problem):?\s*/i, '');
    
    // Remove numbered prefixes (1., 2., etc.)
    text = text.replace(/^\d+\.?\s*/, '');
    
    return text;
  }
  
  // Validate if text looks like a question
  isValidQuestion(text) {
    if (!text || text.length < 10) return false;
    
    // Check for question indicators - Enhanced for English detection
    const questionIndicators = [
      '?', // Ends with question mark
      // English question words
      'what', 'how', 'why', 'when', 'where', 'who', 'which', 'whose',
      'tell me', 'describe', 'explain', 'discuss', 'share',
      'give me an example', 'walk me through', 'can you',
      'would you', 'could you', 'do you', 'have you',
      'are you', 'will you', 'did you', 'if you',
      'think about', 'talk about', 'your experience',
      'your background', 'your approach', 'your thoughts',
      // Indonesian question words
      'apa', 'bagaimana', 'mengapa', 'kapan', 'dimana', 'siapa',
      'ceritakan', 'jelaskan', 'berikan contoh', 'bisakah',
      'dapatkah', 'apakah', 'pengalaman', 'pendapat'
    ];
    
    // Additional English question patterns
    const questionPatterns = [
      /^(what|how|why|when|where|who|which|whose)\b/i,
      /\b(tell|describe|explain|discuss|share)\b.*\b(about|your|us|me)\b/i,
      /\b(can|could|would|will|do|did|have|are)\s+you\b/i,
      /\bwalk\s+(me|us)\s+through\b/i,
      /\bgive\s+(me|us)\s+an?\s+example\b/i,
      /\bthink\s+about\b/i,
      /\btalk\s+about\b/i,
      /\byour\s+(experience|background|approach|thoughts|opinion)\b/i
    ];
    
    const lowerText = text.toLowerCase();
    
    // Check for basic question indicators
    const hasQuestionIndicator = questionIndicators.some(indicator => 
      lowerText.includes(indicator)
    );
    
    // Check for question patterns
    const hasQuestionPattern = questionPatterns.some(pattern => 
      pattern.test(text)
    );
    
    // Additional checks
    const hasReasonableLength = text.length >= 10 && text.length <= 1000;
    const hasLetters = /[a-zA-Z]/.test(text);
    const notJustNumbers = !/^\d+$/.test(text.trim());
    const notJustPunctuation = /[a-zA-Z]/.test(text);
    
    return (hasQuestionIndicator || hasQuestionPattern) && 
           hasReasonableLength && 
           hasLetters && 
           notJustNumbers && 
           notJustPunctuation;
  }
  
  // Get additional context about the question
  getQuestionContext() {
    const context = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      isRecording: this.detectRecordingState(),
      hasTimer: this.detectTimer(),
      platform: this.detectPlatform()
    };
    
    return context;
  }
  
  // Detect if recording is active
  detectRecordingState() {
    const selectors = CONFIG.PLATFORM_SELECTORS.RECORDING_SELECTORS;
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && this.isElementVisible(element)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Detect timer/countdown
  detectTimer() {
    const selectors = CONFIG.PLATFORM_SELECTORS.TIMER_SELECTORS;
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && this.isElementVisible(element)) {
        const text = element.textContent || '';
        // Look for time patterns like "00:30", "0:45", etc.
        if (/\d{1,2}:\d{2}/.test(text)) {
          return text.trim();
        }
      }
    }
    
    return null;
  }
  
  // Detect interview platform
  detectPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    
    const platforms = {
      'hirevue.com': 'HireVue',
      'myinterview.com': 'myInterview',
      'spark-hire.com': 'Spark Hire',
      'vidcruiter.com': 'VidCruiter',
      'talview.com': 'Talview',
      'interview.com': 'Interview.com',
      'zoom.us': 'Zoom',
      'meet.google.com': 'Google Meet',
      'teams.microsoft.com': 'Microsoft Teams'
    };
    
    for (const [domain, platform] of Object.entries(platforms)) {
      if (hostname.includes(domain)) {
        return platform;
      }
    }
    
    return 'Unknown';
  }
  
  // Check if element is visible
  isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  }
  
  // Get current question
  getCurrentQuestion() {
    return this.currentQuestion;
  }
}

// Make QuestionDetector globally available
window.questionDetector = new QuestionDetector();
