// Popup script for AI Interview Assistant
class PopupManager {
  constructor() {
    this.isLoading = false;
    this.currentTab = null;
    this.settings = {};
    
    this.init();
  }
  
  async init() {
    try {
      // Get current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tabs[0];
      
      // Load settings and status
      await this.loadSettings();
      await this.loadStatus();
      
      // Setup event listeners
      this.setupEventListeners();
      
      console.log('Popup initialized');
    } catch (error) {
      console.error('Error initializing popup:', error);
      this.showError('Failed to initialize popup');
    }
  }
  
  async loadSettings() {
    try {
      const result = await chrome.storage.local.get('settings');
      this.settings = result.settings || {};
      
      // Update UI with current settings
      this.updateSettingsUI();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  async loadStatus() {
    try {
      // Get status from background script
      const response = await chrome.runtime.sendMessage({ action: 'getActiveTabStatus' });
      
      if (response.success && response.status) {
        this.updateStatusUI(response.status);
      } else {
        // Try to get status from content script directly
        try {
          const contentResponse = await chrome.tabs.sendMessage(this.currentTab.id, { action: 'getStatus' });
          if (contentResponse.success) {
            this.updateStatusUI(contentResponse.status);
          }
        } catch (error) {
          // Content script not available
          this.updateStatusUI({
            enabled: false,
            hasQuestion: false,
            overlayVisible: false
          });
        }
      }
      
      // Update platform detection
      this.updatePlatformUI();
      
    } catch (error) {
      console.error('Error loading status:', error);
    }
  }
  
  updateSettingsUI() {
    // Main toggle
    const mainToggle = document.getElementById('main-toggle');
    if (mainToggle) {
      mainToggle.checked = this.settings.enabled || false;
    }
    
    // AI Provider
    const aiProvider = document.getElementById('ai-provider');
    if (aiProvider) {
      aiProvider.value = this.settings.aiProvider || 'openai';
      this.updateApiHint();
    }
    
    // API Key
    const apiKey = document.getElementById('api-key');
    if (apiKey) {
      apiKey.value = this.settings.apiKey || '';
    }
    
    // Response Language
    const responseLanguage = document.getElementById('response-language');
    if (responseLanguage) {
      responseLanguage.value = this.settings.responseLanguage || 'id';
    }
    
    // Auto Detect
    const autoDetect = document.getElementById('auto-detect');
    if (autoDetect) {
      autoDetect.checked = this.settings.autoDetect !== false;
    }
    
    // Overlay Locked
    const overlayLocked = document.getElementById('overlay-locked');
    if (overlayLocked) {
      overlayLocked.checked = this.settings.overlayLocked || false;
    }
  }
  
  updateStatusUI(status) {
    // Status indicator
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (status.enabled) {
      statusIndicator.classList.add('active');
      statusText.textContent = 'Active';
    } else {
      statusIndicator.classList.remove('active');
      statusText.textContent = 'Disabled';
    }
    
    // Question status
    const questionStatus = document.getElementById('question-status');
    const questionText = document.getElementById('question-text');
    
    if (status.hasQuestion) {
      questionStatus.style.display = 'flex';
      questionText.textContent = status.currentQuestion || 'Question detected';
      questionText.title = status.currentQuestion || '';
    } else {
      questionStatus.style.display = 'none';
    }
  }
  
  updatePlatformUI() {
    const platformValue = document.getElementById('platform-value');
    if (!platformValue) return;
    
    const hostname = new URL(this.currentTab.url).hostname.toLowerCase();
    
    const platforms = {
      'hirevue.com': '✅ HireVue',
      'myinterview.com': '✅ myInterview',
      'spark-hire.com': '✅ Spark Hire',
      'vidcruiter.com': '✅ VidCruiter',
      'talview.com': '✅ Talview',
      'interview.com': '✅ Interview.com',
      'zoom.us': '⚠️ Zoom',
      'meet.google.com': '⚠️ Google Meet',
      'teams.microsoft.com': '⚠️ Microsoft Teams'
    };
    
    let platformText = '❌ Unsupported';
    for (const [domain, platform] of Object.entries(platforms)) {
      if (hostname.includes(domain)) {
        platformText = platform;
        break;
      }
    }
    
    platformValue.textContent = platformText;
  }
  
  updateApiHint() {
    const provider = document.getElementById('ai-provider').value;
    const apiHint = document.getElementById('api-hint');
    const apiLink = document.getElementById('api-link');
    
    if (provider === 'openai') {
      apiHint.textContent = 'Get your API key from OpenAI dashboard';
      apiLink.href = 'https://platform.openai.com/api-keys';
    } else if (provider === 'gemini') {
      apiHint.textContent = 'Get your API key from Google AI Studio';
      apiLink.href = 'https://makersuite.google.com/app/apikey';
    }
  }
  
  setupEventListeners() {
    // Main toggle
    const mainToggle = document.getElementById('main-toggle');
    if (mainToggle) {
      mainToggle.addEventListener('change', () => this.handleMainToggle());
    }
    
    // AI Provider change
    const aiProvider = document.getElementById('ai-provider');
    if (aiProvider) {
      aiProvider.addEventListener('change', () => {
        this.updateApiHint();
        this.saveSetting('aiProvider', aiProvider.value);
      });
    }
    
    // API Key change
    const apiKey = document.getElementById('api-key');
    if (apiKey) {
      apiKey.addEventListener('input', () => {
        this.saveSetting('apiKey', apiKey.value);
      });
    }
    
    // Test API Key
    const testKey = document.getElementById('test-key');
    if (testKey) {
      testKey.addEventListener('click', () => this.testApiKey());
    }
    
    // Response Language
    const responseLanguage = document.getElementById('response-language');
    if (responseLanguage) {
      responseLanguage.addEventListener('change', () => {
        this.saveSetting('responseLanguage', responseLanguage.value);
      });
    }
    
    // Auto Detect
    const autoDetect = document.getElementById('auto-detect');
    if (autoDetect) {
      autoDetect.addEventListener('change', () => {
        this.saveSetting('autoDetect', autoDetect.checked);
      });
    }
    
    // Overlay Locked
    const overlayLocked = document.getElementById('overlay-locked');
    if (overlayLocked) {
      overlayLocked.addEventListener('change', () => {
        this.saveSetting('overlayLocked', overlayLocked.checked);
      });
    }
    
    // Force Detection
    const forceDetect = document.getElementById('force-detect');
    if (forceDetect) {
      forceDetect.addEventListener('click', () => this.forceDetection());
    }
    
    // View History
    const viewHistory = document.getElementById('view-history');
    if (viewHistory) {
      viewHistory.addEventListener('click', () => this.viewHistory());
    }
    
    // Help and Feedback links
    const helpLink = document.getElementById('help-link');
    if (helpLink) {
      helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://github.com/your-repo/ai-interview-assistant#readme' });
      });
    }
    
    const feedbackLink = document.getElementById('feedback-link');
    if (feedbackLink) {
      feedbackLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://github.com/your-repo/ai-interview-assistant/issues' });
      });
    }
  }
  
  async handleMainToggle() {
    const mainToggle = document.getElementById('main-toggle');
    const enabled = mainToggle.checked;
    
    try {
      this.showLoading(true);
      
      // Save setting
      await this.saveSetting('enabled', enabled);
      
      // Toggle extension in content script
      try {
        await chrome.tabs.sendMessage(this.currentTab.id, { action: 'toggle' });
      } catch (error) {
        // Content script might not be loaded, that's okay
        console.log('Content script not loaded, settings saved for next page load');
      }
      
      // Update status
      await this.loadStatus();
      
    } catch (error) {
      console.error('Error toggling extension:', error);
      this.showError('Failed to toggle extension');
      
      // Revert toggle state
      mainToggle.checked = !enabled;
    } finally {
      this.showLoading(false);
    }
  }
  
  async saveSetting(key, value) {
    try {
      this.settings[key] = value;
      await chrome.storage.local.set({ settings: this.settings });
      
      // Notify background script
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: { [key]: value }
      }).catch(() => {
        // Ignore if background script is not available
      });
      
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  }
  
  async testApiKey() {
    const testBtn = document.getElementById('test-key');
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('api-key').value;
    
    if (!apiKey.trim()) {
      this.showError('Please enter an API key first');
      return;
    }
    
    try {
      // Update button state
      testBtn.classList.add('testing');
      testBtn.textContent = '⏳';
      testBtn.disabled = true;
      
      // Test the API key
      const response = await chrome.runtime.sendMessage({
        action: 'testApiKey',
        provider: provider,
        apiKey: apiKey
      });
      
      if (response.success && response.valid) {
        testBtn.classList.remove('testing');
        testBtn.classList.add('success');
        testBtn.textContent = '✅';
        
        setTimeout(() => {
          testBtn.classList.remove('success');
          testBtn.textContent = '🔍';
          testBtn.disabled = false;
        }, 2000);
        
      } else {
        throw new Error('Invalid API key');
      }
      
    } catch (error) {
      console.error('Error testing API key:', error);
      
      testBtn.classList.remove('testing');
      testBtn.classList.add('error');
      testBtn.textContent = '❌';
      
      setTimeout(() => {
        testBtn.classList.remove('error');
        testBtn.textContent = '🔍';
        testBtn.disabled = false;
      }, 2000);
      
      this.showError('Invalid API key');
    }
  }
  
  async forceDetection() {
    try {
      await chrome.tabs.sendMessage(this.currentTab.id, { action: 'forceDetection' });
      
      // Update status after a short delay
      setTimeout(() => this.loadStatus(), 1000);
      
    } catch (error) {
      console.error('Error forcing detection:', error);
      this.showError('Failed to detect questions. Make sure the extension is enabled.');
    }
  }
  
  async viewHistory() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getHistory' });
      
      if (response.success) {
        // For now, just log the history. In a full implementation,
        // you might want to show a modal or open a new tab
        console.log('Question History:', response.history);
        
        if (response.history.length === 0) {
          this.showError('No question history found');
        } else {
          // Simple alert for demo purposes
          alert(`Found ${response.history.length} questions in history. Check console for details.`);
        }
      }
    } catch (error) {
      console.error('Error viewing history:', error);
      this.showError('Failed to load history');
    }
  }
  
  showLoading(show) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    this.isLoading = show;
  }
  
  showError(message) {
    // Simple error display - in a full implementation you might want a better UI
    console.error(message);
    
    // You could implement a toast notification here
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10000;
      animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
