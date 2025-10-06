const goldPriceService = require('./goldPriceService');

class PriceCalculationService {
  constructor() {
    this.goldPriceService = goldPriceService;
  }

  async calculatePrice(product) {
    try {
      const goldPrice = await this.goldPriceService.getCurrentPrice();
      
      // Fiyat hesaplama formülü: (popularityScore + 1) * weight * goldPrice
      const calculatedPrice = (product.popularityScore + 1) * product.weight * goldPrice;
      
      // 2 ondalık basamağa yuvarla
      const roundedPrice = Math.round(calculatedPrice * 100) / 100;
      
      return {
        ...product,
        calculatedPrice: roundedPrice,
        popularityRating: this.convertToFivePointScale(product.popularityScore),
        isNew: this.isProductNew(product.dateAdded),
        goldPrice: goldPrice
      };
    } catch (error) {
      console.error('Price calculation error:', error);
      throw new Error('Fiyat hesaplama hatası');
    }
  }

  convertToFivePointScale(popularityScore) {
    // 0-1 arası değeri 5 puanlık sisteme dönüştür
    const rating = popularityScore * 5;
    return parseFloat(rating.toFixed(1));
  }

  isProductNew(dateAdded) {
    // Son 6 ay içinde eklenmiş mi kontrol et
    if (!dateAdded) return false;
    
    const productDate = new Date(dateAdded);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return productDate >= sixMonthsAgo;
  }

  async calculatePricesForProducts(products) {
    try {
      const goldPrice = await this.goldPriceService.getCurrentPrice();
      
      return products.map(product => {
        const calculatedPrice = (product.popularityScore + 1) * product.weight * goldPrice;
        const roundedPrice = Math.round(calculatedPrice * 100) / 100;
        
        return {
          ...product,
          calculatedPrice: roundedPrice,
          popularityRating: this.convertToFivePointScale(product.popularityScore),
          isNew: this.isProductNew(product.dateAdded),
          goldPrice: goldPrice
        };
      });
    } catch (error) {
      console.error('Bulk price calculation error:', error);
      throw new Error('Toplu fiyat hesaplama hatası');
    }
  }
}

module.exports = new PriceCalculationService();
