import axios from 'axios';

export interface IslamicBook {
  title: string;
  author: string;
  description: string;
  category: string;
  relevance: string;
}

export const aiService = {
  /**
   * General purpose AI assistant for Islamic questions.
   */
  async askAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post('/api/ai/ask', { 
        prompt, 
        systemInstruction: "You are an expert in Islamic studies, providing accurate, clear, and compassionate guidance based on authentic sources (Quran and Sunnah)."
      });
      return response.data.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("AI Assistant error:", error);
      throw error;
    }
  },

  /**
   * Explains a Quranic verse in simple terms.
   */
  async explainVerseSimple(verseText: string, language: string): Promise<string> {
    try {
      const response = await axios.post('/api/ai/explain-verse', { verseText, language });
      return response.data.text || "No explanation available.";
    } catch (error) {
      console.error("Verse explanation error:", error);
      throw error;
    }
  },

  /**
   * Fetches detailed information about a specific book with Bengali support.
   */
  async getBookDetails(title: string, author: string): Promise<any> {
    try {
      const response = await axios.post('/api/ai/book-details', { title, author });
      return response.data || { 
        fullDescription: "বিস্তারিত তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না।", 
        regionsCovered: [], 
        targetAudience: [], 
        keyTopics: [] 
      };
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      throw error;
    }
  },

  /**
   * Search for authentic Islamic books using AI with Bengali support.
   */
  async searchIslamicBooks(query: string): Promise<IslamicBook[]> {
    try {
      const response = await axios.post('/api/ai/search-books', { query });
      return response.data as IslamicBook[];
    } catch (error) {
      console.error("Book search failed:", error);
      return [];
    }
  },

  /**
   * Analyzes an audio recitation of a Quranic verse.
   */
  async analyzeRecitation(audioBuffer: ArrayBuffer, expectedText: string): Promise<any> {
    try {
      const base64Audio = btoa(
        new Uint8Array(audioBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const response = await axios.post('/api/ai/analyze-recitation', {
        audioBase64: base64Audio,
        expectedText
      });
      
      return response.data || { 
        score: 0, 
        feedback: "বিশ্লেষণ করা সম্ভব হয়নি।", 
        mistakes: [], 
        tajweedCheck: { "তাজবীদ": "অজানা" } 
      };
    } catch (error) {
      console.error("Recitation analysis failed:", error);
      throw error;
    }
  },

  /**
   * Searches for a Quranic verse by voice input.
   */
  async searchVerseByVoice(audioBuffer: ArrayBuffer): Promise<any> {
    try {
      const base64Audio = btoa(
        new Uint8Array(audioBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const response = await axios.post('/api/ai/voice-search', {
        audioBase64: base64Audio
      });
      
      return response.data;
    } catch (error) {
      console.error("Voice search failed:", error);
      throw error;
    }
  }
};
