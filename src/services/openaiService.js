// OpenAI Service - Handles AI-powered content generation
import OpenAI from 'openai';

// OpenAI configuration
const OPENAI_CONFIG = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'demo_api_key',
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7
};

class OpenAIService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  // Initialize OpenAI client
  initialize() {
    if (this.initialized) return this.client;

    try {
      this.client = new OpenAI({
        apiKey: OPENAI_CONFIG.apiKey,
        dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
      });
      this.initialized = true;
      return this.client;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      throw new Error('AI service unavailable');
    }
  }

  // Generate encounter card content
  async generateEncounterCard(params) {
    try {
      this.initialize();

      const {
        state,
        location,
        situation = 'general',
        language = 'en',
        userRights = []
      } = params;

      const prompt = this.buildEncounterCardPrompt({
        state,
        location,
        situation,
        language,
        userRights
      });

      const response = await this.client.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a legal rights assistant that creates concise, accurate encounter cards for police interactions. Focus on constitutional rights and state-specific laws. Always include disclaimers about consulting attorneys.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: OPENAI_CONFIG.temperature
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      // Parse the generated content into structured format
      const encounterCard = this.parseEncounterCardContent(content, params);

      return {
        success: true,
        encounterCard,
        usage: response.usage
      };
    } catch (error) {
      console.error('Failed to generate encounter card:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate contextual legal advice
  async generateLegalAdvice(params) {
    try {
      this.initialize();

      const {
        state,
        situation,
        question,
        language = 'en'
      } = params;

      const prompt = `
        Provide legal guidance for the following situation in ${state}:
        
        Situation: ${situation}
        Question: ${question}
        Language: ${language}
        
        Please provide:
        1. Relevant constitutional rights
        2. State-specific laws that apply
        3. Recommended actions
        4. Important warnings or considerations
        
        Keep the response concise and practical. Always include a disclaimer about consulting a qualified attorney.
        ${language === 'es' ? 'Respond in Spanish.' : 'Respond in English.'}
      `;

      const response = await this.client.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable legal assistant specializing in constitutional rights and police interactions. Provide accurate, helpful guidance while emphasizing the importance of professional legal counsel.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: 0.3 // Lower temperature for more consistent legal advice
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No advice generated');
      }

      return {
        success: true,
        advice: content,
        usage: response.usage
      };
    } catch (error) {
      console.error('Failed to generate legal advice:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate custom scripts for specific situations
  async generateCustomScripts(params) {
    try {
      this.initialize();

      const {
        state,
        situation,
        language = 'en',
        tone = 'polite'
      } = params;

      const prompt = `
        Generate 5-7 scripted responses for police interactions in ${state} for the following situation:
        
        Situation: ${situation}
        Tone: ${tone}
        Language: ${language}
        
        The scripts should:
        1. Assert constitutional rights clearly
        2. Be respectful and non-confrontational
        3. Be appropriate for ${state} laws
        4. Be easy to remember under stress
        
        Format as a JSON array of strings.
        ${language === 'es' ? 'Generate scripts in Spanish.' : 'Generate scripts in English.'}
      `;

      const response = await this.client.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert in constitutional rights and police interaction protocols. Generate clear, legally sound scripts that help people assert their rights respectfully.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: 0.5
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No scripts generated');
      }

      // Try to parse as JSON, fallback to text parsing
      let scripts;
      try {
        scripts = JSON.parse(content);
      } catch {
        scripts = this.parseScriptsFromText(content);
      }

      return {
        success: true,
        scripts,
        usage: response.usage
      };
    } catch (error) {
      console.error('Failed to generate custom scripts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate state-specific legal summary
  async generateStateLegalSummary(state, language = 'en') {
    try {
      this.initialize();

      const prompt = `
        Create a comprehensive legal rights summary for ${state} covering:
        
        1. Traffic stop procedures and rights
        2. Search and seizure laws
        3. Identification requirements
        4. Recording laws
        5. Key state-specific statutes
        
        Language: ${language}
        
        Format as structured JSON with sections for each topic.
        Include specific statute numbers where applicable.
        ${language === 'es' ? 'Generate content in Spanish.' : 'Generate content in English.'}
      `;

      const response = await this.client.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a legal research assistant with expertise in state laws and constitutional rights. Provide accurate, well-structured legal information with proper citations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No summary generated');
      }

      // Try to parse as JSON
      let summary;
      try {
        summary = JSON.parse(content);
      } catch {
        summary = { content, parsed: false };
      }

      return {
        success: true,
        summary,
        usage: response.usage
      };
    } catch (error) {
      console.error('Failed to generate state legal summary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Build encounter card prompt
  buildEncounterCardPrompt(params) {
    const { state, location, situation, language, userRights } = params;

    return `
      Create a concise encounter card for a police interaction with the following details:
      
      State: ${state}
      Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Unknown'}
      Situation: ${situation}
      Language: ${language}
      
      Include:
      1. Essential rights summary (3-4 key points)
      2. Recommended phrases to use
      3. Important state-specific considerations
      4. Emergency contact reminder
      5. Legal disclaimer
      
      Keep it concise - this should fit on a shareable card.
      ${language === 'es' ? 'Generate in Spanish.' : 'Generate in English.'}
      
      Format as JSON with sections: title, rights, phrases, stateSpecific, disclaimer
    `;
  }

  // Parse encounter card content
  parseEncounterCardContent(content, params) {
    try {
      const parsed = JSON.parse(content);
      return {
        id: `card-${Date.now()}`,
        title: parsed.title || `Rights Card - ${params.state}`,
        state: params.state,
        location: params.location,
        situation: params.situation,
        language: params.language,
        rights: parsed.rights || [],
        phrases: parsed.phrases || [],
        stateSpecific: parsed.stateSpecific || [],
        disclaimer: parsed.disclaimer || 'This is not legal advice. Consult an attorney.',
        timestamp: new Date().toISOString(),
        generatedBy: 'ai'
      };
    } catch {
      // Fallback parsing if JSON fails
      return {
        id: `card-${Date.now()}`,
        title: `Rights Card - ${params.state}`,
        state: params.state,
        location: params.location,
        content: content,
        timestamp: new Date().toISOString(),
        generatedBy: 'ai'
      };
    }
  }

  // Parse scripts from text content
  parseScriptsFromText(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const scripts = [];

    for (const line of lines) {
      // Look for numbered lists, bullet points, or quoted text
      const match = line.match(/^\d+\.\s*(.+)$/) || 
                   line.match(/^[-*]\s*(.+)$/) || 
                   line.match(/^"(.+)"$/) ||
                   line.match(/^'(.+)'$/);
      
      if (match) {
        scripts.push(match[1].trim());
      } else if (line.trim().length > 10 && !line.includes(':')) {
        scripts.push(line.trim());
      }
    }

    return scripts.slice(0, 7); // Limit to 7 scripts
  }

  // Check if service is available
  isAvailable() {
    return this.initialized && this.client !== null && OPENAI_CONFIG.apiKey !== 'demo_api_key';
  }

  // Get usage statistics (for rate limiting)
  getUsageStats() {
    // In a real app, you'd track this
    return {
      requestsToday: 0,
      tokensUsed: 0,
      remainingQuota: 1000
    };
  }
}

// Create singleton instance
const openaiService = new OpenAIService();

export default openaiService;

// Named exports
export {
  openaiService,
  OPENAI_CONFIG
};

