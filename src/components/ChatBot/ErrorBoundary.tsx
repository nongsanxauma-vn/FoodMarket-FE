/**
 * Error Boundary Component for ChatBot
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ===== TYPES =====
interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

// ===== ERROR BOUNDARY CLASS =====
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
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChatBot Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: null, errorId: null });
    }
  };

  handleReset = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: null, errorId: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

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

// ===== DEFAULT FALLBACK UI =====
interface DefaultErrorFallbackProps {
  error: Error;
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

  const handleRefresh = () => window.location.reload();

  const handleContactSupport = () => {
    const supportEmail = 'support@foodmarket.com';
    const subject = encodeURIComponent(`Báo lỗi ChatBot - ${errorId}`);
    const body = encodeURIComponent(
      `Chi tiết lỗi:\n` +
      `- Mã lỗi: ${errorId}\n` +
      `- Nội dung: ${error.message}\n` +
      `- Thời gian: ${new Date().toISOString()}\n` +
      `- Trình duyệt: ${navigator.userAgent}\n` +
      `- URL: ${window.location.href}\n\n` +
      `Mô tả những gì bạn đang làm khi xảy ra lỗi:`
    );
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="chatbot-error-boundary">
      <div className="error-container">

        {/* Icon lỗi */}
        <div className="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h3 className="error-title">Đã xảy ra lỗi</h3>

        <p className="error-description">
          {error.message || 'Giao diện chat gặp lỗi. Bạn có thể thử lại hoặc làm mới trang.'}
        </p>

        {/* Cảnh báo hết lượt thử */}
        {retryCount >= maxRetries && (
          <p className="error-max-retries">
            Đã đạt số lần thử lại tối đa. Vui lòng làm mới trang hoặc liên hệ hỗ trợ.
          </p>
        )}

        {/* Các nút hành động */}
        <div className="error-actions">
          {retryCount < maxRetries && (
            <button className="error-button error-button-primary" onClick={onRetry}>
              Thử lại ({maxRetries - retryCount} lần còn lại)
            </button>
          )}

          <button className="error-button error-button-secondary" onClick={handleRefresh}>
            Làm mới trang
          </button>

          <button className="error-button error-button-secondary" onClick={handleContactSupport}>
            Liên hệ hỗ trợ
          </button>
        </div>

        {/* Mã lỗi */}
        {errorId && (
          <div className="error-details">
            <small className="error-id">Mã lỗi: {errorId}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBotErrorBoundary;