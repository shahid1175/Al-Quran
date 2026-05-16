import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ 
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Middleware to check API key
  const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }
    next();
  };

  // API Routes
  app.post("/api/ai/ask", checkApiKey, async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { systemInstruction }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Ask error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/explain-verse", checkApiKey, async (req, res) => {
    try {
      const { verseText, language } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain the following Quranic verse in a simple way for a ${language} speaker: "${verseText}"`,
        config: {
          systemInstruction: "You are a teacher who explains the Quran to children and beginners. Use simple language and heartwarming examples."
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Verse explanation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/analyze-recitation", checkApiKey, async (req, res) => {
    try {
      const { audioBase64, expectedText } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `Please listen to this Quranic recitation and compare it with the following verse text: "${expectedText}". 
            Evaluate the pronunciation (Makhraj), Tajweed rules (like Ghunnah, Qalqalah, Madd), and overall fluency.`
          },
          {
            inlineData: {
              mimeType: "audio/webm",
              data: audioBase64
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
                    type: { type: Type.STRING },
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
      res.json(text ? JSON.parse(text) : null);
    } catch (error: any) {
      console.error("Recitation analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/book-details", checkApiKey, async (req, res) => {
    try {
      const { title, author } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide deep insights for the Islamic book: "${title}" by ${author}. Please provide the full description and topics in Bengali.`,
        config: {
          systemInstruction: `You are an expert Islamic bibliographer. 
          Provide a detailed JSON response for the requested book.
          IMPORTANT: The 'fullDescription', 'regionsCovered', 'targetAudience', and 'keyTopics' MUST be written in BENGALI (বাংলা).`,
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
      res.json(text ? JSON.parse(text) : null);
    } catch (error: any) {
      console.error("Book details error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/search-books", checkApiKey, async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for Islamic books related to: "${query}". Provide the response details in Bengali primarily.`,
        config: {
          systemInstruction: `You are an expert librarian specializing in Islamic literature. 
          ONLY return Islamic books. Results as a JSON array of objects.
          Provide: Title, Author, Description, Category, and Relevance in BENGALI.`,
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
      res.json(text ? JSON.parse(text) : []);
    } catch (error: any) {
      console.error("Book search error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/voice-search", checkApiKey, async (req, res) => {
    try {
      const { audioBase64 } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: "Identify the Quranic verse being recited in this audio." },
          { inlineData: { mimeType: "audio/webm", data: audioBase64 } }
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
      res.json(text ? JSON.parse(text) : null);
    } catch (error: any) {
      console.error("Voice search error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
