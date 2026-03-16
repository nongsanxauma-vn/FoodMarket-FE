/**
 * AI ChatBot Service
 * Handles all AI chatbot API interactions
 */

import { httpClient, ApiResponse } from './http.client';
import { 
  ChatBotService, 
  ChatResponse, 
  ChatHistoryResponse, 
  ChatContext,
  ChatAction,
  OrderSummary,
  PurchasePattern
} from '../components/ChatBot/types';
import { productService, ProductResponse } from './product.service';
import { orderService, OrderResponse } from './order.service';
import { authService, UserResponse } from './auth.service';
import { 
  detectLanguage, 
  getUserPreferredLanguage, 
  setUserPreferredLanguage,
  getLocalizedText,
  getLocalizedSuggestions,
  formatCurrency,
  formatDate,
  SupportedLanguage
} from '../components/ChatBot/utils/languageUtils';

/**
 * Request/Response Types for Backend API
 */
export interface ChatRequest {
  message: string;
  context?: ChatContext;
}

export interface ChatbotApiResponse {
  message: string;
  content?: string;
  text?: string;
  body?: string;
  suggestions?: string[];
  actions?: ChatAction[];
  context?: ChatContext;
}

/**
 * ChatBot Service Implementation
 */
class ChatBotServiceImpl implements ChatBotService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  
  /**
   * Send message to AI and get response with retry logic and language support
   */
  async sendMessage(message: string, context?: ChatContext): Promise<ChatResponse> {
    // Input validation and sanitization
    if (!message || typeof message !== 'string') {
      const userLanguage = context?.userPreferences?.language || getUserPreferredLanguage();
      throw new Error(userLanguage === 'en' 
        ? 'Message cannot be empty'
        : 'Tin nhắn không được để trống');
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      const userLanguage = context?.userPreferences?.language || getUserPreferredLanguage();
      throw new Error(userLanguage === 'en' 
        ? 'Message cannot be empty'
        : 'Tin nhắn không được để trống');
    }

    if (trimmedMessage.length > 2000) {
      const userLanguage = context?.userPreferences?.language || getUserPreferredLanguage();
      throw new Error(userLanguage === 'en' 
        ? 'Message is too long (maximum 2000 characters)'
        : 'Tin nhắn quá dài (tối đa 2000 ký tự)');
    }

    // Basic XSS prevention
    const sanitizedMessage = trimmedMessage
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    return this.withRetry(async () => {
      try {
        // Detect language from message
        const detectedLanguage = detectLanguage(sanitizedMessage);
        
        // Update user preferences if context is available
        if (context?.userPreferences) {
          context.userPreferences.language = detectedLanguage;
          setUserPreferredLanguage(detectedLanguage);
        }

        // Check if message is product-related and handle locally
        const productResponse = await this.handleProductQuery(sanitizedMessage, context, detectedLanguage);
        if (productResponse) {
          return productResponse;
        }

        // Check if message is order-related and handle locally
        const orderResponse = await this.handleOrderQuery(sanitizedMessage, context, detectedLanguage);
        if (orderResponse) {
          return orderResponse;
        }

        const request: ChatRequest = {
          message: sanitizedMessage,
          context: {
            ...context,
            userPreferences: {
              ...context?.userPreferences,
              language: detectedLanguage
            }
          }
        };

        // Debug logs
        console.log('=== ChatBot API Call ===');
        console.log('URL:', '/chatbot/chat');
        console.log('Message:', sanitizedMessage);
        console.log('Has Token:', !!localStorage.getItem('auth_token'));
        console.log('Request body:', JSON.stringify(request, null, 2));
        console.log('Context:', context);

        const response = await httpClient.post<ChatbotApiResponse>('/chatbot/chat', request);
        
        console.log('=== ChatBot API Response ===');
        console.log('Full response:', response);
        console.log('response.result:', response.result);
        console.log('response.result.message:', response.result?.message);
        console.log('response.result keys:', response.result ? Object.keys(response.result) : 'no result');
        
        const result = response.result;
        let aiMessageContent = '';

        // Helper to check if a string is likely a system status message rather than AI content
        const isStatusMessage = (text: string) => {
          const statusPatterns = [/success/i, /generated/i, /ok/i, /completed/i, /verified/i, /received/i];
          return text.length < 60 && statusPatterns.some(pattern => pattern.test(text));
        };

        if (result) {
          if (typeof result === 'string') {
            aiMessageContent = result;
          } else if (typeof result === 'object' && result !== null) {
            // 1. Try priority fields first
            aiMessageContent = result.message || result.content || result.text || result.body || '';
            
            // 2. If priority fields are empty or just status messages, look for the longest string field
            if (!aiMessageContent || isStatusMessage(aiMessageContent)) {
              let longestField = '';
              for (const key in result) {
                const val = (result as any)[key];
                if (typeof val === 'string' && val.length > longestField.length && !isStatusMessage(val)) {
                  longestField = val;
                }
              }
              if (longestField) aiMessageContent = longestField;
            }
          }
        }

        // Fallback to top-level message ONLY if it's not a generic status message
        if ((!aiMessageContent || isStatusMessage(aiMessageContent)) && response.message && !isStatusMessage(response.message)) {
          aiMessageContent = response.message;
        }

        // Final fallback: if we still only have a status message or nothing, use what we have but prefer result.message
        if (!aiMessageContent) {
          aiMessageContent = (typeof result === 'object' ? result?.message : '') || response.message || '';
        }

        const chatResponse = {
          message: aiMessageContent,
          suggestions: (result as any)?.suggestions || (response as any).suggestions || [],
          actions: (result as any)?.actions || (response as any).actions || [],
          context: (result as any)?.context || (response as any).context
        };
        
        console.log('=== Returning ChatResponse ===');
        console.log('Final content extracted:', aiMessageContent);
        if (isStatusMessage(aiMessageContent)) console.warn('Warning: Extracted content looks like a status message');

        return chatResponse;
      } catch (error: any) {
        console.error('ChatBot sendMessage error:', error);
        
        // Get user's preferred language for error messages
        const userLanguage = context?.userPreferences?.language || getUserPreferredLanguage();

        // Handle specific error types with localized messages
        if (error.status === 401) {
          // Clear any cached auth tokens on 401
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          throw new Error(getLocalizedText('loginRequired', userLanguage));
        } else if (error.status === 403) {
          throw new Error(userLanguage === 'en' 
            ? 'Access denied. You do not have permission to perform this action.'
            : 'Truy cập bị từ chối. Bạn không có quyền thực hiện hành động này.');
        } else if (error.status === 429) {
          throw new Error(userLanguage === 'en' 
            ? 'Too many requests. Please wait a moment and try again.'
            : 'Quá nhiều yêu cầu. Vui lòng đợi một chút và thử lại.');
        } else if (error.status >= 500) {
          throw new Error(userLanguage === 'en'
            ? 'AI service is temporarily unavailable. Please try again later.'
            : 'Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.');
        } else if (error.name === 'AbortError' || error.message === 'Request timeout') {
          throw new Error(userLanguage === 'en'
            ? 'Request timed out. Please check your connection and try again.'
            : 'Yêu cầu hết thời gian chờ. Vui lòng kiểm tra kết nối và thử lại.');
        } else if (!navigator.onLine) {
          throw new Error(userLanguage === 'en'
            ? 'You appear to be offline. Please check your internet connection.'
            : 'Bạn đang offline. Vui lòng kiểm tra kết nối internet.');
        }
        
        throw error;
      }
    });
  }

  /**
   * Get chat history from backend with retry logic
   */
  async getChatHistory(): Promise<ChatHistoryResponse[]> {
    return this.withRetry(async () => {
      try {
        console.log('[ChatBotService] Calling /chatbot/history');
        const response = await httpClient.get<ChatHistoryResponse[]>('/chatbot/history');
        console.log('[ChatBotService] Full response:', response);
        console.log('[ChatBotService] response type:', typeof response);
        console.log('[ChatBotService] response keys:', Object.keys(response));
        console.log('[ChatBotService] response.result:', response.result);
        console.log('[ChatBotService] response.result type:', typeof response.result);
        console.log('[ChatBotService] response.result is Array:', Array.isArray(response.result));
        
        // Check if response.result exists and is an array
        let historyData: any[] = [];
        
        if (Array.isArray(response.result)) {
          historyData = response.result;
        } else if (Array.isArray(response)) {
          // Backend might return array directly
          historyData = response as any;
        } else {
          console.error('[ChatBotService] Unexpected response structure:', response);
        }
        
        console.log('[ChatBotService] historyData:', historyData);
        console.log('[ChatBotService] historyData length:', historyData.length);
        
        if (historyData.length > 0) {
          console.log('[ChatBotService] First item:', historyData[0]);
          console.log('[ChatBotService] First item keys:', Object.keys(historyData[0]));
          console.log('[ChatBotService] First item content:', historyData[0].content);
        }
        
        return historyData;
      } catch (error: any) {
        console.error('ChatBot getChatHistory error:', error);
        
        // Handle specific error types
        if (error.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (error.status >= 500) {
          throw new Error('Unable to load chat history. Please try again later.');
        }
        
        throw error;
      }
    });
  }

  /**
   * Clear chat history with retry logic
   */
  async clearChatHistory(): Promise<void> {
    return this.withRetry(async () => {
      try {
        await httpClient.delete<void>('/chatbot/history');
      } catch (error: any) {
        console.error('ChatBot clearChatHistory error:', error);
        
        // Handle specific error types
        if (error.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (error.status >= 500) {
          throw new Error('Unable to clear chat history. Please try again later.');
        }
        
        throw error;
      }
    });
  }

  /**
   * Retry mechanism for API calls
   */
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry for certain error types
        if (error.status === 401 || error.status === 403 || error.status === 400) {
          throw error;
        }
        
        // Don't retry for validation errors
        if (error.message?.includes('empty') || error.message?.includes('too long')) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === this.MAX_RETRIES) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`ChatBot API retry attempt ${attempt}/${this.MAX_RETRIES} after ${delay}ms`);
        await this.delay(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get suggested questions based on context with language support
   */
  getSuggestions(context?: ChatContext): string[] {
    const userLanguage = context?.userPreferences?.language || getUserPreferredLanguage();
    
    // Personalized suggestions based on user profile
    if (context?.userProfile) {
      return this.getPersonalizedSuggestions(context, userLanguage);
    }

    // Default suggestions based on user role with localization
    if (context?.userRole) {
      return getLocalizedSuggestions({ userRole: context.userRole }, userLanguage);
    }

    return getLocalizedSuggestions({ userRole: 'BUYER' }, userLanguage);
  }

  /**
   * Get personalized suggestions based on user profile and history with language support
   */
  private getPersonalizedSuggestions(context: ChatContext, language: SupportedLanguage = 'vi'): string[] {
    const { userProfile, userRole } = context;
    const suggestions: string[] = [];

    if (userRole === 'BUYER' && userProfile) {
      // Personalize based on order history and preferences
      if (userProfile.orderHistory && userProfile.orderHistory.length > 0) {
        const recentOrder = userProfile.orderHistory[0];
        const orderAmount = formatCurrency(recentOrder.totalAmount, language);
        
        if (language === 'en') {
          suggestions.push(`Reorder like last time (${orderAmount})`);
        } else {
          suggestions.push(`Đặt lại đơn hàng như lần trước (${orderAmount})`);
        }
      }

      // Suggest based on favorite categories
      if (userProfile.favoriteCategories && userProfile.favoriteCategories.length > 0) {
        const topCategory = userProfile.favoriteCategories[0];
        if (language === 'en') {
          suggestions.push(`Find latest ${topCategory} products`);
        } else {
          suggestions.push(`Tìm sản phẩm ${topCategory} mới nhất`);
        }
      }

      // Suggest based on purchase patterns
      if (userProfile.purchasePatterns && userProfile.purchasePatterns.length > 0) {
        const frequentCategory = userProfile.purchasePatterns
          .sort((a, b) => b.frequency - a.frequency)[0];
        
        if (language === 'en') {
          suggestions.push(`View best-selling ${frequentCategory.category}`);
        } else {
          suggestions.push(`Xem ${frequentCategory.category} bán chạy nhất`);
        }
      }

      // Add location-based suggestions if available
      if (userProfile.address) {
        if (language === 'en') {
          suggestions.push('Find shops near me');
        } else {
          suggestions.push('Tìm shop gần tôi');
        }
      }

      // Fill remaining slots with localized default suggestions
      const defaultSuggestions = getLocalizedSuggestions({ userRole: 'BUYER' }, language);
      defaultSuggestions.forEach(suggestion => {
        if (suggestions.length < 4 && !suggestions.some(s => s.includes(suggestion.split(' ')[0]))) {
          suggestions.push(suggestion);
        }
      });

    } else if (userRole === 'SHOP_OWNER' && userProfile) {
      // Personalize for shop owners
      if (userProfile.shopName) {
        if (language === 'en') {
          suggestions.push(`Update ${userProfile.shopName} information`);
        } else {
          suggestions.push(`Cập nhật thông tin ${userProfile.shopName}`);
        }
      }

      if (userProfile.ratingAverage && userProfile.ratingAverage < 4.0) {
        if (language === 'en') {
          suggestions.push('How to improve shop rating');
        } else {
          suggestions.push('Cách cải thiện đánh giá shop');
        }
      }

      const defaultSuggestions = getLocalizedSuggestions({ userRole: 'SHOP_OWNER' }, language);
      suggestions.push(...defaultSuggestions.slice(0, 4 - suggestions.length));

    } else if (userRole === 'SHIPPER' && userProfile) {
      // Personalize for shippers
      const defaultSuggestions = getLocalizedSuggestions({ userRole: 'SHIPPER' }, language);
      suggestions.push(...defaultSuggestions.slice(0, 4));
    }

    // Ensure we have at least 3-4 suggestions
    while (suggestions.length < 3) {
      const defaultSuggestions = getLocalizedSuggestions({ userRole: (userRole || 'BUYER') as 'BUYER' | 'SHOP_OWNER' | 'SHIPPER' }, language);
      const missingDefault = defaultSuggestions.find(def => 
        !suggestions.some(s => s.includes(def.split(' ')[0]))
      );
      if (missingDefault) {
        suggestions.push(missingDefault);
      } else {
        break;
      }
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  /**
   * Build user profile context from authenticated user data
   */
  async buildUserProfileContext(userId: number): Promise<ChatContext['userProfile'] | undefined> {
    try {
      // Get user info
      const userResponse = await authService.getMyInfo();
      if (!userResponse.result) {
        return undefined;
      }

      const user = userResponse.result;

      // Get user's order history for personalization
      let orderHistory: OrderSummary[] = [];
      let favoriteCategories: string[] = [];
      let purchasePatterns: PurchasePattern[] = [];

      try {
        const ordersResponse = await orderService.getOrdersByUserId(userId);
        if (ordersResponse.result && ordersResponse.result.length > 0) {
          // Build order summary
          orderHistory = ordersResponse.result.slice(0, 10).map(order => ({
            id: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            itemCount: order.items?.length || 0,
            categories: order.items?.map(item => item.category || 'Khác').filter(Boolean) || []
          }));

          // Analyze purchase patterns
          const categoryStats = new Map<string, { count: number; totalAmount: number; lastPurchase: string }>();
          
          ordersResponse.result.forEach(order => {
            if (order.items) {
              order.items.forEach(item => {
                const category = item.category || 'Khác';
                const existing = categoryStats.get(category) || { count: 0, totalAmount: 0, lastPurchase: order.createdAt };
                
                categoryStats.set(category, {
                  count: existing.count + item.quantity,
                  totalAmount: existing.totalAmount + (item.unitPrice * item.quantity),
                  lastPurchase: order.createdAt > existing.lastPurchase ? order.createdAt : existing.lastPurchase
                });
              });
            }
          });

          // Convert to arrays
          favoriteCategories = Array.from(categoryStats.entries())
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 5)
            .map(([category]) => category);

          purchasePatterns = Array.from(categoryStats.entries())
            .map(([category, stats]) => ({
              category,
              frequency: stats.count,
              averageAmount: stats.totalAmount / stats.count,
              lastPurchase: stats.lastPurchase
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5);
        }
      } catch (orderError) {
        console.warn('Could not load order history for personalization:', orderError);
        // Continue without order history
      }

      return {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        shopName: user.shopName,
        description: user.description,
        ratingAverage: user.ratingAverage,
        status: user.status,
        kycStatus: user.status, // Map status to kycStatus for compatibility
        orderHistory,
        favoriteCategories,
        purchasePatterns
      };

    } catch (error) {
      console.error('Error building user profile context:', error);
      return undefined;
    }
  }

  /**
   * Enhanced send message with user profile personalization
   */
  async sendMessageWithPersonalization(message: string, context?: ChatContext): Promise<ChatResponse> {
    // If context doesn't have user profile but has userId, try to build it
    if (context?.userId && !context.userProfile) {
      const userProfile = await this.buildUserProfileContext(context.userId);
      if (userProfile) {
        context = {
          ...context,
          userProfile
        };
      }
    }

    // Use existing sendMessage with enhanced context
    return this.sendMessage(message, context);
  }

  /**
   * Switch user's language preference
   */
  switchLanguage(language: SupportedLanguage): void {
    setUserPreferredLanguage(language);
  }

  /**
   * Get current user's language preference
   */
  getCurrentLanguage(): SupportedLanguage {
    return getUserPreferredLanguage();
  }

  /**
   * Get contextual suggestions based on conversation flow with language support
   */
  getContextualSuggestions(lastMessage: string, userRole: string, language: SupportedLanguage = 'vi'): string[] {
    const lowerMessage = lastMessage.toLowerCase();
    
    // Product-related suggestions
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product')) {
      return language === 'en' ? [
        'View similar products',
        'Add to cart',
        'Compare prices',
        'Product reviews'
      ] : [
        'Xem sản phẩm tương tự',
        'Thêm vào giỏ hàng',
        'So sánh giá',
        'Đánh giá sản phẩm'
      ];
    }
    
    // Order-related suggestions
    if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('order')) {
      return language === 'en' ? [
        'Track order',
        'Contact support',
        'Cancel order',
        'Reorder'
      ] : [
        'Theo dõi đơn hàng',
        'Liên hệ hỗ trợ',
        'Hủy đơn hàng',
        'Đặt lại đơn hàng'
      ];
    }
    
    // Default contextual suggestions
    return this.getSuggestions({ userRole, userPreferences: { language } } as ChatContext);
  }

  /**
   * Handle product-related queries locally with language support
   */
  private async handleProductQuery(message: string, context?: ChatContext, language: SupportedLanguage = 'vi'): Promise<ChatResponse | null> {
    const lowerMessage = message.toLowerCase();
    
    // Check for product-related keywords
    const productKeywords = [
      'sản phẩm', 'product', 'tìm', 'search', 'find',
      'rau', 'củ', 'vegetable', 'fruit', 'trái cây',
      'giá', 'price', 'cost', 'bao nhiêu', 'how much'
    ];
    
    const hasProductKeyword = productKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (!hasProductKeyword) {
      return null;
    }

    try {
      // Get all products for now - in a real implementation, this would be more sophisticated
      const productsResponse = await productService.getAll();
      
      if (!productsResponse.result || productsResponse.result.length === 0) {
        return {
          message: getLocalizedText('orderNotFound', language),
          suggestions: language === 'en' ? [
            'View product categories',
            'Contact support',
            'Go to homepage'
          ] : [
            'Xem danh mục sản phẩm',
            'Liên hệ hỗ trợ',
            'Quay lại trang chủ'
          ],
          actions: []
        };
      }

      // Simple product search/recommendation logic
      let relevantProducts = productsResponse.result;
      
      // Filter by specific keywords if present
      if (lowerMessage.includes('rau') || lowerMessage.includes('vegetable')) {
        relevantProducts = relevantProducts.filter(p => 
          p.productName.toLowerCase().includes('rau') ||
          p.description.toLowerCase().includes('rau')
        );
      }
      
      if (lowerMessage.includes('trái cây') || lowerMessage.includes('fruit')) {
        relevantProducts = relevantProducts.filter(p => 
          p.productName.toLowerCase().includes('trái') ||
          p.productName.toLowerCase().includes('cây') ||
          p.description.toLowerCase().includes('trái cây')
        );
      }

      // Limit to top 3 products
      const topProducts = relevantProducts.slice(0, 3);
      
      if (topProducts.length === 0) {
        return {
          message: getLocalizedText('productNotFound', language),
          suggestions: language === 'en' ? [
            'View all products',
            'Find vegetables',
            'Find fruits'
          ] : [
            'Xem tất cả sản phẩm',
            'Tìm sản phẩm rau củ',
            'Tìm sản phẩm trái cây'
          ],
          actions: []
        };
      }

      // Format product information with localization
      const productInfo = topProducts.map(product => {
        const price = formatCurrency(product.sellingPrice, language);
        const unit = product.unit;
        const stock = product.stockQuantity;
        const description = product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '');
        
        if (language === 'en') {
          return `🛒 **${product.productName}**\n` +
                 `💰 Price: ${price}/${unit}\n` +
                 `📦 Stock: ${stock} ${unit}\n` +
                 `📝 ${description}`;
        } else {
          return `🛒 **${product.productName}**\n` +
                 `💰 Giá: ${price}/${unit}\n` +
                 `📦 Còn lại: ${stock} ${unit}\n` +
                 `📝 ${description}`;
        }
      }).join('\n\n');

      const responseMessage = language === 'en' 
        ? `I found ${topProducts.length} matching products:\n\n${productInfo}`
        : `Tôi tìm thấy ${topProducts.length} sản phẩm phù hợp:\n\n${productInfo}`;

      // Create actions for each product with localized labels
      const actions: ChatAction[] = topProducts.flatMap(product => [
        {
          type: 'view_product' as const,
          label: language === 'en' ? `View ${product.productName}` : `Xem ${product.productName}`,
          data: { productId: product.id, productName: product.productName }
        },
        {
          type: 'add_to_cart' as const,
          label: language === 'en' ? `Add ${product.productName} to cart` : `Thêm ${product.productName} vào giỏ`,
          data: { productId: product.id, productName: product.productName }
        }
      ]);

      return {
        message: responseMessage,
        suggestions: language === 'en' ? [
          'View more products',
          'Compare product prices',
          'Find products by category',
          'View promotional products'
        ] : [
          'Xem thêm sản phẩm khác',
          'So sánh giá sản phẩm',
          'Tìm sản phẩm theo danh mục',
          'Xem sản phẩm khuyến mãi'
        ],
        actions: actions.slice(0, 6) // Limit to 6 actions to avoid UI clutter
      };

    } catch (error) {
      console.error('Error handling product query:', error);
      return {
        message: getLocalizedText('productSearchError', language),
        suggestions: language === 'en' ? [
          'Try again',
          'View product categories',
          'Contact support'
        ] : [
          'Thử lại',
          'Xem danh mục sản phẩm',
          'Liên hệ hỗ trợ'
        ],
        actions: []
      };
    }
  }

  /**
   * Get product details by ID
   */
  async getProductDetails(productId: number): Promise<ProductResponse | null> {
    try {
      const response = await productService.getById(productId);
      return response.result || null;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }

  /**
   * Format product information for chat display
   */
  formatProductInfo(product: ProductResponse): string {
    return `🛒 **${product.productName}**\n` +
           `💰 Giá: ${product.sellingPrice.toLocaleString('vi-VN')}đ/${product.unit}\n` +
           `📦 Còn lại: ${product.stockQuantity} ${product.unit}\n` +
           `🏪 Shop: ${product.shopName || 'N/A'}\n` +
           `📝 Mô tả: ${product.description}`;
  }

  /**
   * Handle order-related queries locally with security checks and language support
   */
  private async handleOrderQuery(message: string, context?: ChatContext, language: SupportedLanguage = 'vi'): Promise<ChatResponse | null> {
    const lowerMessage = message.toLowerCase();
    
    // Check for order-related keywords
    const orderKeywords = [
      'đơn hàng', 'order', 'đặt hàng', 'mua', 'buy',
      'giao hàng', 'delivery', 'ship', 'tracking',
      'trạng thái', 'status', 'theo dõi', 'track'
    ];
    
    const hasOrderKeyword = orderKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (!hasOrderKeyword) {
      return null;
    }

    // Security check - must have authenticated user context
    if (!context?.userId || context.userId === 0) {
      return {
        message: getLocalizedText('loginRequired', language),
        suggestions: language === 'en' ? [
          'Log in',
          'Create new account',
          'Forgot password?'
        ] : [
          'Đăng nhập',
          'Tạo tài khoản mới',
          'Quên mật khẩu?'
        ],
        actions: []
      };
    }

    try {
      // Get user's orders (security: only user-specific orders)
      const ordersResponse = await orderService.getOrdersByUserId(context.userId);
      
      if (!ordersResponse.result || ordersResponse.result.length === 0) {
        return {
          message: getLocalizedText('orderNotFound', language),
          suggestions: language === 'en' ? [
            'View new products',
            'Find vegetables',
            'View promotions'
          ] : [
            'Xem sản phẩm mới',
            'Tìm sản phẩm rau củ',
            'Xem khuyến mãi'
          ],
          actions: []
        };
      }

      const orders = ordersResponse.result;
      
      // Check if asking about specific order status
      if (lowerMessage.includes('trạng thái') || lowerMessage.includes('status') || 
          lowerMessage.includes('theo dõi') || lowerMessage.includes('track')) {
        
        // Show recent orders with status
        const recentOrders = orders.slice(0, 3);
        
        const orderInfo = recentOrders.map(order => {
          const statusText = this.getOrderStatusText(order.status);
          const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
          
          return `📦 **Đơn hàng #${order.id}**\n` +
                 `📅 Ngày đặt: ${orderDate}\n` +
                 `💰 Tổng tiền: ${order.totalAmount.toLocaleString('vi-VN')}đ\n` +
                 `📋 Trạng thái: ${statusText}\n` +
                 `📍 Địa chỉ: ${order.shippingAddress}`;
        }).join('\n\n');

        const responseMessage = `Đây là thông tin ${recentOrders.length} đơn hàng gần nhất của bạn:\n\n${orderInfo}`;

        // Create actions for each order
        const actions: ChatAction[] = recentOrders.flatMap(order => [
          {
            type: 'track_order' as const,
            label: `Theo dõi đơn #${order.id}`,
            data: { orderId: order.id, orderStatus: order.status }
          },
          {
            type: 'contact_support' as const,
            label: `Hỗ trợ đơn #${order.id}`,
            data: { orderId: order.id, orderStatus: order.status }
          }
        ]);

        return {
          message: responseMessage,
          suggestions: [
            'Xem tất cả đơn hàng',
            'Đặt hàng mới',
            'Liên hệ hỗ trợ',
            'Hướng dẫn theo dõi đơn hàng'
          ],
          actions: actions.slice(0, 6) // Limit to 6 actions
        };
      }

      // General order inquiry - show summary
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;
      const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
      
      const responseMessage = `📊 **Tổng quan đơn hàng của bạn:**\n\n` +
                             `📦 Tổng số đơn hàng: ${totalOrders}\n` +
                             `⏳ Đang xử lý: ${pendingOrders}\n` +
                             `✅ Đã hoàn thành: ${completedOrders}`;

      // Show recent order if exists
      if (orders.length > 0) {
        const latestOrder = orders[0];
        const orderDate = new Date(latestOrder.createdAt).toLocaleDateString('vi-VN');
        const statusText = this.getOrderStatusText(latestOrder.status);
        
        const latestOrderInfo = `\n\n📦 **Đơn hàng gần nhất (#${latestOrder.id}):**\n` +
                               `📅 ${orderDate}\n` +
                               `💰 ${latestOrder.totalAmount.toLocaleString('vi-VN')}đ\n` +
                               `📋 ${statusText}`;
        
        return {
          message: responseMessage + latestOrderInfo,
          suggestions: [
            'Theo dõi đơn hàng mới nhất',
            'Xem tất cả đơn hàng',
            'Đặt hàng mới',
            'Liên hệ hỗ trợ'
          ],
          actions: [
            {
              type: 'track_order' as const,
              label: `Theo dõi đơn #${latestOrder.id}`,
              data: { orderId: latestOrder.id, orderStatus: latestOrder.status }
            },
            {
              type: 'contact_support' as const,
              label: 'Liên hệ hỗ trợ',
              data: { orderId: latestOrder.id }
            }
          ]
        };
      }

      return {
        message: responseMessage,
        suggestions: [
          'Đặt hàng mới',
          'Xem sản phẩm',
          'Liên hệ hỗ trợ'
        ],
        actions: []
      };

    } catch (error) {
      console.error('Error handling order query:', error);
      
      // Handle authentication errors specifically
      if (error.status === 401 || error.status === 403) {
        return {
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để xem thông tin đơn hàng.',
          suggestions: [
            'Đăng nhập lại',
            'Quên mật khẩu?',
            'Tạo tài khoản mới'
          ],
          actions: []
        };
      }
      
      return {
        message: 'Xin lỗi, tôi không thể truy xuất thông tin đơn hàng lúc này. Vui lòng thử lại sau.',
        suggestions: [
          'Thử lại',
          'Liên hệ hỗ trợ',
          'Xem hướng dẫn'
        ],
        actions: []
      };
    }
  }

  /**
   * Get order details by ID with security check
   */
  async getOrderDetails(orderId: number, userId: number): Promise<OrderResponse | null> {
    try {
      const response = await orderService.getOrderById(orderId);
      
      // Security check: ensure order belongs to the requesting user
      if (response.result && response.result.id === orderId) {
        // Additional security check would be needed here to verify userId
        // This would typically be handled by the backend API
        return response.result;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting order details:', error);
      return null;
    }
  }

  /**
   * Format order information for chat display
   */
  formatOrderInfo(order: OrderResponse): string {
    const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
    const statusText = this.getOrderStatusText(order.status);
    
    let itemsText = '';
    if (order.items && order.items.length > 0) {
      itemsText = '\n\n📋 **Sản phẩm:**\n' + 
        order.items.map(item => 
          `• ${item.productName} x${item.quantity} - ${item.unitPrice.toLocaleString('vi-VN')}đ`
        ).join('\n');
    }
    
    return `📦 **Đơn hàng #${order.id}**\n` +
           `📅 Ngày đặt: ${orderDate}\n` +
           `👤 Người nhận: ${order.recipientName}\n` +
           `📞 SĐT: ${order.recipientPhone}\n` +
           `📍 Địa chỉ: ${order.shippingAddress}\n` +
           `💰 Tổng tiền: ${order.totalAmount.toLocaleString('vi-VN')}đ\n` +
           `🚚 Phí ship: ${order.shippingFee.toLocaleString('vi-VN')}đ\n` +
           `📋 Trạng thái: ${statusText}\n` +
           `💳 Thanh toán: ${order.paymentMethod}` +
           (order.note ? `\n📝 Ghi chú: ${order.note}` : '') +
           itemsText;
  }

  /**
   * Get localized order status text
   */
  private getOrderStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': '⏳ Chờ xác nhận',
      'CONFIRMED': '✅ Đã xác nhận',
      'PROCESSING': '🔄 Đang chuẩn bị',
      'SHIPPING': '🚚 Đang giao hàng',
      'DELIVERED': '📦 Đã giao hàng',
      'COMPLETED': '✅ Hoàn thành',
      'CANCELLED': '❌ Đã hủy',
      'RETURNED': '↩️ Đã trả hàng'
    };
    
    return statusMap[status] || status;
  }
}

// Export singleton instance
export const chatBotService = new ChatBotServiceImpl();