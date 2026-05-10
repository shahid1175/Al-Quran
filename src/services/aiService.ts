import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert in Islamic studies, providing accurate, clear, and compassionate guidance based on authentic sources (Quran and Sunnah)."
        }
      });
      return response.text || "I'm sorry, I couldn't generate a response.";
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
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain the following Quranic verse in a simple way for a ${language} speaker: "${verseText}"`,
        config: {
          systemInstruction: "You are a teacher who explains the Quran to children and beginners. Use simple language and heartwarming examples."
        }
      });
      return response.text || "No explanation available.";
    } catch (error) {
      console.error("Verse explanation error:", error);
      throw error;
    }
  },

  /**
   * Fetches detailed information about a specific book with Bengali support.
   */
  async getBookDetails(title: string, author: string): Promise<{ fullDescription: string; regionsCovered: string[]; targetAudience: string[]; keyTopics: string[] }> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide deep insights for the Islamic book: "${title}" by ${author}. Please provide the full description and topics in Bengali.`,
        config: {
          systemInstruction: `You are an expert Islamic bibliographer. 
          Provide a detailed JSON response for the requested book.
          IMPORTANT: The 'fullDescription', 'regionsCovered', 'targetAudience', and 'keyTopics' MUST be written in BENGALI (বাংলা).
          
          Include:
          - fullDescription: A rich, 3-paragraph explanation of the book's impact and content.
          - regionsCovered: List of geographical or cultural areas where this book is most influential.
          - targetAudience: Who should read this (e.g., Beginners, Advanced Scholars).
          - keyTopics: Top 5 specific chapters or subjects discussed in the book.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullDescription: { type: Type.STRING },
              regionsCovered: { type: Type.ARRAY, items: { type: Type.STRING } },
              targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["fullDescription", "regionsCovered", "targetAudience", "keyTopics"]
          }
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : { 
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
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for Islamic books related to: "${query}". Provide the response details in Bengali primarily, with English in parentheses if needed.`,
        config: {
          systemInstruction: `You are an expert librarian specializing in Islamic literature. 
          Your goal is to help users find AUTHENTIC Islamic books (Quran tafsir, Hadith collections, Fiqh, Seerah, Islamic history, Spirituality, etc.).
          
          STRICT RULES:
          1. ONLY return Islamic books. If a query is for a non-Islamic book or a general topic not related to Islam, return an empty array.
          2. Return results as a JSON array of objects.
          3. For each book, provide: Title, Author, Description, Category, and Relevance.
          4. IMPORTANT: Write 'title', 'description', 'author', and 'relevance' in BENGALI (বাংলা). You can include the English name in brackets.
          5. Category should be in English (e.g., Tafsir, Hadith).`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                relevance: { type: Type.STRING }
              },
              required: ["title", "author", "description", "category", "relevance"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as IslamicBook[];
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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `Please listen to this Quranic recitation and compare it with the following verse text: "${expectedText}". 
            Evaluate the pronunciation (Makhraj), Tajweed rules (like Ghunnah, Qalqalah, Madd), and overall fluency.`
          },
          {
            inlineData: {
              mimeType: "audio/flac", // Use flac or wav, most recorders use wav but flac is often better for AI
              data: base64Audio
            }
          }
        ],
        config: {
          systemInstruction: `You are a world-class Quran teacher (Qari). Your goal is to guide students in perfecting their recitation.
          Provide a score from 0 to 100 based on accuracy.
          IMPORTANT: All textual feedback, suggestions, and rule names MUST be in BENGALI (বাংলা).
          
          Guidelines:
          - score: Overall performance mark.
          - feedback: A helpful summary of the recitation in Bengali.
          - mistakes: Array of specific errors. Each has 'word' (the Arabic word), 'type' (incorrect, missed, hesitation), and 'suggestion' (in Bengali).
          - tajweedCheck: An object where keys are Tajweed rule names in Bengali (e.g., "গুন্নাহ", "কলকলাহ", "মাখরাজ") and values are performance labels in Bengali (e.g., "সঠিক", "ভালো", "উন্নতি প্রয়োজন").
          
          Return ONLY valid JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              mistakes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    type: { type: Type.STRING }, // removed enum for more flexibility
                    suggestion: { type: Type.STRING }
                  },
                  required: ["word", "type", "suggestion"]
                }
              },
              tajweedCheck: {
                type: Type.OBJECT,
                additionalProperties: { type: Type.STRING }
              }
            },
            required: ["score", "feedback", "mistakes", "tajweedCheck"]
          }
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : { 
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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: "Identify the Quranic verse being recited in this audio." },
          { inlineData: { mimeType: "audio/wav", data: base64Audio } }
        ],
        config: {
          systemInstruction: "Identify the Surah and Verse number. Return ONLY JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              surahId: { type: Type.NUMBER },
              ayahNumber: { type: Type.NUMBER },
              verseText: { type: Type.STRING }
            },
            required: ["surahId", "ayahNumber"]
          }
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Voice search failed:", error);
      throw error;
    }
  }
};
