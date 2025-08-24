// Floating overlay component for AI Interview Assistant
class InterviewOverlay {
  constructor() {
    this.overlay = null;
    this.isDragging = false;
    this.isLocked = false;
    this.isMinimized = false;
    this.isVisible = false;
    this.currentQuestion = null;
    this.currentAnswer = null;
    this.dragOffset = { x: 0, y: 0 };
    this.position = { x: 20, y: 20 };
    
    this.aiService = window.aiService;
    this.storage = window.storageManager;
    
    this.bindMethods();
  }
  
  bindMethods() {
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMinimize = this.handleMinimize.bind(this);
    this.handleLock = this.handleLock.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleRegenerate = this.handleRegenerate.bind(this);
  }
  
  // Create and show overlay
  async show() {
    if (this.overlay) {
      this.overlay.style.display = 'block';
      this.isVisible = true;
      return;
    }
    
    await this.loadPosition();
    this.createOverlay();
    this.attachEventListeners();
    this.isVisible = true;
  }
  
  // Hide overlay
  hide() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this.isVisible = false;
    }
  }
  
  // Remove overlay completely
  destroy() {
    if (this.overlay) {
      this.removeEventListeners();
      this.overlay.remove();
      this.overlay = null;
      this.isVisible = false;
    }
  }
  
  // Create overlay DOM structure
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'ai-interview-overlay';
    this.overlay.style.left = `${this.position.x}px`;
    this.overlay.style.top = `${this.position.y}px`;
    
    this.overlay.innerHTML = this.getOverlayHTML();
    
    document.body.appendChild(this.overlay);
    this.updateContent();
  }
  
  // Get overlay HTML structure
  getOverlayHTML() {
    return `
      <div class="overlay-header" data-drag-handle>
        <div class="overlay-title">AI Interview Assistant</div>
        <div class="overlay-controls">
          <button class="overlay-btn" data-action="minimize" title="Minimize">
            ${this.isMinimized ? '⬜' : '➖'}
          </button>
          <button class="overlay-btn" data-action="lock" title="Lock/Unlock">
            ${this.isLocked ? '🔒' : '🔓'}
          </button>
          <button class="overlay-btn" data-action="close" title="Close">✕</button>
        </div>
        <div class="status-indicator ${this.currentQuestion ? 'active' : ''}"></div>
      </div>
      
      <div class="overlay-content">
        <div class="question-section" style="display: ${this.currentQuestion ? 'block' : 'none'}">
          <div class="question-label">Detected Question</div>
          <div class="question-text">${this.currentQuestion || ''}</div>
        </div>
        
        <div class="answer-section" style="display: ${this.currentQuestion ? 'block' : 'none'}">
          <div class="answer-label">AI Generated Answer</div>
          <div class="answer-content">
            ${this.getAnswerContent()}
          </div>
          <div class="answer-actions" style="display: ${this.currentAnswer ? 'flex' : 'none'}">
            <button class="action-btn" data-action="copy">📋 Copy</button>
            <button class="action-btn" data-action="regenerate">🔄 Regenerate</button>
          </div>
        </div>
        
        <div class="no-question" style="display: ${this.currentQuestion ? 'none' : 'block'}">
          <div class="no-question-icon">🔍</div>
          <div class="no-question-text">
            Waiting for interview question detection...<br>
            Navigate to your interview platform and the extension will automatically detect questions.
          </div>
        </div>
      </div>
      
      <div class="overlay-footer">
        AI Interview Assistant v1.0
      </div>
    `;
  }
  
  // Get answer content HTML
  getAnswerContent() {
    if (!this.currentQuestion) {
      return '<div class="answer-text">No question detected yet.</div>';
    }
    
    if (this.currentAnswer === null) {
      return `
        <div class="answer-loading">
          <div class="loading-spinner"></div>
          Generating answer...
        </div>
      `;
    }
    
    if (this.currentAnswer === false) {
      return '<div class="answer-text" style="color: #f87171;">Failed to generate answer. Please try again.</div>';
    }
    
    return `<div class="answer-text">${this.currentAnswer}</div>`;
  }
  
  // Update overlay content
  updateContent() {
    if (!this.overlay) return;
    
    // Update question section
    const questionSection = this.overlay.querySelector('.question-section');
    const questionText = this.overlay.querySelector('.question-text');
    const answerSection = this.overlay.querySelector('.answer-section');
    const noQuestionSection = this.overlay.querySelector('.no-question');
    const statusIndicator = this.overlay.querySelector('.status-indicator');
    
    if (this.currentQuestion) {
      questionSection.style.display = 'block';
      answerSection.style.display = 'block';
      noQuestionSection.style.display = 'none';
      questionText.textContent = this.currentQuestion;
      statusIndicator.classList.add('active');
    } else {
      questionSection.style.display = 'none';
      answerSection.style.display = 'none';
      noQuestionSection.style.display = 'block';
      statusIndicator.classList.remove('active');
    }
    
    // Update answer content
    const answerContent = this.overlay.querySelector('.answer-content');
    const answerActions = this.overlay.querySelector('.answer-actions');
    
    answerContent.innerHTML = this.getAnswerContent();
    
    if (this.currentAnswer && this.currentAnswer !== false) {
      answerActions.style.display = 'flex';
    } else {
      answerActions.style.display = 'none';
    }
  }
  
  // Handle new question detection
  async onQuestionDetected(question, context) {
    this.currentQuestion = question;
    this.currentAnswer = null; // Set to loading state
    this.updateContent();
    
    try {
      // Extract additional context from page
      const pageContext = this.aiService.extractContextFromPage();
      const fullContext = { ...context, ...pageContext };
      
      // Generate answer
      const answer = await this.aiService.generateAnswer(question, fullContext);
      this.currentAnswer = answer;
      
      // Save to history
      await this.storage.addToHistory(question, answer, window.location.href);
      
    } catch (error) {
      console.error('Error generating answer:', error);
      this.currentAnswer = false; // Set to error state
    }
    
    this.updateContent();
  }
  
  // Attach event listeners
  attachEventListeners() {
    if (!this.overlay) return;
    
    // Control buttons
    this.overlay.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action) {
        e.preventDefault();
        e.stopPropagation();
        this.handleAction(action);
      }
    });
    
    // Drag functionality
    const header = this.overlay.querySelector('[data-drag-handle]');
    if (header) {
      header.addEventListener('mousedown', this.handleMouseDown);
    }
    
    // Global mouse events for dragging
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  
  // Remove event listeners
  removeEventListeners() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
  
  // Handle control actions
  handleAction(action) {
    switch (action) {
      case 'minimize':
        this.handleMinimize();
        break;
      case 'lock':
        this.handleLock();
        break;
      case 'close':
        this.handleClose();
        break;
      case 'copy':
        this.handleCopy();
        break;
      case 'regenerate':
        this.handleRegenerate();
        break;
    }
  }
  
  // Handle minimize/maximize
  handleMinimize() {
    this.isMinimized = !this.isMinimized;
    
    if (this.isMinimized) {
      this.overlay.classList.add('minimized');
    } else {
      this.overlay.classList.remove('minimized');
    }
    
    // Update button icon
    const btn = this.overlay.querySelector('[data-action="minimize"]');
    btn.textContent = this.isMinimized ? '⬜' : '➖';
  }
  
  // Handle lock/unlock
  async handleLock() {
    this.isLocked = !this.isLocked;
    
    if (this.isLocked) {
      this.overlay.classList.add('locked');
      this.overlay.querySelector('.overlay-header').classList.add('locked');
    } else {
      this.overlay.classList.remove('locked');
      this.overlay.querySelector('.overlay-header').classList.remove('locked');
    }
    
    // Update button icon
    const btn = this.overlay.querySelector('[data-action="lock"]');
    btn.textContent = this.isLocked ? '🔒' : '🔓';
    
    // Save lock state
    await this.storage.updateSetting('overlayLocked', this.isLocked);
  }
  
  // Handle close
  handleClose() {
    this.hide();
  }
  
  // Handle copy answer
  async handleCopy() {
    if (this.currentAnswer && this.currentAnswer !== false) {
      try {
        await navigator.clipboard.writeText(this.currentAnswer);
        
        // Show feedback
        const btn = this.overlay.querySelector('[data-action="copy"]');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
        
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  }
  
  // Handle regenerate answer
  async handleRegenerate() {
    if (this.currentQuestion) {
      this.currentAnswer = null; // Set to loading state
      this.updateContent();
      
      try {
        const pageContext = this.aiService.extractContextFromPage();
        const answer = await this.aiService.generateAnswer(this.currentQuestion, pageContext);
        this.currentAnswer = answer;
        
        // Save to history
        await this.storage.addToHistory(this.currentQuestion, answer, window.location.href);
        
      } catch (error) {
        console.error('Error regenerating answer:', error);
        this.currentAnswer = false;
      }
      
      this.updateContent();
    }
  }
  
  // Handle mouse down for dragging
  handleMouseDown(e) {
    if (this.isLocked) return;
    
    this.isDragging = true;
    
    const rect = this.overlay.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
    
    this.overlay.style.cursor = 'grabbing';
    e.preventDefault();
  }
  
  // Handle mouse move for dragging
  handleMouseMove(e) {
    if (!this.isDragging || this.isLocked) return;
    
    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - this.overlay.offsetWidth;
    const maxY = window.innerHeight - this.overlay.offsetHeight;
    
    this.position.x = Math.max(0, Math.min(x, maxX));
    this.position.y = Math.max(0, Math.min(y, maxY));
    
    this.overlay.style.left = `${this.position.x}px`;
    this.overlay.style.top = `${this.position.y}px`;
  }
  
  // Handle mouse up for dragging
  async handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.overlay.style.cursor = '';
      
      // Save position
      await this.savePosition();
    }
  }
  
  // Load saved position
  async loadPosition() {
    try {
      const settings = await this.storage.getSettings();
      if (settings.overlayPosition) {
        this.position = settings.overlayPosition;
      }
      this.isLocked = settings.overlayLocked || false;
    } catch (error) {
      console.error('Error loading position:', error);
    }
  }
  
  // Save current position
  async savePosition() {
    try {
      await this.storage.updateSetting('overlayPosition', this.position);
    } catch (error) {
      console.error('Error saving position:', error);
    }
  }
  
  // Check if overlay is visible
  isShown() {
    return this.isVisible;
  }
}

// Make InterviewOverlay globally available
window.InterviewOverlay = InterviewOverlay;
