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
import { Bookmark, OperationType } from '../types';
import { auth } from '../lib/firebase';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const bookmarkService = {
  async saveBookmark(userId: string, surahId: number, ayahId: number, note?: string) {
    const path = `users/${userId}/bookmarks`;
    try {
      const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
      const bookmark: Omit<Bookmark, 'id'> = {
        userId,
        surahId,
        ayahId,
        note,
        createdAt: new Date(),
      };

      return await addDoc(bookmarksRef, {
        ...bookmark,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const path = `users/${userId}/bookmarks`;
    try {
      const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
      const q = query(bookmarksRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bookmark));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  async deleteBookmark(userId: string, bookmarkId: string) {
    const path = `users/${userId}/bookmarks/${bookmarkId}`;
    try {
      const bookmarkDoc = doc(db, 'users', userId, 'bookmarks', bookmarkId);
      await deleteDoc(bookmarkDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
