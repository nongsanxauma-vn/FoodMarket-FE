/**
 * Input Utilities
 * Helper functions for input validation and sanitization
 */

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate message length
 */
export function validateMessageLength(message: string): boolean {
  return message.length > 0 && message.length <= 1000;
}

/**
 * Check if message is empty or only whitespace
 */
export function isEmptyMessage(message: string): boolean {
  return message.trim().length === 0;
}

/**
 * Truncate message if too long
 */
export function truncateMessage(message: string, maxLength: number = 1000): string {
  if (message.length <= maxLength) {
    return message;
  }
  
  return message.substring(0, maxLength - 3) + '...';
}

/**
 * Extract mentions from message (e.g., @username)
 */
export function extractMentions(message: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

/**
 * Extract hashtags from message (e.g., #tag)
 */
export function extractHashtags(message: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;
  
  while ((match = hashtagRegex.exec(message)) !== null) {
    hashtags.push(match[1]);
  }
  
  return hashtags;
}