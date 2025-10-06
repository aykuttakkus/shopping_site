const axios = require('axios');

class GoldPriceService {
  constructor() {
    this.apiKey = process.env.GOLD_PRICE_API_KEY || 'cfd0ef189253d11c9c6c5e6c56d13d33';
    this.apiUrl = process.env.GOLD_PRICE_API_URL || 'http://api.exchangerate.host/live';
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
      
      // Exchangerate.host API kullanarak altın fiyatını çek
      const response = await axios.get(`${this.apiUrl}?access_key=${this.apiKey}`, {
        timeout: 10000
      });
      
      // XAU (altın) fiyatını al - USDXAU formatında
      const goldPricePerOunce = response.data.quotes?.USDXAU;
      
      if (!goldPricePerOunce) {
        throw new Error('Gold price not found in API response');
      }
      
      // USDXAU değeri 1 USD'nin kaç ons altın alabileceğini gösterir
      // 1 ons altın fiyatı = 1 / USDXAU
      const actualGoldPricePerOunce = 1 / goldPricePerOunce;
      
      // 1 ons = 31.1035 gram, gram başına fiyatı hesapla
      const pricePerGram = actualGoldPricePerOunce / 31.1035;
      
      // 2 ondalık basamağa yuvarla
      const roundedPrice = Math.round(pricePerGram * 100) / 100;
      
      this.cache.set(cacheKey, {
        price: roundedPrice,
        timestamp: Date.now()
      });
      
      console.log(`1 Ons Altın Fiyatı (USD): ${actualGoldPricePerOunce.toFixed(2)}`);
      console.log(`✅ Gold price updated: $${roundedPrice}/gram`);
      return roundedPrice;
    } catch (error) {
      console.error('❌ Gold price API error:', error.message);
      throw new Error('Altın fiyatı alınamadı');
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
