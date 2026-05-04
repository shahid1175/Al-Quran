import axios from 'axios';
import { Hadith, FavoriteHadith } from '../types';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

export const EDITIONS = [
  { slug: 'eng-bukhari', name: 'Sahih Bukhari' },
  { slug: 'eng-muslim', name: 'Sahih Muslim' },
  { slug: 'eng-abudawud', name: 'Sunan Abu Dawud' },
  { slug: 'eng-tirmidhi', name: 'Sunan At-Tirmidhi' },
  { slug: 'eng-nasai', name: 'Sunan An-Nasa\'i' },
  { slug: 'eng-ibnmajah', name: 'Sunan Ibn Majah' }
];

export const hadithService = {
  async getDailyHadith(): Promise<Hadith> {
    try {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      
      // Simple hash to get a deterministic index for the day
      let hash = 0;
      for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0;
      }
      
      const editionIndex = Math.abs(hash) % EDITIONS.length;
      const randomEdition = EDITIONS[editionIndex];
      const hadithId = (Math.abs(hash * 31) % 200) + 1; // Pick from first 200 hadiths
      
      const [engRes, benRes, araRes] = await Promise.all([
        axios.get(`${BASE_URL}/${randomEdition.slug}/${hadithId}.json`),
        axios.get(`${BASE_URL}/${randomEdition.slug.replace('eng-', 'ben-')}/${hadithId}.json`).catch(() => null),
        axios.get(`${BASE_URL}/${randomEdition.slug.replace('eng-', 'ara-')}/${hadithId}.json`).catch(() => null)
      ]);

      const engData = engRes.data.hadiths[0];
      const benData = benRes?.data?.hadiths?.[0];
      const araData = araRes?.data?.hadiths?.[0];
      
      return {
        id: `${randomEdition.slug}-${hadithId}`,
        book: randomEdition.name,
        hadithNumber: String(engData.hadithnumber),
        text: engData.text || benData?.text || araData?.text || '',
        textBn: benData?.text || undefined,
        textAr: araData?.text || undefined,
        reference: `${randomEdition.name} ${engData.hadithnumber}`
      };
    } catch (error) {
      console.error('getDailyHadith failed, using fallback:', error);
      return this.getRandomHadith();
    }
  },

  async getRandomHadith(): Promise<Hadith> {
    try {
      const randomEdition = EDITIONS[Math.floor(Math.random() * EDITIONS.length)];
      // Using a small range to ensure the hadith exists across all books
      const randomId = Math.floor(Math.random() * 100) + 1; 
      
      const [engRes, benRes, araRes] = await Promise.all([
        axios.get(`${BASE_URL}/${randomEdition.slug}/${randomId}.json`),
        axios.get(`${BASE_URL}/${randomEdition.slug.replace('eng-', 'ben-')}/${randomId}.json`).catch(() => null),
        axios.get(`${BASE_URL}/${randomEdition.slug.replace('eng-', 'ara-')}/${randomId}.json`).catch(() => null)
      ]);

      const engData = engRes.data.hadiths[0];
      const benData = benRes?.data?.hadiths?.[0];
      const araData = araRes?.data?.hadiths?.[0];
      
      const hadith: Hadith = {
        id: `${randomEdition.slug}-${randomId}`,
        book: randomEdition.name,
        hadithNumber: String(engData.hadithnumber),
        text: engData.text || benData?.text || araData?.text || '',
        textBn: benData?.text || undefined,
        textAr: araData?.text || undefined,
        reference: `${randomEdition.name} ${engData.hadithnumber}`
      };

      return hadith;
    } catch (error) {
      console.error('Hadith API failed, using fallback:', error);
      return {
        id: 'fallback',
        book: 'Sahih Bukhari',
        hadithNumber: '1',
        text: 'Actions are but by intentions and every man shall have only that which he intended.',
        reference: 'Sahih Bukhari 1'
      };
    }
  },

  async getHadith(editionSlug: string, hadithNumber: number): Promise<Hadith | null> {
    try {
      const [engRes, benRes, araRes] = await Promise.all([
        axios.get(`${BASE_URL}/${editionSlug}/${hadithNumber}.json`),
        axios.get(`${BASE_URL}/${editionSlug.replace('eng-', 'ben-')}/${hadithNumber}.json`).catch(() => null),
        axios.get(`${BASE_URL}/${editionSlug.replace('eng-', 'ara-')}/${hadithNumber}.json`).catch(() => null)
      ]);

      const engData = engRes.data.hadiths[0];
      const benData = benRes?.data?.hadiths?.[0];
      const araData = araRes?.data?.hadiths?.[0];
      const edition = EDITIONS.find(e => e.slug === editionSlug);
      
      const hadith: Hadith = {
        id: `${editionSlug}-${hadithNumber}`,
        book: edition?.name || editionSlug,
        hadithNumber: String(engData.hadithnumber),
        text: engData.text || benData?.text || araData?.text || '',
        textBn: benData?.text || undefined,
        textAr: araData?.text || undefined,
        reference: `${edition?.name || editionSlug} ${engData.hadithnumber}`
      };

      return hadith;
    } catch (error) {
      console.error('Failed to fetch hadith:', error);
      return null;
    }
  },

  async saveToFavorites(userId: string, hadith: Hadith) {
    const favoritesRef = collection(db, 'users', userId, 'favoriteHadiths');
    
    // Check if already exist to prevent duplicates
    const q = query(favoritesRef, where('hadithId', '==', hadith.id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return;

    return await addDoc(favoritesRef, {
      userId,
      hadithId: hadith.id,
      hadithNumber: hadith.hadithNumber,
      book: hadith.book,
      text: hadith.text,
      textBn: hadith.textBn || null,
      textAr: hadith.textAr || null,
      reference: hadith.reference,
      createdAt: serverTimestamp()
    });
  },

  async getFavorites(userId: string): Promise<FavoriteHadith[]> {
    const favoritesRef = collection(db, 'users', userId, 'favoriteHadiths');
    const q = query(favoritesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FavoriteHadith));
  },

  async removeFavorite(userId: string, favoriteId: string) {
    const favoriteDoc = doc(db, 'users', userId, 'favoriteHadiths', favoriteId);
    await deleteDoc(favoriteDoc);
  }
};
