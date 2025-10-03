const fs = require('fs').promises;
const path = require('path');

class ProductService {
  constructor() {
    this.productsPath = path.join(__dirname, '../../data/products.json');
    this.products = [];
    this.lastLoadTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 dakika
  }

  async loadProducts() {
    try {
      // Cache kontrolü
      if (this.products.length > 0 && this.lastLoadTime && 
          Date.now() - this.lastLoadTime < this.cacheTimeout) {
        return this.products;
      }

      console.log('📦 Loading products from JSON file...');
      const data = await fs.readFile(this.productsPath, 'utf8');
      this.products = JSON.parse(data);
      
      // Eğer ID yoksa index'e göre ID ekle
      this.products = this.products.map((product, index) => ({
        id: index + 1,
        ...product
      }));
      
      this.lastLoadTime = Date.now();
      console.log(`✅ Loaded ${this.products.length} products`);
      
      return this.products;
    } catch (error) {
      console.error('❌ Error loading products:', error);
      throw new Error('Ürünler yüklenemedi');
    }
  }

  async getAllProducts() {
    return await this.loadProducts();
  }

  async getProductById(id) {
    const products = await this.loadProducts();
    const product = products.find(p => p.id === parseInt(id));
    return product || null;
  }

  filterProducts(products, filters) {
    let filteredProducts = [...products];

    // Fiyat aralığı filtresi
    if (filters.minPrice || filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.calculatedPrice;
        if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
        return true;
      });
    }

    // Popülerlik skoru filtresi
    if (filters.minPopularity || filters.maxPopularity) {
      filteredProducts = filteredProducts.filter(product => {
        const rating = product.popularityRating;
        if (filters.minPopularity && rating < parseFloat(filters.minPopularity)) return false;
        if (filters.maxPopularity && rating > parseFloat(filters.maxPopularity)) return false;
        return true;
      });
    }

    // Ağırlık filtresi
    if (filters.minWeight || filters.maxWeight) {
      filteredProducts = filteredProducts.filter(product => {
        const weight = product.weight;
        if (filters.minWeight && weight < parseFloat(filters.minWeight)) return false;
        if (filters.maxWeight && weight > parseFloat(filters.maxWeight)) return false;
        return true;
      });
    }


    return filteredProducts;
  }

  sortProducts(products, sortCriteria) {
    const sortedProducts = [...products];

    // Eğer sortCriteria string ise (eski format), dönüştür
    if (typeof sortCriteria === 'string') {
      sortCriteria = [{ field: sortCriteria, order: 'asc' }];
    }

    // Eğer sortCriteria array değilse, varsayılan sıralama
    if (!Array.isArray(sortCriteria) || sortCriteria.length === 0) {
      return sortedProducts.sort((a, b) => a.id - b.id);
    }

    // Çoklu kriter sıralama
    sortedProducts.sort((a, b) => {
      for (const criteria of sortCriteria) {
        const { field, order = 'asc' } = criteria;
        let comparison = 0;

        switch (field) {
          case 'price':
            comparison = a.calculatedPrice - b.calculatedPrice;
            break;
          case 'popularity':
            comparison = a.popularityRating - b.popularityRating;
            break;
          case 'weight':
            comparison = a.weight - b.weight;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'id':
            comparison = a.id - b.id;
            break;
          default:
            continue; // Bilinmeyen field'ı atla
        }

        // Eğer bu kriterde eşitlik varsa, bir sonraki kritere geç
        if (comparison !== 0) {
          return order === 'desc' ? -comparison : comparison;
        }
      }
      
      // Tüm kriterlerde eşitlik varsa, ID'ye göre sırala
      return a.id - b.id;
    });

    return sortedProducts;
  }

  getCacheInfo() {
    return {
      productsCount: this.products.length,
      lastLoadTime: this.lastLoadTime,
      cacheAge: this.lastLoadTime ? Date.now() - this.lastLoadTime : null,
      cacheExpiresIn: this.lastLoadTime ? 
        this.cacheTimeout - (Date.now() - this.lastLoadTime) : null
    };
  }

  clearCache() {
    this.products = [];
    this.lastLoadTime = null;
    console.log('🗑️ Product cache cleared');
  }
}

module.exports = new ProductService();
