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
import { IslamicBook } from './aiService';

export interface GlobalBook extends IslamicBook {
  id?: string;
  content?: string;
  fileName: string;
  fileType: string;
  uploadedAt: any;
  addedBy: string;
}

const COLLECTION_NAME = 'globalBooks';

export const adminBookService = {
  async uploadGlobalBook(book: Omit<GlobalBook, 'uploadedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...book,
        uploadedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error uploading global book:", error);
      throw error;
    }
  },

  async getGlobalBooks(): Promise<GlobalBook[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GlobalBook[];
    } catch (error) {
      console.error("Error fetching global books:", error);
      return [];
    }
  },

  async deleteGlobalBook(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting global book:", error);
      throw error;
    }
  }
};
