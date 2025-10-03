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
