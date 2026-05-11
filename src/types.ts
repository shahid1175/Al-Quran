/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  points: number;
  level: number;
  badges: string[];
  settings: {
    font: 'asia-noorani' | 'madani';
    showTranslation: boolean;
    tafsirLanguage: 'bangla' | 'english';
    reminderEnabled: boolean;
    reminderTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id?: string;
  userId: string;
  type: 'quran' | 'tajweed';
  surahId?: number;
  ayahId?: number;
  lessonId?: string;
  completed: boolean;
  score: number;
  timestamp: Date;
}

export interface Bookmark {
  id?: string;
  userId: string;
  surahId: number;
  ayahId: number;
  note?: string;
  createdAt: Date;
}

export interface Hadith {
  id: string;
  book: string;
  hadithNumber: string;
  text: string;
  textBn?: string;
  textAr?: string;
  reference: string;
}

export interface FavoriteHadith {
  id?: string;
  userId: string;
  hadithId: string;
  book: string;
  text: string;
  textBn?: string;
  textAr?: string;
  hadithNumber: string;
  reference: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  points: number;
  updatedAt: Date;
}

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export type AyahWord = {
  id: number;
  position: number;
  text: string;
  translationBn: string;
  translationEn: string;
};

export type Ayah = {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  tajweed?: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  words?: AyahWord[];
};

export type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};
