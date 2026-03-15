/**
 * Performance monitoring and optimization utilities
 * Provides tools for measuring and improving ChatBot performance
 */

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  messageCount: number;
  scrollPerformance: number;
  timestamp: number;
}

/**
 * Performance monitor class for tracking ChatBot performance
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Record performance metrics
   */
  recordMetrics(metrics: Partial<PerformanceMetrics>) {
    const fullMetrics: PerformanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      messageCount: 0,
      scrollPerformance: 0,
      timestamp: Date.now(),
      ...metrics
    };

    this.metrics.push(fullMetrics);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Notify observers
    this.observers.forEach(observer => observer(fullMetrics));

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('ChatBot Performance:', fullMetrics);
    }
  }

  /**
   * Get performance statistics
   */
  getStats() {
    if (this.metrics.length === 0) {
      return null;
    }

    const recent = this.metrics.slice(-10);
    const avgRenderTime = recent.reduce((sum, m) => sum + m.renderTime, 0) / recent.length;
    const avgMemoryUsage = recent.reduce((sum, m) => sum + m.memoryUsage, 0) / recent.length;
    const avgScrollPerformance = recent.reduce((sum, m) => sum + m.scrollPerformance, 0) / recent.length;

    return {
      averageRenderTime: Math.round(avgRenderTime * 100) / 100,
      averageMemoryUsage: Math.round(avgMemoryUsage),
      averageScrollPerformance: Math.round(avgScrollPerformance * 100) / 100,
      totalMetrics: this.metrics.length,
      lastUpdated: this.metrics[this.metrics.length - 1].timestamp
    };
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(observer: (metrics: PerformanceMetrics) => void) {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }
}

/**
 * Measure render time of a component
 */
export function measureRenderTime<T extends (...args: any[]) => any>(
  fn: T,
  componentName: string = 'Component'
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    
    PerformanceMonitor.getInstance().recordMetrics({
      renderTime,
      timestamp: Date.now()
    });

    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }

    return result;
  }) as T;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): T {
  let timeout: NodeJS.Timeout | null = null;
  
  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  }) as T;
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

/**
 * Memory usage estimation
 */
export function estimateMemoryUsage(data: any): number {
  const seen = new WeakSet();
  
  function sizeOf(obj: any): number {
    if (obj === null || obj === undefined) return 0;
    if (typeof obj === 'boolean') return 4;
    if (typeof obj === 'number') return 8;
    if (typeof obj === 'string') return obj.length * 2;
    if (typeof obj === 'symbol') return 8;
    
    if (seen.has(obj)) return 0;
    seen.add(obj);
    
    if (Array.isArray(obj)) {
      return obj.reduce((sum, item) => sum + sizeOf(item), 0);
    }
    
    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((sum, key) => {
        return sum + sizeOf(key) + sizeOf(obj[key]);
      }, 0);
    }
    
    return 0;
  }
  
  return sizeOf(data);
}

/**
 * Check if device has limited resources
 */
export function isLowEndDevice(): boolean {
  // Check for various indicators of low-end devices
  const navigator = window.navigator as any;
  
  // Check memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
    return true;
  }
  
  // Check CPU cores (if available)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  
  // Check connection (if available)
  if (navigator.connection) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return true;
    }
  }
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  return isMobile;
}

/**
 * Optimize configuration based on device capabilities
 */
export function getOptimizedConfig() {
  const isLowEnd = isLowEndDevice();
  
  return {
    virtualScrolling: {
      enabled: true,
      itemHeight: isLowEnd ? 60 : 80,
      overscan: isLowEnd ? 3 : 5
    },
    memoryManagement: {
      maxMessages: isLowEnd ? 500 : 1000,
      cleanupInterval: isLowEnd ? 180000 : 300000 // 3 or 5 minutes
    },
    debouncing: {
      inputDelay: isLowEnd ? 500 : 300,
      suggestionDelay: isLowEnd ? 800 : 500
    },
    animations: {
      enabled: !isLowEnd,
      duration: isLowEnd ? 200 : 300
    }
  };
}

/**
 * Performance-aware request animation frame
 */
export function performanceAwareRAF(callback: () => void, priority: 'high' | 'normal' | 'low' = 'normal') {
  const now = performance.now();
  
  if (priority === 'high') {
    // Execute immediately for high priority
    callback();
  } else if (priority === 'low') {
    // Use timeout for low priority to avoid blocking
    setTimeout(callback, 0);
  } else {
    // Use RAF for normal priority
    requestAnimationFrame(callback);
  }
}

/**
 * Batch DOM updates for better performance
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}