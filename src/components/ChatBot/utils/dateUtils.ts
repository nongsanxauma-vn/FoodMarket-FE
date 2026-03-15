/**
 * Date Utilities
 * Helper functions for date formatting
 */

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN');
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date): string {
  if (isToday(date)) {
    return formatTimestamp(date);
  }
  
  if (isYesterday(date)) {
    return `Hôm qua ${formatTimestamp(date)}`;
  }
  
  return `${formatDate(date)} ${formatTimestamp(date)}`;
}