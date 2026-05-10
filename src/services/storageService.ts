import { openDB, IDBPDatabase } from 'idb';
import { Ayah } from '../types';

const DB_NAME = 'QuranOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'surahs';

export interface OfflineSurah {
  id: number;
  ayahs: Ayah[];
  translations?: any[];
  downloadedAt: number;
  audioBlobs?: { [ayahNumber: number]: Blob };
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export const storageService = {
  async saveSurah(id: number, ayahs: Ayah[], translations?: any[], audioBlobs?: { [ayahNumber: number]: Blob }) {
    const db = await getDB();
    const offlineSurah: OfflineSurah = {
      id,
      ayahs,
      translations,
      downloadedAt: Date.now(),
      audioBlobs
    };
    await db.put(STORE_NAME, offlineSurah);
  },

  async getSurah(id: number): Promise<OfflineSurah | undefined> {
    const db = await getDB();
    return db.get(STORE_NAME, id);
  },

  async isDownloaded(id: number): Promise<boolean> {
    const db = await getDB();
    const count = await db.count(STORE_NAME, id);
    return count > 0;
  },

  async deleteSurah(id: number) {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  },

  async getAllDownloadedIds(): Promise<number[]> {
    const db = await getDB();
    const keys = await db.getAllKeys(STORE_NAME);
    return keys.filter(k => k !== 'surah_list') as number[];
  },

  async saveSurahList(surahs: any[]) {
    const db = await getDB();
    await db.put(STORE_NAME, { id: 'surah_list', data: surahs });
  },

  async getSurahList(): Promise<any[] | undefined> {
    const db = await getDB();
    const entry = await db.get(STORE_NAME, 'surah_list');
    return entry?.data;
  }
};
