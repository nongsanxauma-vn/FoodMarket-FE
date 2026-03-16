/**
 * Virtualized Message List Component
 * Optimized for handling large numbers of messages with virtual scrolling
 */

import React, { useRef, useEffect, useCallback, memo } from 'react';
import { ChatMessage } from './types';
import { useVirtualScrolling, useAutoScroll } from './hooks/useVirtualScrolling';
import { useMessageMemoryManagement } from './hooks/useMemoryManagement';
import { MessageBubble } from './MessageBubble';

export interface VirtualizedMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  className?: string;
  style?: React.CSSProperties;
  autoScroll?: boolean;
  itemHeight?: number;
  containerHeight?: number;
}

const ITEM_HEIGHT = 100; // Recalibrated for better scroll control
const CONTAINER_HEIGHT = 500;

/**
 * Virtualized message list component with performance optimizations
 */
const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = memo(({
  messages: rawMessages,
  isLoading = false,
  onLoadMore,
  className = '',
  style = {},
  autoScroll = true,
  itemHeight = ITEM_HEIGHT,
  containerHeight = CONTAINER_HEIGHT
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [actualContainerHeight, setActualContainerHeight] = React.useState(containerHeight || CONTAINER_HEIGHT);

  // Measure container height for responsiveness
  useEffect(() => {
    if (containerHeight) {
      setActualContainerHeight(containerHeight);
      return;
    }

    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setActualContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerHeight]);

  // Memory management for large conversations
  const { messages, memoryUsage } = useMessageMemoryManagement(rawMessages, {
    maxMessages: 1000,
    enableAutoCleanup: true
  });

  // Virtual scrolling for performance
  const {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  } = useVirtualScrolling({
    itemHeight,
    containerHeight: actualContainerHeight,
    totalItems: messages.length,
    overscan: 5
  });

  // Auto-scroll to bottom for new messages
  const scrollToBottom = useAutoScroll(messages.length, autoScroll);
  
  // Track previous message count to prevent unnecessary scrolls
  const prevMessageCountRef = useRef(messages.length);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    onScroll(target.scrollTop);

    // Load more messages when scrolled to top
    if (target.scrollTop === 0 && onLoadMore) {
      onLoadMore();
    }
  }, [onScroll, onLoadMore]);

  // Auto-scroll when new messages arrive (only when count increases)
  useEffect(() => {
    if (autoScroll && scrollElementRef.current && messages.length > prevMessageCountRef.current) {
      scrollToBottom(scrollElementRef.current);
      prevMessageCountRef.current = messages.length;
    } else if (messages.length !== prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
    }
  }, [messages.length, autoScroll, scrollToBottom]);

  // Log memory usage in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ChatBot Memory Usage:', memoryUsage);
    }
  }, [memoryUsage]);

  return (
    <div
      ref={containerRef}
      className={`virtualized-message-list ${className}`}
      style={{
        height: containerHeight || '100%',
        flex: containerHeight ? undefined : 1,
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    >
      <div
        ref={scrollElementRef}
        onScroll={handleScroll}
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Render all messages without virtualization to prevent scroll issues */}
        <div style={{ padding: '12px 16px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '12px'
              }}
            >
              <MessageBubble message={message} />
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div
            style={{
              padding: '16px',
              textAlign: 'center',
              color: '#666'
            }}
          >
            Loading more messages...
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontStyle: 'italic'
            }}
          >
            Start a conversation with our AI assistant!
          </div>
        )}
      </div>

      {/* Development memory usage indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            fontSize: '10px',
            borderRadius: '0 0 0 4px'
          }}
        >
          {memoryUsage.messageCount} msgs, {memoryUsage.estimatedKB}KB
        </div>
      )}
    </div>
  );
});

VirtualizedMessageList.displayName = 'VirtualizedMessageList';

export default VirtualizedMessageList;
