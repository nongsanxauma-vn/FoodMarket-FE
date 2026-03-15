/**
 * SuggestionsPanel Component
 * Display suggested questions as clickable chips with context-aware suggestions
 */

import React, { useMemo } from 'react';
import { SuggestionsPanelProps } from './types';

// Role-based default suggestions
const DEFAULT_SUGGESTIONS = {
  BUYER: [
    "What products are available today?",
    "Show me popular items",
    "Check my recent orders",
    "How do I track my order?",
    "What are today's deals?"
  ],
  SHOP_OWNER: [
    "How are my products performing?",
    "Show me recent orders",
    "Help with inventory management",
    "How to update product information?",
    "View customer reviews"
  ],
  SHIPPER: [
    "Show available delivery orders",
    "How to update delivery status?",
    "View my delivery history",
    "Report delivery issues",
    "Check delivery routes"
  ]
};

// Context-aware suggestion categories
const CONTEXTUAL_SUGGESTIONS = {
  product_inquiry: [
    "Tell me more about this product",
    "Is this product in stock?",
    "What are similar products?",
    "Add this to my cart"
  ],
  order_related: [
    "Track my order",
    "Cancel this order",
    "Contact seller",
    "Report an issue"
  ],
  general_help: [
    "How does delivery work?",
    "What payment methods are accepted?",
    "How to return items?",
    "Contact customer support"
  ]
};

interface SuggestionChipProps {
  suggestion: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

function SuggestionChip({ suggestion, onClick, variant = 'default' }: SuggestionChipProps) {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 'var(--chatbot-radius-full)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all var(--chatbot-transition-fast) cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--chatbot-border)',
    background: 'var(--chatbot-surface)',
    color: 'var(--chatbot-text)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: 'var(--chatbot-shadow-sm)',
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          borderColor: 'var(--chatbot-primary)',
          color: 'var(--chatbot-text)',
          background: 'var(--chatbot-primary-light)',
        };
      case 'secondary':
        return {
          borderColor: 'var(--chatbot-warning)',
          color: 'var(--chatbot-text)',
          background: 'rgba(245, 158, 11, 0.1)',
        };
      default:
        return {};
    }
  };

  return (
      <button
        type="button"
        onClick={onClick}
        style={{ ...baseStyle, ...getVariantStyles() }}
        className="chatbot-suggestion-chip"
        title={`Send: ${suggestion}`}
      >
        <span style={{ 
          maxWidth: '200px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          fontWeight: 500
        }}>
          {suggestion}
        </span>
      <svg
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ opacity: 0.6 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    </button>
  );
}
export function SuggestionsPanel({ 
  suggestions, 
  onSelectSuggestion, 
  isVisible = true 
}: SuggestionsPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  // Determine suggestion variants based on content
  const getSuggestionVariant = useMemo(() => {
    return (suggestion: string): 'default' | 'primary' | 'secondary' => {
      const lowerSuggestion = suggestion.toLowerCase();
      
      // Primary for product/order related
      if (lowerSuggestion.includes('product') || 
          lowerSuggestion.includes('order') || 
          lowerSuggestion.includes('track') ||
          lowerSuggestion.includes('cart')) {
        return 'primary';
      }
      
      // Secondary for help/support related
      if (lowerSuggestion.includes('help') || 
          lowerSuggestion.includes('support') || 
          lowerSuggestion.includes('contact') ||
          lowerSuggestion.includes('how')) {
        return 'secondary';
      }
      
      return 'default';
    };
  }, []);

  // Group suggestions by type for better organization
  const groupedSuggestions = useMemo(() => {
    if (!suggestions || suggestions.length === 0) {
      return { primary: [], secondary: [], default: [] };
    }

    return suggestions.reduce((groups, suggestion) => {
      const variant = getSuggestionVariant(suggestion);
      groups[variant].push(suggestion);
      return groups;
    }, { primary: [] as string[], secondary: [] as string[], default: [] as string[] });
  }, [suggestions, getSuggestionVariant]);

  if (!isVisible || !suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      className={`chatbot-suggestions-container ${!isExpanded ? 'is-collapsed' : ''}`}
      style={{
        background: 'var(--chatbot-glass-bg)',
        backdropFilter: 'var(--chatbot-blur)',
        maxHeight: isExpanded ? '500px' : '52px'
      }}
    >
      {/* Header Container */}
      <div 
        style={{ 
          padding: '12px 16px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--chatbot-text)', margin: 0 }}>
            Suggested questions
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--chatbot-text-muted)', background: 'var(--chatbot-primary-light)', padding: '2px 6px', borderRadius: '10px' }}>
            {suggestions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'none', md: { display: 'flex' }, alignItems: 'center', fontSize: '11px', color: 'var(--chatbot-text-muted)' } as any}>
            <svg
              width="12"
              height="12"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ marginRight: '4px' }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Quick actions
          </div>
          
          <button 
            className={`chatbot-toggle-button ${!isExpanded ? 'is-collapsed' : ''}`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s' }}>
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Content area */}
      <div className="chatbot-suggestions-content" style={{ padding: '0 16px 16px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(groupedSuggestions).map(([key, groupSuggestions]) => 
            groupSuggestions.length > 0 && (
              <div key={key} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {groupSuggestions.map((suggestion, index) => (
                  <SuggestionChip
                    key={`${key}-${index}`}
                    suggestion={suggestion}
                    onClick={() => onSelectSuggestion(suggestion)}
                    variant={key as any}
                  />
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--chatbot-text-muted)', textAlign: 'center', opacity: 0.8 }}>
          Click any suggestion to send it as a message
        </div>
      </div>
    </div>
  );
}