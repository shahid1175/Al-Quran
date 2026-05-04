import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bookmark } from '../types';

export const bookmarkService = {
  async saveBookmark(userId: string, surahId: number, ayahId: number, note?: string) {
    const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
    const bookmark: Omit<Bookmark, 'id'> = {
      userId,
      surahId,
      ayahId,
      note,
      createdAt: new Date(), // Local for now, replaced by serverTimestamp below
    };

    return await addDoc(bookmarksRef, {
      ...bookmark,
      createdAt: serverTimestamp()
    });
  },

  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
    const q = query(bookmarksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Bookmark));
  },

  async deleteBookmark(userId: string, bookmarkId: string) {
    const bookmarkDoc = doc(db, 'users', userId, 'bookmarks', bookmarkId);
    await deleteDoc(bookmarkDoc);
  }
};
