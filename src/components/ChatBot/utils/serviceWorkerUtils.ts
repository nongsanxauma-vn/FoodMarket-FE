/**
 * Service Worker Utilities for ChatBot Offline Support
 * Handles service worker registration and background sync
 */

// Service Worker Registration
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/chatbot-sw.js', {
      scope: '/chatbot/'
    });

    console.log('ChatBot Service Worker registered:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is available
            console.log('New ChatBot Service Worker available');
            // Optionally notify user about update
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('ChatBot Service Worker registration failed:', error);
    return null;
  }
}

// Background Sync Support
export function requestBackgroundSync(tag: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      reject(new Error('Background Sync not supported'));
      return;
    }

    navigator.serviceWorker.ready.then(registration => {
      return registration.sync.register(tag);
    }).then(() => {
      console.log(`Background sync registered: ${tag}`);
      resolve();
    }).catch(error => {
      console.error(`Background sync registration failed: ${tag}`, error);
      reject(error);
    });
  });
}

// Check if background sync is supported
export function isBackgroundSyncSupported(): boolean {
  return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
}

// Notification Support for Offline Messages
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// Show notification for offline message sync
export function showOfflineSyncNotification(messageCount: number): void {
  if (Notification.permission === 'granted') {
    const notification = new Notification('ChatBot Messages Synced', {
      body: `${messageCount} offline messages have been synchronized.`,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'chatbot-sync',
      renotify: false
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
}

// Cache Management
export interface CacheInfo {
  name: string;
  size: number;
  lastModified: Date;
}

export async function getCacheInfo(): Promise<CacheInfo[]> {
  if (!('caches' in window)) {
    return [];
  }

  try {
    const cacheNames = await caches.keys();
    const cacheInfos: CacheInfo[] = [];

    for (const name of cacheNames) {
      if (name.includes('chatbot')) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        
        cacheInfos.push({
          name,
          size: keys.length,
          lastModified: new Date() // Approximation
        });
      }
    }

    return cacheInfos;
  } catch (error) {
    console.error('Failed to get cache info:', error);
    return [];
  }
}

// Clear chatbot caches
export async function clearChatBotCaches(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    const chatbotCaches = cacheNames.filter(name => name.includes('chatbot'));
    
    await Promise.all(
      chatbotCaches.map(name => caches.delete(name))
    );

    console.log(`Cleared ${chatbotCaches.length} ChatBot caches`);
  } catch (error) {
    console.error('Failed to clear ChatBot caches:', error);
  }
}

export const serviceWorkerUtils = {
  registerServiceWorker,
  requestBackgroundSync,
  isBackgroundSyncSupported,
  requestNotificationPermission,
  showOfflineSyncNotification,
  getCacheInfo,
  clearChatBotCaches
};

export default serviceWorkerUtils;