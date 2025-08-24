// Storage utility for Chrome extension
class StorageManager {
  constructor() {
    this.storage = chrome.storage.local;
  }
  
  // Get settings with defaults
  async getSettings() {
    try {
      const result = await this.storage.get('settings');
      return {
        ...CONFIG.DEFAULT_SETTINGS,
        ...result.settings
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return CONFIG.DEFAULT_SETTINGS;
    }
  }
  
  // Save settings
  async saveSettings(settings) {
    try {
      await this.storage.set({ settings });
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
  
  // Get specific setting
  async getSetting(key) {
    const settings = await this.getSettings();
    return settings[key];
  }
  
  // Update specific setting
  async updateSetting(key, value) {
    const settings = await this.getSettings();
    settings[key] = value;
    return await this.saveSettings(settings);
  }
  
  // Get interview history
  async getHistory() {
    try {
      const result = await this.storage.get('history');
      return result.history || [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }
  
  // Add to interview history
  async addToHistory(question, answer, url) {
    try {
      const history = await this.getHistory();
      const entry = {
        id: Date.now(),
        question,
        answer,
        url,
        timestamp: new Date().toISOString()
      };
      
      history.unshift(entry);
      
      // Keep only configured number of entries
      const maxEntries = CONFIG.PERFORMANCE.MAX_HISTORY_ENTRIES;
      if (history.length > maxEntries) {
        history.splice(maxEntries);
      }
      
      await this.storage.set({ history });
      return true;
    } catch (error) {
      console.error('Error adding to history:', error);
      return false;
    }
  }
  
  // Clear history
  async clearHistory() {
    try {
      await this.storage.set({ history: [] });
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
  
  // Get cached responses (to avoid repeated API calls for same questions)
  async getCachedResponse(question) {
    try {
      const result = await this.storage.get('responseCache');
      const cache = result.responseCache || {};
      const questionHash = this.hashString(question);
      return cache[questionHash];
    } catch (error) {
      console.error('Error getting cached response:', error);
      return null;
    }
  }
  
  // Cache response
  async cacheResponse(question, answer) {
    try {
      const result = await this.storage.get('responseCache');
      const cache = result.responseCache || {};
      const questionHash = this.hashString(question);
      
      cache[questionHash] = {
        answer,
        timestamp: Date.now()
      };
      
      // Clean old cache entries based on configured expiry time
      const expiryTime = Date.now() - (CONFIG.PERFORMANCE.CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
      Object.keys(cache).forEach(key => {
        if (cache[key].timestamp < expiryTime) {
          delete cache[key];
        }
      });
      
      await this.storage.set({ responseCache: cache });
      return true;
    } catch (error) {
      console.error('Error caching response:', error);
      return false;
    }
  }
  
  // Simple hash function for caching
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
}

// Make StorageManager globally available
window.storageManager = new StorageManager();
