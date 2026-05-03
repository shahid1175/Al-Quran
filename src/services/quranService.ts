import axios from 'axios';
import { Surah, Ayah } from '../types';
import { storageService } from './storageService';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranService = {
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

  async getSurah(id: number): Promise<Ayah[]> {
    // Check local storage first
    const offlineData = await storageService.getSurah(id);
    if (offlineData) {
      console.log(`Using offline data for Surah ${id}`);
      return offlineData.ayahs;
    }

    // Fetch Uthmani text, Aafasy audio, and Tajweed text
    const response = await axios.get(`${BASE_URL}/surah/${id}/editions/quran-uthmani,ar.alafasy,ar.tajweed`);
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
      this.getTranslation(1, id)
    ]);
    await storageService.saveSurah(id, ayahs, translations);
  },

  async isDownloaded(id: number): Promise<boolean> {
    return storageService.isDownloaded(id);
  },

  async getTranslation(id: number, surahId: number): Promise<any> {
    // Check local storage first
    const offlineData = await storageService.getSurah(surahId);
    if (offlineData?.translations) {
      return offlineData.translations;
    }
    const response = await axios.get(`${BASE_URL}/surah/${surahId}/bn.bengali`);
    return response.data.data.ayahs;
  },

  async getTafsir(surahId: number, ayahNumberInSurah: number): Promise<string> {
    try {
      // Fetching from Quran.com API which provides Tafhim-ul-Quran in Bangla (Resource 161)
      const response = await axios.get(`https://api.quran.com/api/v4/tafsirs/161/by_ayah/${surahId}:${ayahNumberInSurah}`);
      return response.data.tafsir.text;
    } catch (error) {
      console.warn('Tafhim API failed, falling back to basic explanation');
      return "Tafhim-ul-Quran context for this verse is being loaded...";
    }
  }
};
