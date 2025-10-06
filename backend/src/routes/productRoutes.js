const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getGoldPrice,
  getProductStats,
  getSortedProducts
} = require('../controllers/productController');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listele
 *     description: Filtreleme, sıralama ve sayfalama ile ürün listesi
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum fiyat
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maksimum fiyat
 *       - in: query
 *         name: minPopularity
 *         schema:
 *           type: number
 *         description: Minimum popülerlik skoru (1-5)
 *       - in: query
 *         name: maxPopularity
 *         schema:
 *           type: number
 *         description: Maksimum popülerlik skoru (1-5)
 *       - in: query
 *         name: minWeight
 *         schema:
 *           type: number
 *         description: Minimum ağırlık (gram)
 *       - in: query
 *         name: maxWeight
 *         schema:
 *           type: number
 *         description: Maksimum ağırlık (gram)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına ürün sayısı
 *     responses:
 *       200:
 *         description: Başarılı response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         products:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 *                         total:
 *                           type: integer
 *                           description: Toplam ürün sayısı
 *                         page:
 *                           type: integer
 *                           description: Mevcut sayfa
 *                         limit:
 *                           type: integer
 *                           description: Sayfa başına ürün sayısı
 *                         totalPages:
 *                           type: integer
 *                           description: Toplam sayfa sayısı
 *                         hasNextPage:
 *                           type: boolean
 *                           description: Sonraki sayfa var mı
 *                         hasPrevPage:
 *                           type: boolean
 *                           description: Önceki sayfa var mı
 *       400:
 *         description: Geçersiz parametreler
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/products/sort:
 *   get:
 *     summary: Ürünleri sırala
 *     description: Ürünleri belirtilen kriterlere göre sıralar
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [price_high_to_low, price_low_to_high, most_popular, new]
 *         description: Kullanıcı dostu sıralama türü (new: tarihe göre sıralar, yeniden eskiye)
 *         example: price_high_to_low
 *     responses:
 *       200:
 *         description: Başarılı response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 sortType:
 *                   type: string
 *       400:
 *         description: Geçersiz parametreler
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/products', getProducts);
router.get('/products/sort', getSortedProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID veya isim ile ürün arama
 *     description: ID veya isim ile ürün detaylarını getirir
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID (sayı) veya ürün adı (metin)
 *     responses:
 *       200:
 *         description: Başarılı response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Geçersiz ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/products/:id', getProductById);

/**
 * @swagger
 * /api/gold-price:
 *   get:
 *     summary: Güncel altın fiyatı
 *     description: Gerçek zamanlı altın fiyatını getir
 *     tags: [Gold Price]
 *     responses:
 *       200:
 *         description: Başarılı response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         price:
 *                           type: number
 *                           description: Altın fiyatı (USD/gram)
 *                           example: 126.08
 *                         currency:
 *                           type: string
 *                           example: USD
 *                         unit:
 *                           type: string
 *                           example: per gram
 *                         lastUpdated:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-06T03:16:28.608Z"
 *                         cache:
 *                           type: object
 *                           properties:
 *                             cached:
 *                               type: boolean
 *                               example: true
 *                             price:
 *                               type: number
 *                               example: 126.08
 *                             timestamp:
 *                               type: number
 *                               example: 1759720588608
 *                             age:
 *                               type: number
 *                               example: 0
 *                             expiresIn:
 *                               type: number
 *                               example: 300000
 *             examples:
 *               success:
 *                 summary: Başarılı altın fiyatı response
 *                 value:
 *                   success: true
 *                   data:
 *                     price: 126.08
 *                     currency: "USD"
 *                     unit: "per gram"
 *                     lastUpdated: "2025-10-06T03:16:28.608Z"
 *                     cache:
 *                       cached: true
 *                       price: 126.08
 *                       timestamp: 1759720588608
 *                       age: 0
 *                       expiresIn: 300000
 */
router.get('/gold-price', getGoldPrice);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Ürün istatistikleri
 *     description: Ürünler hakkında istatistiksel bilgiler
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Başarılı response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalProducts:
 *                           type: integer
 *                         priceRange:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                             avg:
 *                               type: number
 *                         popularityRange:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                             avg:
 *                               type: number
 *                         weightRange:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                             avg:
 *                               type: number
 */
router.get('/stats', getProductStats);

module.exports = router;
