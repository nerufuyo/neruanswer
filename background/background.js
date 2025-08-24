// Background service worker for AI Interview Assistant
class BackgroundService {
  constructor() {
    this.activeTab = null;
    this.questionHistory = [];
    
    this.setupEventListeners();
    console.log('AI Interview Assistant background service started');
  }
  
  setupEventListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstalled(details);
    });
    
    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
    
    // Handle tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdated(tabId, changeInfo, tab);
    });
    
    // Handle tab activation
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivated(activeInfo);
    });
    
    // Handle action (toolbar icon) clicks
    chrome.action.onClicked.addListener((tab) => {
      this.handleActionClicked(tab);
    });
  }
  
  async handleInstalled(details) {
    if (details.reason === 'install') {
      // First time installation
      console.log('AI Interview Assistant installed for the first time');
      
      // Set default settings
      await chrome.storage.local.set({
        settings: {
          enabled: false,
          aiProvider: 'openai',
          apiKey: '',
          overlayPosition: { x: 20, y: 20 },
          overlayLocked: false,
          autoDetect: true,
          responseLanguage: 'id',
          maxResponseLength: 200
        }
      });
      
      // Open welcome page or popup
      chrome.tabs.create({
        url: chrome.runtime.getURL('popup/popup.html')
      });
      
    } else if (details.reason === 'update') {
      // Extension updated
      console.log('AI Interview Assistant updated');
    }
  }
  
  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'questionDetected':
          await this.handleQuestionDetected(message, sender.tab);
          sendResponse({ success: true });
          break;
          
        case 'getActiveTabStatus':
          const status = await this.getActiveTabStatus();
          sendResponse({ success: true, status });
          break;
          
        case 'toggleExtension':
          await this.toggleExtension(message.tabId);
          sendResponse({ success: true });
          break;
          
        case 'updateSettings':
          await this.updateSettings(message.settings);
          sendResponse({ success: true });
          break;
          
        case 'getHistory':
          const history = await this.getQuestionHistory();
          sendResponse({ success: true, history });
          break;
          
        case 'clearHistory':
          await this.clearHistory();
          sendResponse({ success: true });
          break;
          
        case 'testApiKey':
          const isValid = await this.testApiKey(message.provider, message.apiKey);
          sendResponse({ success: true, valid: isValid });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling background message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  async handleQuestionDetected(message, tab) {
    const { question, context, url } = message;
    
    // Add to history
    this.questionHistory.unshift({
      id: Date.now(),
      question,
      context,
      url,
      tabId: tab.id,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 questions in memory
    if (this.questionHistory.length > 20) {
      this.questionHistory.splice(20);
    }
    
    // Update badge to show active state
    this.updateBadge(tab.id, '●');
    
    // Show notification if enabled
    const settings = await this.getSettings();
    if (settings.showNotifications) {
      this.showNotification(question, tab.url);
    }
    
    console.log('Question detected in background:', question);
  }
  
  async handleTabUpdated(tabId, changeInfo, tab) {
    // Check if tab finished loading
    if (changeInfo.status === 'complete' && tab.url) {
      // Check if this is a supported interview platform
      if (this.isSupportedPlatform(tab.url)) {
        // Update badge to indicate supported platform
        this.updateBadge(tabId, '');
        this.updateBadgeColor(tabId, '#22c55e'); // Green for supported
      } else {
        // Reset badge for unsupported platforms
        this.updateBadge(tabId, '');
        this.updateBadgeColor(tabId, '#6b7280'); // Gray for unsupported
      }
    }
  }
  
  async handleTabActivated(activeInfo) {
    this.activeTab = activeInfo.tabId;
    
    // Get tab info and update badge accordingly
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      if (this.isSupportedPlatform(tab.url)) {
        this.updateBadgeColor(activeInfo.tabId, '#22c55e');
      } else {
        this.updateBadgeColor(activeInfo.tabId, '#6b7280');
      }
    }
  }
  
  async handleActionClicked(tab) {
    // Toggle extension for current tab
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
    } catch (error) {
      // If content script not loaded, inject it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            'utils/config.js',
            'utils/storage.js',
            'utils/ai-service.js',
            'content/detector.js',
            'content/overlay.js',
            'content/content.js'
          ]
        });
        
        // Try again after a short delay
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
          } catch (e) {
            console.error('Failed to communicate with content script:', e);
          }
        }, 500);
        
      } catch (injectionError) {
        console.error('Failed to inject content script:', injectionError);
      }
    }
  }
  
  async getActiveTabStatus() {
    if (!this.activeTab) return null;
    
    try {
      const response = await chrome.tabs.sendMessage(this.activeTab, { action: 'getStatus' });
      return response.status;
    } catch (error) {
      return null;
    }
  }
  
  async toggleExtension(tabId) {
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'toggle' });
      return true;
    } catch (error) {
      console.error('Failed to toggle extension:', error);
      return false;
    }
  }
  
  async updateSettings(settings) {
    // Save settings
    const currentSettings = await this.getSettings();
    const newSettings = { ...currentSettings, ...settings };
    
    await chrome.storage.local.set({ settings: newSettings });
    
    // Notify all tabs about settings update
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateSettings',
          settings: newSettings
        });
      } catch (error) {
        // Ignore errors for tabs without content script
      }
    }
  }
  
  async getSettings() {
    try {
      const result = await chrome.storage.local.get('settings');
      return result.settings || {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }
  
  async getQuestionHistory() {
    try {
      const result = await chrome.storage.local.get('history');
      return result.history || [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }
  
  async clearHistory() {
    try {
      await chrome.storage.local.set({ history: [] });
      this.questionHistory = [];
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
  
  async testApiKey(provider, apiKey) {
    try {
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        return response.ok;
      } else if (provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        return response.ok;
      }
      return false;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }
  
  isSupportedPlatform(url) {
    const hostname = new URL(url).hostname.toLowerCase();
    
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
  
  updateBadge(tabId, text) {
    chrome.action.setBadgeText({
      tabId: tabId,
      text: text
    });
  }
  
  updateBadgeColor(tabId, color) {
    chrome.action.setBadgeBackgroundColor({
      tabId: tabId,
      color: color
    });
  }
  
  showNotification(question, url) {
    const domain = new URL(url).hostname;
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Question Detected!',
      message: `New interview question detected on ${domain}`,
      contextMessage: question.length > 100 ? question.substring(0, 100) + '...' : question
    });
  }
}

// Initialize background service
const backgroundService = new BackgroundService();
