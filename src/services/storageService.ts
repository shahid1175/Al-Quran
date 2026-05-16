import { openDB, IDBPDatabase } from 'idb';
import { Ayah } from '../types';

const DB_NAME = 'QuranOfflineDB';
const DB_VERSION = 2;
const STORE_NAME = 'surahs';
const BOOKS_STORE = 'offline_books';

export interface OfflineSurah {
  id: number;
  ayahs: Ayah[];
  translations?: any[];
  translationsEn?: any[];
  words?: Record<number, any[]>;
  downloadedAt: number;
  audioBlobs?: { [ayahNumber: number]: Blob };
}

export interface OfflineBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  relevance: string;
  details?: any;
  downloadedAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(BOOKS_STORE)) {
          db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export const storageService = {
  // Surah methods...
  async saveSurah(
    id: number, 
    ayahs: Ayah[], 
    translations?: any[], 
    translationsEn?: any[],
    words?: Record<number, any[]>,
    audioBlobs?: { [ayahNumber: number]: Blob }
  ) {
    const db = await getDB();
    const offlineSurah: OfflineSurah = {
      id,
      ayahs,
      translations,
      translationsEn,
      words,
      downloadedAt: Date.now(),
      audioBlobs
    };
    await db.put(STORE_NAME, offlineSurah);
  },

  async getSurah(id: number): Promise<OfflineSurah | undefined> {
    if (isNaN(id)) return undefined;
    const db = await getDB();
    return db.get(STORE_NAME, id);
  },

  async isDownloaded(id: number): Promise<boolean> {
    if (isNaN(id)) return false;
    const db = await getDB();
    const count = await db.count(STORE_NAME, id);
    return count > 0;
  },

  async deleteSurah(id: number) {
    if (isNaN(id)) return;
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
  },

  // Book methods
  async saveOfflineBook(book: OfflineBook) {
    const db = await getDB();
    await db.put(BOOKS_STORE, book);
  },

  async getOfflineBook(id: string): Promise<OfflineBook | undefined> {
    if (!id) return undefined;
    const db = await getDB();
    return db.get(BOOKS_STORE, id);
  },

  async getAllOfflineBooks(): Promise<OfflineBook[]> {
    const db = await getDB();
    try {
      return await db.getAll(BOOKS_STORE);
    } catch (e) {
      console.error("Failed to get all offline books:", e);
      return [];
    }
  },

  async deleteOfflineBook(id: string) {
    if (!id) return;
    const db = await getDB();
    await db.delete(BOOKS_STORE, id);
  },

  async isBookDownloaded(id: string): Promise<boolean> {
    if (!id) return false;
    const db = await getDB();
    const count = await db.count(BOOKS_STORE, id);
    return count > 0;
  }
};
