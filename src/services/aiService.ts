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
   * Search for authentic Islamic books using AI.
   */
  async searchIslamicBooks(query: string): Promise<IslamicBook[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for Islamic books related to: "${query}"`,
        config: {
          systemInstruction: `You are an expert librarian specializing in Islamic literature. 
          Your goal is to help users find AUTHENTIC Islamic books.
          
          STRICT RULES:
          1. ONLY return Islamic books. 
          2. Return results as a JSON array of objects with keys: title, author, description, category, relevance.
          3. If the query is non-Islamic, return an empty array.`,
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
            text: `Analyze this Quranic recitation. The expected verse is: "${expectedText}". Evaluate the pronunciation, tajweed, and fluency.`
          },
          {
            inlineData: {
              mimeType: "audio/wav",
              data: base64Audio
            }
          }
        ],
        config: {
          systemInstruction: "You are a master Quran teacher. Analyze the recitation and provide a score (0-100), feedback, and specific mistakes. Return ONLY valid JSON.",
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
                    type: { type: Type.STRING, enum: ["incorrect", "missed", "hesitation"] },
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
            required: ["score", "feedback", "mistakes"]
          }
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : { score: 70, feedback: "Analysis empty", mistakes: [] };
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
