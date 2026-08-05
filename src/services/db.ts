// Universal Browser Database Service (IndexedDB + LocalStorage Fallback)
// Works seamlessly on Vercel, Netlify, Cloudflare Pages, GitHub Pages, Firebase, Render, etc.

import type { Review, UserReview, DiaryEntry, UserList, UserProfile } from "../types";
import { REVIEWS as SAMPLE_REVIEWS, SAMPLE_USER_REVIEWS } from "../data/reviews";

const DB_NAME = "PopCriticDB";
const DB_VERSION = 1;

class DatabaseService {
  private db: IDBDatabase | null = null;
  private isSupported = typeof window !== "undefined" && "indexedDB" in window;

  public async init(): Promise<void> {
    if (!this.isSupported) return;

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains("reviews")) {
            const reviewStore = db.createObjectStore("reviews", { keyPath: "id" });
            reviewStore.createIndex("category", "category", { unique: false });
          }

          if (!db.objectStoreNames.contains("userReviews")) {
            const urStore = db.createObjectStore("userReviews", { keyPath: "id" });
            urStore.createIndex("reviewId", "reviewId", { unique: false });
          }

          if (!db.objectStoreNames.contains("diary")) {
            const diaryStore = db.createObjectStore("diary", { keyPath: "id" });
            diaryStore.createIndex("reviewId", "reviewId", { unique: false });
          }

          if (!db.objectStoreNames.contains("lists")) {
            db.createObjectStore("lists", { keyPath: "id" });
          }

          if (!db.objectStoreNames.contains("users")) {
            db.createObjectStore("users", { keyPath: "email" });
          }

          if (!db.objectStoreNames.contains("userState")) {
            db.createObjectStore("userState", { keyPath: "key" });
          }
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.seedInitialData().then(() => resolve());
        };

        request.onerror = () => {
          // Fallback to localStorage if IndexedDB is blocked
          resolve();
        };
      } catch {
        resolve();
      }
    });
  }

  private async seedInitialData(): Promise<void> {
    const existingReviews = await this.getAll<Review>("reviews");
    if (existingReviews.length === 0) {
      for (const review of SAMPLE_REVIEWS) {
        await this.put("reviews", review);
      }
    }

    const isUserReviewsSeeded = await this.getUserState<boolean>("user_reviews_seeded", false);
    if (!isUserReviewsSeeded) {
      for (const ur of SAMPLE_USER_REVIEWS) {
        await this.put("userReviews", ur);
      }
      await this.setUserState("user_reviews_seeded", true);
    }
  }

  // Generic IndexedDB Helpers
  private getStore(name: string, mode: IDBTransactionMode = "readonly"): IDBObjectStore | null {
    if (!this.db) return null;
    try {
      const tx = this.db.transaction(name, mode);
      return tx.objectStore(name);
    } catch {
      return null;
    }
  }

  private async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName, "readonly");
      if (!store) {
        // Fallback to localStorage
        const stored = localStorage.getItem(`popcritic-db:${storeName}`);
        resolve(stored ? JSON.parse(stored) : []);
        return;
      }

      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  private async put<T>(storeName: string, value: T): Promise<boolean> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName, "readwrite");
      if (!store) {
        // Fallback to localStorage
        const items = JSON.parse(localStorage.getItem(`popcritic-db:${storeName}`) || "[]");
        const keyPath = storeName === "users" ? "email" : "id";
        const keyVal = (value as Record<string, unknown>)[keyPath];
        const idx = items.findIndex((i: Record<string, unknown>) => i[keyPath] === keyVal);
        if (idx >= 0) items[idx] = value;
        else items.push(value);
        localStorage.setItem(`popcritic-db:${storeName}`, JSON.stringify(items));
        resolve(true);
        return;
      }

      const request = store.put(value);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  private async delete(storeName: string, key: number | string): Promise<boolean> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName, "readwrite");
      if (!store) {
        const items = JSON.parse(localStorage.getItem(`popcritic-db:${storeName}`) || "[]");
        const keyPath = storeName === "users" ? "email" : "id";
        const filtered = items.filter((i: Record<string, unknown>) => i[keyPath] !== key);
        localStorage.setItem(`popcritic-db:${storeName}`, JSON.stringify(filtered));
        resolve(true);
        return;
      }

      const request = store.delete(key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  // Public API methods for the site
  public async getReviews(): Promise<Review[]> {
    const reviews = await this.getAll<Review>("reviews");
    return reviews.length > 0 ? reviews : SAMPLE_REVIEWS;
  }

  public async getUserReviews(): Promise<UserReview[]> {
    return this.getAll<UserReview>("userReviews");
  }

  public async addUserReview(review: UserReview): Promise<void> {
    await this.put("userReviews", review);
  }

  public async deleteUserReview(id: number): Promise<void> {
    await this.delete("userReviews", id);
  }

  public async getDiary(): Promise<DiaryEntry[]> {
    return this.getAll<DiaryEntry>("diary");
  }

  public async saveDiaryEntry(entry: DiaryEntry): Promise<void> {
    await this.put("diary", entry);
  }

  public async deleteDiaryEntry(id: number): Promise<void> {
    await this.delete("diary", id);
  }

  public async getLists(): Promise<UserList[]> {
    return this.getAll<UserList>("lists");
  }

  public async saveList(list: UserList): Promise<void> {
    await this.put("lists", list);
  }

  public async deleteList(id: string): Promise<void> {
    await this.delete("lists", id);
  }

  public async getUserState<T>(key: string, defaultValue: T): Promise<T> {
    return new Promise((resolve) => {
      const store = this.getStore("userState", "readonly");
      if (!store) {
        const local = localStorage.getItem(`popcritic-${key}`);
        resolve(local ? JSON.parse(local) : defaultValue);
        return;
      }

      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result && request.result.val !== undefined) {
          resolve(request.result.val as T);
        } else {
          // Migration from localStorage if missing in DB
          const local = localStorage.getItem(`popcritic-${key}`);
          resolve(local ? JSON.parse(local) : defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  }

  public async setUserState<T>(key: string, val: T): Promise<void> {
    // Write to DB
    await this.put("userState", { key, val });
    // Mirror to localStorage for extra redundancy
    localStorage.setItem(`popcritic-${key}`, JSON.stringify(val));
  }

  public async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.put("users", profile);
  }

  public async getUserProfile(email: string): Promise<UserProfile | null> {
    return new Promise((resolve) => {
      const store = this.getStore("users", "readonly");
      if (!store) {
        const stored = localStorage.getItem(`popcritic-profile:${email.toLowerCase()}`);
        resolve(stored ? JSON.parse(stored) : null);
        return;
      }

      const request = store.get(email.toLowerCase());
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }
}

export const dbService = new DatabaseService();
