/**
 * Error Boundary Component for ChatBot
 * Catches and handles React component errors gracefully
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ChatBotError, createChatBotError, ERROR_CODES, logError } from './utils/errorUtils';
import { SupportedLanguage, getUserPreferredLanguage } from './utils/languageUtils';

interface Props {
  children: ReactNode;
  fallback?: (error: ChatBotError, retry: () => void) => ReactNode;
  onError?: (error: ChatBotError, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: ChatBotError | null;
  errorId: string | null;
}

export class ChatBotErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private readonly maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const chatBotError = createChatBotError(
      ERROR_CODES.UNKNOWN_ERROR,
      error.message || 'Component error occurred',
      'Something went wrong with the chat interface. Please try again.',
      { originalError: error, retryable: true }
    );

    return {
      hasError: true,
      error: chatBotError,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const chatBotError = this.state.error;
    if (chatBotError) {
      // Log error with context
      logError(chatBotError, {
        errorInfo,
        retryCount: this.retryCount,
        componentStack: errorInfo.componentStack,
        errorBoundary: 'ChatBotErrorBoundary'
      });

      // Call custom error handler if provided
      this.props.onError?.(chatBotError, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorId: null
      });
    }
  };

  handleReset = () => {
    this.retryCount = 0;
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorId={this.state.errorId}
          retryCount={this.retryCount}
          maxRetries={this.maxRetries}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: ChatBotError;
  errorId: string | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onReset: () => void;
}

function DefaultErrorFallback({
  error,
  errorId,
  retryCount,
  maxRetries,
  onRetry,
  onReset
}: DefaultErrorFallbackProps) {
  const language = getUserPreferredLanguage();

  const getLocalizedText = (key: string): string => {
    const texts = {
      title: {
        en: 'Something went wrong',
        vi: 'Đã xảy ra lỗi'
      },
      description: {
        en: 'The chat interface encountered an error. You can try again or refresh the page.',
        vi: 'Giao diện chat gặp lỗi. Bạn có thể thử lại hoặc làm mới trang.'
      },
      retryButton: {
        en: 'Try Again',
        vi: 'Thử Lại'
      },
      refreshButton: {
        en: 'Refresh Page',
        vi: 'Làm Mới Trang'
      },
      contactSupport: {
        en: 'Contact Support',
        vi: 'Liên Hệ Hỗ Trợ'
      },
      errorId: {
        en: 'Error ID',
        vi: 'Mã Lỗi'
      },
      maxRetriesReached: {
        en: 'Maximum retry attempts reached. Please refresh the page or contact support.',
        vi: 'Đã đạt số lần thử lại tối đa. Vui lòng làm mới trang hoặc liên hệ hỗ trợ.'
      }
    };

    return texts[key as keyof typeof texts]?.[language] || texts[key as keyof typeof texts]?.vi || '';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleContactSupport = () => {
    // Open support contact - could be email, chat, or phone
    const supportEmail = 'support@foodmarket.com';
    const subject = encodeURIComponent(`ChatBot Error Report - ${errorId}`);
    const body = encodeURIComponent(
      `Error Details:\n` +
      `- Error ID: ${errorId}\n` +
      `- Error Code: ${error.code}\n` +
      `- Message: ${error.message}\n` +
      `- Time: ${new Date().toISOString()}\n` +
      `- User Agent: ${navigator.userAgent}\n` +
      `- URL: ${window.location.href}\n\n` +
      `Please describe what you were doing when this error occurred:`
    );
    
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="chatbot-error-boundary">
      <div className="error-container">
        <div className="error-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        <h3 className="error-title">{getLocalizedText('title')}</h3>
        
        <p className="error-description">
          {error.userMessage || getLocalizedText('description')}
        </p>

        {retryCount >= maxRetries && (
          <p className="error-max-retries">
            {getLocalizedText('maxRetriesReached')}
          </p>
        )}

        <div className="error-actions">
          {retryCount < maxRetries && error.retryable && (
            <button
              className="error-button error-button-primary"
              onClick={onRetry}
            >
              {getLocalizedText('retryButton')} ({maxRetries - retryCount} left)
            </button>
          )}
          
          <button
            className="error-button error-button-secondary"
            onClick={handleRefresh}
          >
            {getLocalizedText('refreshButton')}
          </button>
          
          <button
            className="error-button error-button-secondary"
            onClick={handleContactSupport}
          >
            {getLocalizedText('contactSupport')}
          </button>
        </div>

        {errorId && (
          <div className="error-details">
            <small className="error-id">
              {getLocalizedText('errorId')}: {errorId}
            </small>
          </div>
        )}
      </div>

      <style jsx>{`
        .chatbot-error-boundary {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .error-container {
          text-align: center;
          max-width: 400px;
        }

        .error-icon {
          color: #dc3545;
          margin-bottom: 16px;
        }

        .error-title {
          color: #212529;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .error-description {
          color: #6c757d;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .error-max-retries {
          color: #dc3545;
          font-size: 13px;
          font-weight: 500;
          margin: 0 0 20px 0;
          padding: 8px 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }

        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .error-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .error-button-primary {
          background-color: #007bff;
          color: white;
        }

        .error-button-primary:hover {
          background-color: #0056b3;
        }

        .error-button-secondary {
          background-color: #6c757d;
          color: white;
        }

        .error-button-secondary:hover {
          background-color: #545b62;
        }

        .error-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-details {
          border-top: 1px solid #e9ecef;
          padding-top: 12px;
        }

        .error-id {
          color: #6c757d;
          font-family: monospace;
          font-size: 11px;
        }

        @media (max-width: 480px) {
          .chatbot-error-boundary {
            min-height: 250px;
            padding: 16px;
          }

          .error-container {
            max-width: 100%;
          }

          .error-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatBotErrorBoundary;