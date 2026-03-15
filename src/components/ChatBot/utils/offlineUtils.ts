/**
 * Offline Support Utilities for ChatBot
 * Handles message queuing, local storage, and sync mechanisms
 */

import { ChatMessage, ChatContext } from '../types';
import { SupportedLanguage, getUserPreferredLanguage } from './languageUtils';

// Storage Keys
const OFFLINE_MESSAGES_KEY = 'foodmarket_chatbot_offline_messages';
const OFFLINE_CONTEXT_KEY = 'foodmarket_chatbot_offline_context';
const SYNC_TIMESTAMP_KEY = 'foodmarket_chatbot_last_sync';

// Offline Message Interface
export interface OfflineMessage extends ChatMessage {
  queuedAt: Date;
  syncAttempts: number;
  priority: 'high' | 'normal' | 'low';
}

// Sync Status
export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingMessages: number;
  failedMessages: number;
  isSyncing: boolean;
}

/**
 * Offline Message Queue Manager
 */
export class OfflineMessageQueue {
  private static instance: OfflineMessageQueue;
  private queue: OfflineMessage[] = [];
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private isSyncing = false;

  private constructor() {
    this.loadQueue();
    this.setupNetworkListeners();
  }

  static getInstance(): OfflineMessageQueue {
    if (!OfflineMessageQueue.instance) {
      OfflineMessageQueue.instance = new OfflineMessageQueue();
    }
    return OfflineMessageQueue.instance;
  }

  /**
   * Add message to offline queue
   */
  enqueue(message: ChatMessage, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    const offlineMessage: OfflineMessage = {
      ...message,
      queuedAt: new Date(),
      syncAttempts: 0,
      priority
    };

    // Add to queue based on priority
    if (priority === 'high') {
      this.queue.unshift(offlineMessage);
    } else {
      this.queue.push(offlineMessage);
    }

    this.saveQueue();
    this.notifyListeners();
  }

  /**
   * Remove message from queue
   */
  dequeue(messageId: string): OfflineMessage | null {
    const index = this.queue.findIndex(msg => msg.id === messageId);
    if (index === -1) return null;

    const message = this.queue.splice(index, 1)[0];
    this.saveQueue();
    this.notifyListeners();
    return message;
  }

  /**
   * Get all queued messages
   */
  getQueue(): OfflineMessage[] {
    return [...this.queue];
  }

  /**
   * Get queue status
   */
  getStatus(): SyncStatus {
    const lastSyncTime = this.getLastSyncTime();
    const failedMessages = this.queue.filter(msg => msg.syncAttempts > 0).length;

    return {
      isOnline: navigator.onLine,
      lastSyncTime,
      pendingMessages: this.queue.length,
      failedMessages,
      isSyncing: this.isSyncing
    };
  }

  /**
   * Clear all queued messages
   */
  clear(): void {
    this.queue = [];
    this.saveQueue();
    this.notifyListeners();
  }

  /**
   * Sync queued messages when online
   */
  async sync(sendMessageFn: (message: string, context?: ChatContext) => Promise<any>): Promise<void> {
    if (!navigator.onLine || this.isSyncing || this.queue.length === 0) {
      return;
    }

    this.isSyncing = true;
    this.notifyListeners();

    const messagesToSync = [...this.queue];
    const successfulSyncs: string[] = [];
    const failedSyncs: string[] = [];

    // Sort by priority and timestamp
    messagesToSync.sort((a, b) => {
      // High priority first
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      
      // Then by timestamp (oldest first)
      return a.queuedAt.getTime() - b.queuedAt.getTime();
    });

    for (const message of messagesToSync) {
      try {
        // Check if still online before each attempt
        if (!navigator.onLine) {
          console.log('Lost connection during sync, stopping');
          break;
        }

        // Attempt to send the message with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Sync timeout')), 10000); // 10 second timeout
        });

        await Promise.race([
          sendMessageFn(message.content),
          timeoutPromise
        ]);

        successfulSyncs.push(message.id);
        
        // Remove from queue on success
        this.dequeue(message.id);
        
        // Small delay between messages to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Failed to sync message ${message.id}:`, error);
        failedSyncs.push(message.id);
        
        // Increment sync attempts
        const messageIndex = this.queue.findIndex(msg => msg.id === message.id);
        if (messageIndex !== -1) {
          this.queue[messageIndex].syncAttempts++;
          
          // Remove messages that have failed too many times (after 3 attempts)
          if (this.queue[messageIndex].syncAttempts >= 3) {
            console.warn(`Removing message ${message.id} after 3 failed sync attempts`);
            this.dequeue(message.id);
          }
        }

        // If we get auth errors, stop syncing (user needs to re-authenticate)
        if (error.status === 401 || error.status === 403) {
          console.log('Authentication error during sync, stopping');
          break;
        }
      }
    }

    // Update last sync time
    this.setLastSyncTime(new Date());
    this.saveQueue();
    
    this.isSyncing = false;
    this.notifyListeners();

    console.log(`Sync completed: ${successfulSyncs.length} successful, ${failedSyncs.length} failed`);

    // Show notification if messages were synced successfully
    if (successfulSyncs.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('ChatBot Messages Synced', {
          body: `${successfulSyncs.length} offline messages have been synchronized.`,
          icon: '/logo.png',
          tag: 'chatbot-sync'
        });
      } catch (error) {
        console.warn('Failed to show sync notification:', error);
      }
    }
  }

  /**
   * Add sync status listener
   */
  addSyncListener(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) {
        this.syncListeners.splice(index, 1);
      }
    };
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(OFFLINE_MESSAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.queue = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          queuedAt: new Date(msg.queuedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load offline message queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(OFFLINE_MESSAGES_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline message queue:', error);
    }
  }

  /**
   * Setup network event listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('Network connection restored');
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      console.log('Network connection lost');
      this.notifyListeners();
    });
  }

  /**
   * Notify all listeners of status changes
   */
  private notifyListeners(): void {
    const status = this.getStatus();
    this.syncListeners.forEach(listener => listener(status));
  }

  /**
   * Get last sync timestamp
   */
  private getLastSyncTime(): Date | null {
    try {
      const timestamp = localStorage.getItem(SYNC_TIMESTAMP_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set last sync timestamp
   */
  private setLastSyncTime(time: Date): void {
    try {
      localStorage.setItem(SYNC_TIMESTAMP_KEY, time.toISOString());
    } catch (error) {
      console.error('Failed to save sync timestamp:', error);
    }
  }
}

/**
 * Offline Context Manager
 */
export class OfflineContextManager {
  private static instance: OfflineContextManager;
  private context: ChatContext | null = null;

  private constructor() {
    this.loadContext();
  }

  static getInstance(): OfflineContextManager {
    if (!OfflineContextManager.instance) {
      OfflineContextManager.instance = new OfflineContextManager();
    }
    return OfflineContextManager.instance;
  }

  /**
   * Save chat context for offline use
   */
  saveContext(context: ChatContext): void {
    this.context = context;
    try {
      localStorage.setItem(OFFLINE_CONTEXT_KEY, JSON.stringify(context));
    } catch (error) {
      console.error('Failed to save offline context:', error);
    }
  }

  /**
   * Get saved context
   */
  getContext(): ChatContext | null {
    return this.context;
  }

  /**
   * Clear saved context
   */
  clearContext(): void {
    this.context = null;
    try {
      localStorage.removeItem(OFFLINE_CONTEXT_KEY);
    } catch (error) {
      console.error('Failed to clear offline context:', error);
    }
  }

  /**
   * Load context from localStorage
   */
  private loadContext(): void {
    try {
      const stored = localStorage.getItem(OFFLINE_CONTEXT_KEY);
      if (stored) {
        this.context = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline context:', error);
      this.context = null;
    }
  }
}

/**
 * Generate offline response for user feedback
 */
export function generateOfflineResponse(language: SupportedLanguage = 'vi'): ChatMessage {
  const responses = {
    en: {
      message: "I'm currently offline, but I've saved your message. I'll respond as soon as the connection is restored.",
      suggestions: [
        "Check connection status",
        "View offline help",
        "Try again later"
      ]
    },
    vi: {
      message: "Tôi hiện đang offline, nhưng đã lưu tin nhắn của bạn. Tôi sẽ trả lời ngay khi kết nối được khôi phục.",
      suggestions: [
        "Kiểm tra trạng thái kết nối",
        "Xem trợ giúp offline",
        "Thử lại sau"
      ]
    }
  };

  const response = responses[language];

  return {
    id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content: response.message,
    sender: 'ai',
    timestamp: new Date(),
    type: 'system',
    status: 'delivered',
    metadata: {
      actionType: 'offline_response',
      suggestions: response.suggestions
    }
  };
}

/**
 * Check if device has sufficient storage for offline functionality
 */
export async function checkStorageQuota(): Promise<{
  available: boolean;
  usage: number;
  quota: number;
  percentage: number;
  warning?: string;
}> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;
      
      let warning: string | undefined;
      if (percentage > 90) {
        warning = 'Storage is almost full. Offline functionality may be limited.';
      } else if (percentage > 75) {
        warning = 'Storage usage is high. Consider clearing old data.';
      }
      
      return {
        available: percentage < 95, // Consider available if less than 95% used
        usage,
        quota,
        percentage,
        warning
      };
    }
  } catch (error) {
    console.error('Failed to check storage quota:', error);
  }

  // Fallback for browsers that don't support storage estimation
  return {
    available: true,
    usage: 0,
    quota: 0,
    percentage: 0
  };
}

/**
 * Clean up old offline data to free storage space
 */
export function cleanupOfflineData(maxAge: number = 7 * 24 * 60 * 60 * 1000): {
  messagesRemoved: number;
  storageFreed: boolean;
} {
  let messagesRemoved = 0;
  let storageFreed = false;

  try {
    const queue = OfflineMessageQueue.getInstance();
    const messages = queue.getQueue();
    const cutoffTime = new Date(Date.now() - maxAge);
    
    // Remove messages older than maxAge
    const messagesToRemove = messages.filter(msg => msg.queuedAt < cutoffTime);
    messagesToRemove.forEach(msg => {
      queue.dequeue(msg.id);
      messagesRemoved++;
    });
    
    // Also clean up failed messages that have exceeded retry attempts
    const failedMessages = messages.filter(msg => msg.syncAttempts >= 3);
    failedMessages.forEach(msg => {
      if (!messagesToRemove.find(m => m.id === msg.id)) {
        queue.dequeue(msg.id);
        messagesRemoved++;
      }
    });

    // Clear old localStorage entries
    try {
      const keysToCheck = Object.keys(localStorage);
      const chatbotKeys = keysToCheck.filter(key => 
        key.startsWith('foodmarket_chatbot_') && 
        !key.includes('offline_messages') && 
        !key.includes('offline_context') &&
        !key.includes('last_sync')
      );

      // Remove old temporary keys
      chatbotKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (parsed.timestamp && new Date(parsed.timestamp) < cutoffTime) {
              localStorage.removeItem(key);
              storageFreed = true;
            }
          }
        } catch (e) {
          // If we can't parse it, it might be corrupted, remove it
          localStorage.removeItem(key);
          storageFreed = true;
        }
      });
    } catch (error) {
      console.warn('Failed to clean localStorage:', error);
    }
    
    console.log(`Cleaned up ${messagesRemoved} old offline messages, storage freed: ${storageFreed}`);
  } catch (error) {
    console.error('Failed to cleanup offline data:', error);
  }

  return { messagesRemoved, storageFreed };
}

/**
 * Get offline capabilities status
 */
export function getOfflineCapabilities(): {
  storageAvailable: boolean;
  serviceWorkerSupported: boolean;
  networkStatusSupported: boolean;
  estimatedStorageSupported: boolean;
} {
  return {
    storageAvailable: typeof Storage !== 'undefined',
    serviceWorkerSupported: 'serviceWorker' in navigator,
    networkStatusSupported: 'onLine' in navigator,
    estimatedStorageSupported: 'storage' in navigator && 'estimate' in navigator.storage
  };
}

/**
 * Export utilities for easy access
 */
export const offlineUtils = {
  messageQueue: OfflineMessageQueue.getInstance(),
  contextManager: OfflineContextManager.getInstance(),
  generateOfflineResponse,
  checkStorageQuota,
  cleanupOfflineData,
  getOfflineCapabilities
};

export default offlineUtils;