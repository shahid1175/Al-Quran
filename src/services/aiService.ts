import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Browser-compatible arrayBuffer to base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const aiService = {
  async analyzeRecitation(audioBuffer: ArrayBuffer, expectedText: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: arrayBufferToBase64(audioBuffer),
            },
          },
          {
            text: `Evaluate the tajweed of this recitation compared to the following verse: "${expectedText}". 
            Identify specific mistakes: missed words, incorrect pronunciations, or skipped segments.
            Return ONLY a JSON object with: 
            - score (number 0-100)
            - feedback (string in Bangla)
            - mistakes (array of objects: { word: string, type: 'missed' | 'incorrect' | 'skipped', suggestion: string })
            - tajweedCheck (object with rule names and status)`,
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async searchVerseByVoice(audioBuffer: ArrayBuffer) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: arrayBufferToBase64(audioBuffer),
            },
          },
          {
            text: `This is a recitation of a Quranic phrase. Transcribe it and identify the Surah number and Ayah number.
            Return ONLY a JSON object with:
            - transcribedText (string)
            - surahNumber (number)
            - ayahNumber (number)
            - confidence (number 0-1)`
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async explainVerseSimple(verseText: string, language: string = 'bangla') {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain this verse in a very simple way for beginners in ${language}: "${verseText}"`,
    });
    return response.text || "";
  }
};
