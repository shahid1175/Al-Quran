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
    
    const translations = await this.getTranslation(surahId, 'en');
    const translation = translations[ayahId].text;
    
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

  async getSurah(id: number, reciterIdentifier: string = 'ar.alafasy'): Promise<Ayah[]> {
    // Check local storage first (only if it matches default reciter or we might need separate storage)
    const offlineData = await storageService.getSurah(id);
    if (offlineData && reciterIdentifier === 'ar.alafasy') {
      console.log(`Using offline data for Surah ${id}`);
      return offlineData.ayahs;
    }

    // Fetch Uthmani text, specified audio, and Tajweed text
    const response = await axios.get(`${BASE_URL}/surah/${id}/editions/quran-uthmani,${reciterIdentifier},ar.tajweed`);
    const [textEdition, audioEdition, tajweedEdition] = response.data.data;
    
    return textEdition.ayahs.map((ayah: any, index: number) => ({
      ...ayah,
      audio: audioEdition.ayahs[index].audio,
      tajweed: tajweedEdition.ayahs[index].text
    }));
  },

  async downloadSurah(id: number): Promise<void> {
    const [ayahs, translations] = await Promise.all([
      this.getSurah(id),
      this.getTranslation(id, 'bn')
    ]);
    await storageService.saveSurah(id, ayahs, translations);
  },

  async isDownloaded(id: number): Promise<boolean> {
    return storageService.isDownloaded(id);
  },

  async getTranslation(surahId: number, language: 'bn' | 'en' = 'bn'): Promise<any[]> {
    // Check local storage first
    const offlineData = await storageService.getSurah(surahId);
    if (offlineData?.translations && language === 'bn') {
      return offlineData.translations;
    }
    const edition = language === 'bn' ? 'bn.bengali' : 'en.sahih';
    const response = await axios.get(`${BASE_URL}/surah/${surahId}/${edition}`);
    return response.data.data.ayahs;
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
