/**
 * AI Service for Groq API Integration with Llama 3.3 70B & Fallback Support
 */

import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    this.groq = this.apiKey ? new Groq({ apiKey: this.apiKey }) : null;
  }

  isConfigured() {
    return Boolean(this.apiKey && this.groq);
  }

  /**
   * Run Groq completion with JSON mode or Tool calling & 3.5s timeout safeguard
   */
  async generateCompletion({ prompt, systemPrompt, jsonMode = false }) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'GROQ_API_KEY not configured. Falling back to deterministic Rule Engine Mode.',
        isFallback: true
      };
    }

    try {
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Groq API response timeout (3.5s limit)')), 3500)
      );

      const response = await Promise.race([
        this.groq.chat.completions.create({
          messages,
          model: this.modelName,
          response_format: jsonMode ? { type: 'json_object' } : undefined,
          temperature: 0.2
        }),
        timeoutPromise
      ]);

      const content = response.choices[0]?.message?.content || '';

      return {
        success: true,
        content,
        data: jsonMode ? JSON.parse(content) : content,
        isFallback: false
      };
    } catch (err) {
      console.warn('Groq API Call Warning (Falling back to Rule Engine):', err.message);
      return {
        success: false,
        error: err.message,
        isFallback: true
      };
    }
  }
}

export const aiService = new AIService();
