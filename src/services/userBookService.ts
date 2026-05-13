import { openDB, IDBPDatabase } from 'idb';

export interface UserBook {
  id: string;
  title: string;
  author: string;
  fileName: string;
  fileType: string;
  content?: string;
  fileData?: Blob;
  uploadedAt: number;
}

const DB_NAME = 'maktabah-user-books';
const STORE_NAME = 'books';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export const userBookService = {
  async saveBook(book: UserBook): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, book);
  },

  async getAllBooks(): Promise<UserBook[]> {
    const db = await getDB();
    const books = await db.getAll(STORE_NAME);
    return books.sort((a, b) => b.uploadedAt - a.uploadedAt);
  },

  async getBook(id: string): Promise<UserBook | undefined> {
    const db = await getDB();
    return db.get(STORE_NAME, id);
  },

  async deleteBook(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  }
};
