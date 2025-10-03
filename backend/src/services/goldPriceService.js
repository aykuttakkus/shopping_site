const axios = require('axios');

class GoldPriceService {
  constructor() {
    this.apiKey = process.env.GOLD_PRICE_API_KEY;
    this.apiUrl = process.env.GOLD_PRICE_API_URL || 'https://api.metals.live/v1/spot/gold';
    this.cache = new Map();
    this.cacheTimeout = parseInt(process.env.CACHE_TIMEOUT) || 5 * 60 * 1000; // 5 dakika
  }

  async getCurrentPrice() {
    const cacheKey = 'gold_price';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📊 Gold price served from cache');
      return cached.price;
    }

    try {
      console.log('🔄 Fetching gold price from API...');
      
      // Mock response for development (gerçek API key yoksa)
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        console.log('⚠️ Using mock gold price for development');
        const mockPrice = 65.50;
        this.cache.set(cacheKey, {
          price: mockPrice,
          timestamp: Date.now()
        });
        return mockPrice;
      }

      const response = await axios.get(this.apiUrl, {
        headers: { 
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      const price = response.data.price || response.data.spot || 65.50;
      
      this.cache.set(cacheKey, {
        price,
        timestamp: Date.now()
      });
      
      console.log(`✅ Gold price updated: $${price}/gram`);
      return price;
    } catch (error) {
      console.error('❌ Gold price API error:', error.message);
      
      // Fallback price
      const fallbackPrice = 65.50;
      console.log(`🔄 Using fallback price: $${fallbackPrice}/gram`);
      
      this.cache.set(cacheKey, {
        price: fallbackPrice,
        timestamp: Date.now()
      });
      
      return fallbackPrice;
    }
  }

  getCacheInfo() {
    const cacheKey = 'gold_price';
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      return { cached: false };
    }

    return {
      cached: true,
      price: cached.price,
      timestamp: cached.timestamp,
      age: Date.now() - cached.timestamp,
      expiresIn: this.cacheTimeout - (Date.now() - cached.timestamp)
    };
  }

  clearCache() {
    this.cache.clear();
    console.log('🗑️ Gold price cache cleared');
  }
}

module.exports = new GoldPriceService();
