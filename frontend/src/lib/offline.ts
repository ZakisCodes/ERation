// Offline storage and sync utilities
import { authAPI, rationAPI } from './api';

export interface OfflineTransaction {
  id: string;
  memberId: string;
  qrCode: string;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
}

export interface CachedUserData {
  user: any;
  familyMembers: any[];
  stocks: any[];
  quotas: any[];
  transactions: any[];
  lastUpdated: number;
}

class OfflineManager {
  private static instance: OfflineManager;
  private dbName = 'DigiRationOffline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('status', 'status', { unique: false });
          transactionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'type' });
        }

        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  // Store pending transaction offline
  async storePendingTransaction(transaction: Omit<OfflineTransaction, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<string> {
    if (!this.db) await this.init();

    const offlineTransaction: OfflineTransaction = {
      ...transaction,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      const request = store.add(offlineTransaction);

      request.onsuccess = () => resolve(offlineTransaction.id);
      request.onerror = () => reject(request.error);
    });
  }

  // Get pending transactions
  async getPendingTransactions(): Promise<OfflineTransaction[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const index = store.index('status');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Update transaction status
  async updateTransactionStatus(id: string, status: OfflineTransaction['status']): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const offlineTransaction = getRequest.result;
        if (offlineTransaction) {
          offlineTransaction.status = status;
          if (status === 'failed') {
            offlineTransaction.retryCount += 1;
          }
          
          const putRequest = store.put(offlineTransaction);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Cache user data
  async cacheUserData(data: Partial<CachedUserData>): Promise<void> {
    if (!this.db) await this.init();

    const cacheData = {
      ...data,
      lastUpdated: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put({ key: 'userData', ...cacheData });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached user data
  async getCachedUserData(): Promise<CachedUserData | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get('userData');

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          delete result.key;
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Check if data is stale (older than 1 hour)
  isDataStale(lastUpdated: number): boolean {
    return Date.now() - lastUpdated > 60 * 60 * 1000; // 1 hour
  }

  // Sync pending transactions when online
  async syncPendingTransactions(): Promise<void> {
    const pendingTransactions = await this.getPendingTransactions();
    
    for (const transaction of pendingTransactions) {
      try {
        await rationAPI.initiateTransaction(transaction.memberId, transaction.qrCode);
        await this.updateTransactionStatus(transaction.id, 'synced');
        console.log('Transaction synced:', transaction.id);
      } catch (error) {
        console.error('Failed to sync transaction:', transaction.id, error);
        await this.updateTransactionStatus(transaction.id, 'failed');
      }
    }
  }

  // Check online status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Listen for online/offline events
  setupOnlineListener(onOnline: () => void, onOffline: () => void): void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
  }

  // Cleanup old data
  async cleanupOldData(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      const index = store.index('timestamp');
      const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
      const range = IDBKeyRange.upperBound(cutoffTime);
      const cursorRequest = index.openCursor(range);

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };
      cursorRequest.onerror = () => reject(cursorRequest.error);
    });
  }
}

export const offlineManager = OfflineManager.getInstance();
