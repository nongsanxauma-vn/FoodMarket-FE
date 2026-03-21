import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ProductSuggestion, MessageBubbleProps } from './chatbot.types';

// ===== MARKDOWN COMPONENTS =====
const markdownComponents = {
  p: ({ children }: any) => (
    <p style={{ margin: '2px 0', lineHeight: '1.6' }}>{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul style={{ paddingLeft: '16px', margin: '4px 0' }}>{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol style={{ paddingLeft: '16px', margin: '4px 0' }}>{children}</ol>
  ),
  li: ({ children }: any) => (
    <li style={{ margin: '2px 0', lineHeight: '1.6' }}>{children}</li>
  ),
  strong: ({ children }: any) => (
    <strong style={{ fontWeight: 700 }}>{children}</strong>
  ),
  h1: ({ children }: any) => (
    <h1 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px' }}>{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 style={{ fontSize: '14px', fontWeight: 700, margin: '6px 0 3px' }}>{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0 2px' }}>{children}</h3>
  ),
};

// ===== MATCH LOGIC =====
const isMatch = (productName: string, line: string): boolean => {
  const name = productName.toLowerCase().trim();
  const text = line.toLowerCase().trim();
  if (text.includes(name)) return true;
  const mainWords = name.split(' ').filter(w => w.length >= 3);
  return mainWords.length > 0 && mainWords.every(word => text.includes(word));
};

// ===== PRODUCT CARD INLINE =====
interface InlineProductCardProps {
  product: ProductSuggestion;
  onClick: () => void;
}

const InlineProductCard: React.FC<InlineProductCardProps> = ({ product, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: '#fff',
      border: '1px solid #e8f5e9',
      borderRadius: '10px',
      padding: '8px 12px',
      marginTop: '6px',
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(76,175,80,0.08)',
      transition: 'all 0.15s ease',
      width: '100%'
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.boxShadow = '0 4px 12px rgba(76,175,80,0.2)';
      el.style.borderColor = '#4CAF50';
      el.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.boxShadow = '0 1px 4px rgba(76,175,80,0.08)';
      el.style.borderColor = '#e8f5e9';
      el.style.transform = 'translateY(0)';
    }}
  >
    {/* Ảnh sản phẩm */}
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '8px',
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: '22px' }}>🥬</span>
      )}
    </div>

    {/* Thông tin sản phẩm */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{
        margin: 0,
        fontSize: '13px',
        fontWeight: 600,
        color: '#222',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {product.name}
      </p>
      {product.category && (
        <p style={{
          margin: '1px 0 0',
          fontSize: '11px',
          color: '#999'
        }}>
          {product.category}
        </p>
      )}
      <p style={{
        margin: '2px 0 0',
        fontSize: '13px',
        fontWeight: 700,
        color: '#E53935'
      }}>
        {product.price.toLocaleString('vi-VN')}đ
      </p>
    </div>

    {/* Nút xem */}
    <div style={{
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    }}>
      Xem →
    </div>
  </div>
);

// ===== RENDER CONTENT WITH INLINE PRODUCTS =====
const renderContentWithProducts = (
  content: string,
  products: ProductSuggestion[],
  navigate: (path: string) => void
) => {
  if (!products || products.length === 0) {
    return (
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    );
  }

  // Tách dòng
  const lines = content.split('\n');

  // Nhóm các dòng liên tiếp thành các block
  // Mỗi block gồm: dòng text + các sản phẩm match
  const blocks: { text: string; matchedProducts: ProductSuggestion[] }[] = [];

  lines.forEach(line => {
    const matched = products.filter(p => isMatch(p.name, line));
    blocks.push({ text: line, matchedProducts: matched });
  });

  return (
    <div>
      {blocks.map((block, index) => (
        <div key={index}>
          {/* Render dòng text */}
          {block.text.trim() && (
            <ReactMarkdown components={markdownComponents}>
              {block.text}
            </ReactMarkdown>
          )}

          {/* Render product cards ngay sau dòng có match */}
          {block.matchedProducts.length > 0 && (
            <div style={{ marginBottom: '6px' }}>
              {block.matchedProducts.map(product => (
                <InlineProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===== MESSAGE BUBBLE =====
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const navigate = useNavigate();
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      margin: '8px 0'
    }}>

      {/* Nhãn người gửi */}
      {!isUser && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '4px',
          marginLeft: '2px'
        }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#fff',
            fontWeight: 700
          }}>
            AI
          </div>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>
            Trợ lý AI
          </span>
        </div>
      )}

      {/* Bubble chính */}
      <div style={{
        maxWidth: '88%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        backgroundColor: isUser ? '#4CAF50' : '#fff',
        color: isUser ? '#fff' : '#222',
        fontSize: '14px',
        lineHeight: '1.6',
        wordBreak: 'break-word',
        boxShadow: isUser
          ? '0 2px 8px rgba(76,175,80,0.25)'
          : '0 1px 4px rgba(0,0,0,0.08)',
        border: isUser ? 'none' : '1px solid #f0f0f0'
      }}>
        {isUser
          ? message.content
          : renderContentWithProducts(
              message.content,
              message.suggestedProducts ?? [],
              navigate
            )
        }
      </div>

      {/* Thời gian + trạng thái */}
      <div style={{
        fontSize: '11px',
        color: '#bbb',
        marginTop: '3px',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        marginLeft: isUser ? 0 : '4px'
      }}>
        <span>{formatTime(message.timestamp)}</span>
        {isUser && (
          <span>
            {message.status === 'sending' && '⏳'}
            {message.status === 'sent' && '✓✓'}
            {message.status === 'error' && '❌'}
          </span>
        )}
      </div>
    </div>
  );
};