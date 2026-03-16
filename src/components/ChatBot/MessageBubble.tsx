import React from 'react';
import { MessageBubbleProps, ChatAction } from './types';

/**
 * MessageBubble Component
 * User and AI message bubbles with different styles, timestamps, and status indicators
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRetry,
  onActionClick
}) => {
  const isUser = message.sender === 'user';
  const isSystem = message.type === 'system';

  // Debug log
  console.log('[MessageBubble] Rendering message:', {
    id: message.id,
    content: message.content,
    sender: message.sender,
    contentLength: message.content?.length,
    hasContent: !!message.content
  });

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(timestamp);
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'failed':
        return '❌';
      default:
        return '';
    }
  };

  // Handle action button click
  const handleActionClick = (action: ChatAction) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  // Handle retry click
  const handleRetry = () => {
    if (onRetry && message.status === 'failed') {
      onRetry(message.id);
    }
  };

  // Get action button style based on action type
  const getActionButtonStyle = (actionType: string) => {
    const baseStyle = {
      padding: '6px 12px',
      fontSize: '12px',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      margin: '2px',
      fontWeight: '500' as const
    };

    switch (actionType) {
      case 'view_product':
        return { ...baseStyle, backgroundColor: '#28a745', color: 'white' };
      case 'add_to_cart':
        return { ...baseStyle, backgroundColor: '#ffc107', color: '#333' };
      case 'track_order':
        return { ...baseStyle, backgroundColor: '#17a2b8', color: 'white' };
      case 'contact_support':
        return { ...baseStyle, backgroundColor: '#6c757d', color: 'white' };
      default:
        return { ...baseStyle, backgroundColor: '#007bff', color: 'white' };
    }
  };

  // System message style
  if (isSystem) {
    return (
      <div 
        className="message-bubble system"
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '12px',
          color: 'var(--chatbot-text-muted)',
          margin: '12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ flex: 1, height: '1px', background: 'var(--chatbot-border)' }}></span>
        <span>{message.content}</span>
        <span style={{ flex: 1, height: '1px', background: 'var(--chatbot-border)' }}></span>
      </div>
    );
  }

  return (
    <div 
      className={`message-bubble-wrapper ${isUser ? 'is-user' : 'is-ai'}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        margin: '12px 0',
        width: '100%',
        animation: 'chatbot-slide-up 0.4s ease-out'
      }}
    >
      {/* Sender Info - Small Avatar or Label */}
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', marginLeft: '4px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            background: 'linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-primary-hover))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px'
          }}>
            AI
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--chatbot-text)' }}>Assistant</span>
        </div>
      )}

      {/* Message content */}
      <div
        className="message-content-bubble"
        style={{
          maxWidth: '85%',
          padding: '12px 18px',
          borderRadius: isUser ? '20px 20px 4px 20px' : '4px 20px 20px 20px',
          background: isUser 
            ? 'var(--chatbot-primary)' 
            : 'var(--chatbot-surface)',
          color: isUser ? 'white' : 'var(--chatbot-text)',
          boxShadow: isUser 
            ? '0 4px 12px var(--chatbot-primary-light)' 
            : 'var(--chatbot-shadow)',
          border: '1px solid var(--chatbot-border)',
          wordWrap: 'break-word',
          position: 'relative',
          whiteSpace: 'pre-line',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      >
        {message.content || '[Empty content - Debug: ' + JSON.stringify(message).substring(0, 100) + ']'}

        {/* Actions for AI messages */}
        {!isUser && message.metadata?.actions && Array.isArray(message.metadata.actions) && (
          <div 
            style={{
              marginTop: '16px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              paddingTop: '12px',
              borderTop: '1px solid var(--chatbot-border)'
            }}
          >
            {message.metadata.actions.map((action: ChatAction, index: number) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="chatbot-action-button"
                style={{
                  ...getActionButtonStyle(action.type),
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--chatbot-shadow-sm)'
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Legacy action handling for backward compatibility */}
        {!isUser && message.metadata?.actionType && !message.metadata?.actions && (
          <div 
            style={{
              marginTop: '8px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            {message.metadata.actionType === 'product' && (
              <>
                <button
                  onClick={() => handleActionClick({
                    type: 'view_product',
                    label: 'View Product',
                    data: { productId: message.metadata?.productId }
                  })}
                  style={getActionButtonStyle('view_product')}
                >
                  View Product
                </button>
                <button
                  onClick={() => handleActionClick({
                    type: 'add_to_cart',
                    label: 'Add to Cart',
                    data: { productId: message.metadata?.productId }
                  })}
                  style={getActionButtonStyle('add_to_cart')}
                >
                  Add to Cart
                </button>
              </>
            )}
            {message.metadata.actionType === 'order' && (
              <>
                <button
                  onClick={() => handleActionClick({
                    type: 'track_order',
                    label: 'Track Order',
                    data: { orderId: message.metadata?.orderId }
                  })}
                  style={getActionButtonStyle('track_order')}
                >
                  Track Order
                </button>
                <button
                  onClick={() => handleActionClick({
                    type: 'contact_support',
                    label: 'Contact Support',
                    data: { orderId: message.metadata?.orderId }
                  })}
                  style={getActionButtonStyle('contact_support')}
                >
                  Contact Support
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Timestamp and status */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: '#666',
          marginTop: '4px',
          flexDirection: isUser ? 'row-reverse' : 'row'
        }}
      >
        <span>{formatTime(message.timestamp)}</span>
        {isUser && (
          <span className="status-icon">
            {getStatusIcon()}
          </span>
        )}
        {message.status === 'failed' && onRetry && (
          <button
            onClick={handleRetry}
            style={{
              fontSize: '12px',
              color: '#dc3545',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0',
              marginLeft: '4px'
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};