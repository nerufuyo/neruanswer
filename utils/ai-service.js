// AI Service for generating interview answers
class AIService {
  constructor() {
    this.storage = window.storageManager;
  }
  
  // Generate answer using selected AI provider
  async generateAnswer(question, context = {}) {
    try {
      const settings = await this.storage.getSettings();
      
      if (!settings.apiKey) {
        throw new Error(CONFIG.MESSAGES.NO_API_KEY);
      }
      
      // Check cache first
      const cachedResponse = await this.storage.getCachedResponse(question);
      if (cachedResponse) {
        return cachedResponse.answer;
      }
      
      let answer;
      if (settings.aiProvider === CONFIG.AI_PROVIDERS.OPENAI) {
        answer = await this.generateWithOpenAI(question, settings, context);
      } else if (settings.aiProvider === CONFIG.AI_PROVIDERS.GEMINI) {
        answer = await this.generateWithGemini(question, settings, context);
      } else {
        throw new Error('Invalid AI provider selected');
      }
      
      // Cache the response
      await this.storage.cacheResponse(question, answer);
      
      return answer;
    } catch (error) {
      console.error('Error generating answer:', error);
      throw error;
    }
  }
  
  // Generate answer using OpenAI
  async generateWithOpenAI(question, settings, context) {
    const prompt = this.buildPrompt(question, context, settings.responseLanguage);
    
    const response = await fetch(CONFIG.API_ENDPOINTS.OPENAI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach helping someone answer interview questions professionally and concisely.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: settings.maxResponseLength * 2, // Rough estimation
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
  
  // Generate answer using Gemini
  async generateWithGemini(question, settings, context) {
    const prompt = this.buildPrompt(question, context, settings.responseLanguage);
    
    const response = await fetch(`${CONFIG.API_ENDPOINTS.GEMINI}?key=${settings.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: settings.maxResponseLength * 2
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }
  
  // Build optimized prompt for interview answers
  buildPrompt(question, context, language) {
    const languageInstruction = language === 'id' 
      ? 'Respond in Indonesian (Bahasa Indonesia)' 
      : 'Respond in English';
    
    let prompt = `${languageInstruction}. 

You are helping someone answer an interview question. Provide a concise, professional, and compelling answer.

Interview Question: "${question}"

Guidelines:
- Keep the answer between 60-90 seconds when spoken aloud
- Be specific and use examples when possible
- Show enthusiasm and confidence
- Structure: Brief intro + main points + conclusion
- Avoid generic answers, make it personal and authentic`;

    // Add context if available
    if (context.jobTitle) {
      prompt += `\n- Job Position: ${context.jobTitle}`;
    }
    if (context.company) {
      prompt += `\n- Company: ${context.company}`;
    }
    if (context.industry) {
      prompt += `\n- Industry: ${context.industry}`;
    }
    
    prompt += '\n\nProvide only the answer, no additional commentary:';
    
    return prompt;
  }
  
  // Extract context from the page (job title, company, etc.)
  extractContextFromPage() {
    const context = {};
    
    // Try to extract job title
    const jobTitleSelectors = [
      '[data-testid*="job-title"]',
      '.job-title',
      '[class*="position"]',
      '[class*="role"]'
    ];
    
    for (const selector of jobTitleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        context.jobTitle = element.textContent.trim();
        break;
      }
    }
    
    // Try to extract company name
    const companySelectors = [
      '[data-testid*="company"]',
      '.company-name',
      '[class*="company"]'
    ];
    
    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        context.company = element.textContent.trim();
        break;
      }
    }
    
    return context;
  }
}

// Make AIService globally available
window.aiService = new AIService();
