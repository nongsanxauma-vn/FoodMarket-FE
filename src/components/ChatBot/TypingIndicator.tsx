import React, { useEffect, useState } from 'react';
import { TypingIndicatorProps } from './types';

/**
 * TypingIndicator Component
 * Animated typing indicator for AI responses
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible,
  message = 'AI is typing'
}) => {
  const [dots, setDots] = useState('');

  // Animate dots
  useEffect(() => {
    if (!isVisible) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="typing-indicator"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 18px',
        margin: '12px 0',
        maxWidth: '85%',
        animation: 'chatbot-slide-up 0.4s ease-out'
      }}
    >
      {/* AI avatar/indicator */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-primary-hover))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      </div>

      {/* Typing bubble */}
      <div
        style={{
          backgroundColor: 'var(--chatbot-surface)',
          border: '1px solid var(--chatbot-border)',
          borderRadius: '4px 20px 20px 20px',
          padding: '10px 16px',
          position: 'relative',
          minWidth: '60px',
          boxShadow: 'var(--chatbot-shadow-sm)',
        }}
      >
        {/* Animated dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Animated bouncing dots */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'center'
            }}
          >
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--chatbot-primary)',
                  animation: `bounce 1.4s infinite ease-in-out`,
                  animationDelay: `${index * 0.16}s`,
                  animationFillMode: 'both',
                  opacity: 0.6
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--chatbot-text-muted)', fontWeight: 500 }}>{message}</span>
        </div>
      </div>

    </div>
  );
};