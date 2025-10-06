const productService = require('../services/productService');
const priceCalculationService = require('../services/priceCalculationService');

const getProducts = async (req, res, next) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      minPopularity, 
      maxPopularity,
      minWeight,
      maxWeight,
      page = 1,
      limit = 10
    } = req.query;
    
    // Ürünleri yükle
    let products = await productService.getAllProducts();
    
    // Fiyat hesaplama
    products = await priceCalculationService.calculatePricesForProducts(products);
    
    // Filtreleme
    const filters = { 
      minPrice, 
      maxPrice, 
      minPopularity, 
      maxPopularity,
      minWeight,
      maxWeight
    };
    products = productService.filterProducts(products, filters);
    
    // Sayfalama
    const total = products.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0
      },
      filters: Object.keys(filters).reduce((acc, key) => {
        if (filters[key]) acc[key] = filters[key];
        return acc;
      }, {})
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let product = null;
    const products = await productService.getAllProducts();
    
    // 5 haneli sayı girilirse ID araması yap
    if (!isNaN(id) && id.toString().length === 5) {
      product = await productService.getProductById(parseInt(id));
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: 'Ürün bulunamadı'
          }
        });
      }
      
      const calculatedProduct = await priceCalculationService.calculatePrice(product);
      
      return res.json({
        success: true,
        data: calculatedProduct
      });
    }
    
    // Diğer durumlar: isim araması yap (sayı veya metin olabilir)
    const searchTerm = id.toLowerCase();
    
    // Tüm eşleşen ürünleri bul
    const matchingProducts = products.filter(p => {
      const productName = p.name.toLowerCase();
      
      // Tam eşleşme
      if (productName === searchTerm) return true;
      
      // Başlangıç eşleşmesi
      if (productName.startsWith(searchTerm)) return true;
      
      // İçerik eşleşmesi
      if (productName.includes(searchTerm)) return true;
      
      return false;
    });
    
    // Eşleşen ürün varsa tümünü döndür
    if (matchingProducts.length > 0) {
      // Fiyat hesaplama
      const calculatedProducts = await priceCalculationService.calculatePricesForProducts(matchingProducts);
      
      return res.json({
        success: true,
        data: calculatedProducts,
        total: calculatedProducts.length
      });
    }
    
    // Hiç eşleşme yoksa
    return res.status(404).json({
      success: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: 'Ürün bulunamadı'
      }
    });
  } catch (error) {
    next(error);
  }
};

const getGoldPrice = async (req, res, next) => {
  try {
    const goldPriceService = require('../services/goldPriceService');
    const price = await goldPriceService.getCurrentPrice();
    const cacheInfo = goldPriceService.getCacheInfo();
    
    res.json({
      success: true,
      data: {
        price: price,
        currency: 'USD',
        unit: 'per gram',
        lastUpdated: new Date().toISOString(),
        cache: cacheInfo
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductStats = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    const productsWithPrices = await priceCalculationService.calculatePricesForProducts(products);
    
    const stats = {
      totalProducts: products.length,
      priceRange: {
        min: Math.min(...productsWithPrices.map(p => p.calculatedPrice)),
        max: Math.max(...productsWithPrices.map(p => p.calculatedPrice)),
        avg: productsWithPrices.reduce((sum, p) => sum + p.calculatedPrice, 0) / products.length
      },
      popularityRange: {
        min: Math.min(...productsWithPrices.map(p => p.popularityRating)),
        max: Math.max(...productsWithPrices.map(p => p.popularityRating)),
        avg: productsWithPrices.reduce((sum, p) => sum + p.popularityRating, 0) / products.length
      },
      weightRange: {
        min: Math.min(...products.map(p => p.weight)),
        max: Math.max(...products.map(p => p.weight)),
        avg: products.reduce((sum, p) => sum + p.weight, 0) / products.length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getSortedProducts = async (req, res, next) => {
  try {
    const { sortType } = req.query;
    
    // Ürünleri yükle
    let products = await productService.getAllProducts();
    
    // Fiyat hesaplama
    products = await priceCalculationService.calculatePricesForProducts(products);
    
    // Sıralama
    let sortCriteria = null;
    
    if (sortType) {
      // Kullanıcı dostu sıralama türleri
      switch (sortType) {
        case 'price_high_to_low':
          sortCriteria = [{ field: 'calculatedPrice', order: 'desc' }];
          break;
        case 'price_low_to_high':
          sortCriteria = [{ field: 'calculatedPrice', order: 'asc' }];
          break;
        case 'most_popular':
          sortCriteria = [{ field: 'popularityRating', order: 'desc' }];
          break;
        case 'new':
          // Tüm ürünleri tarihe göre sırala (yeniden eskiye)
          sortCriteria = [{ field: 'dateAdded', order: 'desc' }];
          break;
        default:
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_SORT_TYPE',
              message: 'Geçersiz sıralama türü. Desteklenen türler: price_high_to_low, price_low_to_high, most_popular, new'
            }
          });
      }
    }
    
    if (sortCriteria) {
      products = productService.sortProducts(products, sortCriteria);
    }
    
    res.json({
      success: true,
      data: products,
      total: products.length,
      sortType: sortType || null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getGoldPrice,
  getProductStats,
  getSortedProducts
};
