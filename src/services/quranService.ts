import axios from 'axios';
import { Surah, Ayah } from '../types';
import { storageService } from './storageService';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranService = {
  async getDailyAyah(): Promise<{ ayah: Ayah; translation: string; surahName: string }> {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0;
    }
    
    // Pick a surah (1-114) and ayah based on hash
    const surahId = (Math.abs(hash) % 114) + 1;
    const ayahs = await this.getSurah(surahId);
    const ayahId = Math.abs(hash * 31) % ayahs.length;
    const ayah = ayahs[ayahId];
    
    const translations = await this.getTranslation(surahId, 'bn');
    const translation = translations.length > ayahId ? translations[ayahId].text : "Translation not available";
    
    // Get Surah list for name
    const surahs = await this.getSurahs();
    const surahName = surahs.find(s => s.number === surahId)?.englishName || 'Unknown Surah';
    
    return { ayah, translation, surahName };
  },

  async getSurahs(): Promise<Surah[]> {
    try {
      const response = await axios.get(`${BASE_URL}/surah`);
      const data = response.data.data;
      await storageService.saveSurahList(data);
      return data;
    } catch (error) {
      console.warn('Network failed, checking local Surah list');
      const localData = await storageService.getSurahList();
      if (localData) return localData;
      throw error;
    }
  },

  async getSurah(id: number, reciterIdentifier: string = 'ar.alafasy', edition: 'madani' | 'asia-noorani' = 'madani'): Promise<Ayah[]> {
    // Check local storage first (only if it matches default reciter/edition)
    const offlineData = await storageService.getSurah(id);
    if (offlineData && reciterIdentifier === 'ar.alafasy' && edition === 'madani') {
      console.log(`Using offline data for Surah ${id}`);
      return offlineData.ayahs;
    }

    const textEditionId = edition === 'madani' ? 'quran-uthmani' : 'ar.indopak';
    
    // Fetch specified text, Specified audio, and Tajweed text
    // Note: ar.tajweed is Uthmani based, but we'll try to map it or provide it separately
    const response = await axios.get(`${BASE_URL}/surah/${id}/editions/${textEditionId},${reciterIdentifier},ar.tajweed`);
    const [textEdition, audioEdition, tajweedEdition] = response.data.data;
    
    return textEdition.ayahs.map((ayah: any, index: number) => ({
      ...ayah,
      audio: audioEdition.ayahs[index].audio,
      tajweed: tajweedEdition.ayahs[index].text
    }));
  },

  async downloadSurah(id: number): Promise<void> {
    const [ayahs, translationsBn, translationsEn, words] = await Promise.all([
      this.getSurah(id),
      this.getTranslation(id, 'bn'),
      this.getTranslation(id, 'en'),
      this.getWords(id)
    ]);
    await storageService.saveSurah(id, ayahs, translationsBn, translationsEn, words);
  },

  async isDownloaded(id: number): Promise<boolean> {
    return storageService.isDownloaded(id);
  },

  async getTranslation(surahId: number, language: 'bn' | 'en' = 'bn'): Promise<any[]> {
    try {
      // Check local storage first
      const offlineData = await storageService.getSurah(surahId);
      if (language === 'bn' && offlineData?.translations) {
        return offlineData.translations;
      }
      if (language === 'en' && offlineData?.translationsEn) {
        return offlineData.translationsEn;
      }
      const edition = language === 'bn' ? 'bn.bengali' : 'en.sahih';
      const response = await axios.get(`${BASE_URL}/surah/${surahId}/${edition}`);
      return response.data.data.ayahs || [];
    } catch (error) {
      console.error(`Failed to fetch ${language} translation:`, error);
      return [];
    }
  },

  async getWords(surahId: number, edition: 'madani' | 'asia-noorani' = 'madani'): Promise<Record<number, any[]>> {
    try {
      // Check local storage first (only if default font)
      const offlineData = await storageService.getSurah(surahId);
      if (offlineData?.words && edition === 'madani') {
        return offlineData.words;
      }
      const textField = edition === 'madani' ? 'text_uthmani' : 'text_indopak';
      const [bnResponse, enResponse] = await Promise.all([
        axios.get(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?words=true&word_fields=${textField}&word_translation_language=20&language=bn`),
        axios.get(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?words=true&word_fields=${textField}&word_translation_language=en`)
      ]);
      
      const bnVerses = bnResponse.data.verses;
      const enVerses = enResponse.data.verses;
      const wordsMap: Record<number, any[]> = {};
      
      bnVerses.forEach((verse: any, index: number) => {
        const enVerse = enVerses[index];
        wordsMap[verse.verse_number] = verse.words.map((w: any, wIdx: number) => ({
          id: w.id,
          position: w.position,
          text: w[textField],
          translationBn: w.translation?.text || '...',
          translationEn: enVerse?.words[wIdx]?.translation?.text || '...'
        }));
      });
      
      return wordsMap;
    } catch (error) {
      console.error('Failed to fetch words:', error);
      return {};
    }
  },

  async getTafsir(surahId: number, ayahNumberInSurah: number, language: 'bn' | 'en' = 'bn'): Promise<string> {
    try {
      // 161: Tafhim-ul-Quran (Bangla)
      // 169: Tafsir Ibn Kathir (English)
      const resourceId = language === 'bn' ? 161 : 169;
      const response = await axios.get(`https://api.quran.com/api/v4/tafsirs/${resourceId}/by_ayah/${surahId}:${ayahNumberInSurah}`);
      return response.data.tafsir.text;
    } catch (error) {
      console.warn('Tafsir API failed, falling back to basic explanation');
      return language === 'bn' ? "এই আয়াতের তাফসীর লোড হচ্ছে..." : "Loading explanation for this verse...";
    }
  }
};
