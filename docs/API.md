# API Dokümantasyonu

Bu dokümantasyon, takı ürün listeleme uygulamasının backend API'sini açıklar.

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### 1. Tüm Ürünleri Listele
```http
GET /products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Engagement Ring 1",
      "popularityScore": 0.85,
      "weight": 2.1,
      "images": {
        "yellow": "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-Y.jpg?v=1696588368",
        "rose": "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-R.jpg?v=1696588406",
        "white": "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-W.jpg?v=1696588402"
      },
      "calculatedPrice": 1250.50,
      "popularityRating": 4.3
    }
  ],
  "total": 8
}
```

### 2. Belirli Ürün Detayı
```http
GET /products/:id
```

**Parameters:**
- `id` (number): Ürün ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Engagement Ring 1",
    "popularityScore": 0.85,
    "weight": 2.1,
    "images": {
      "yellow": "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-Y.jpg?v=1696588368",
      "rose": "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-R.jpg?v=1696588406",
      "white": "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-W.jpg?v=1696588402"
    },
    "calculatedPrice": 1250.50,
    "popularityRating": 4.3
  }
}
```

### 3. Fiyat Aralığına Göre Filtrele
```http
GET /products?minPrice=100&maxPrice=500
```

**Query Parameters:**
- `minPrice` (number): Minimum fiyat
- `maxPrice` (number): Maksimum fiyat

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 5,
  "filters": {
    "minPrice": 100,
    "maxPrice": 500
  }
}
```

### 4. Popülerlik Skoruna Göre Filtrele
```http
GET /products?minPopularity=3&maxPopularity=5
```

**Query Parameters:**
- `minPopularity` (number): Minimum popülerlik skoru (1-5)
- `maxPopularity` (number): Maksimum popülerlik skoru (1-5)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 3,
  "filters": {
    "minPopularity": 3,
    "maxPopularity": 5
  }
}
```

### 5. Güncel Altın Fiyatı
```http
GET /gold-price
```

**Response:**
```json
{
  "success": true,
  "data": {
    "price": 126.08,
    "currency": "USD",
    "unit": "per gram",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

## Hata Yönetimi

### Hata Formatı
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Ürün bulunamadı",
    "details": "ID: 999 olan ürün mevcut değil"
  }
}
```

### HTTP Status Kodları
- `200` - Başarılı
- `400` - Geçersiz istek
- `404` - Bulunamadı
- `500` - Sunucu hatası

## Fiyat Hesaplama

### Formül
```
Fiyat = (popülerlikSkoru + 1) × ağırlık × altınFiyatı
```

### Örnek Hesaplama
Engagement Ring 1 için hesaplama:
- Popülerlik skoru: 0.85 (85%)
- Ağırlık: 2.1 gram
- Altın fiyatı: $126.08/gram
- Hesaplama: (0.85 + 1) × 2.1 × 126.08 = $489.82

## Popülerlik Skoru Dönüştürme

Popülerlik skoru 0-1 arası decimal değer olarak saklanır. 5 puanlık sisteme dönüştürülürken doğrudan 5 ile çarpılır. Örneğin 0.85 değeri 4.3/5 olarak gösterilir.

## Rate Limiting

API'ye yapılan istekler için rate limiting uygulanır:
- **Limit**: 100 istek/dakika
- **Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## CORS

Cross-Origin Resource Sharing (CORS) konfigürasyonu:
- **Origin**: `http://localhost:3000` (development)
- **Methods**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization

## Örnek Kullanım

### JavaScript (Axios)
Tüm ürünleri getirmek için axios kullanımı:
```javascript
const response = await axios.get('http://localhost:3001/api/products');
console.log(response.data);
```

Fiyat aralığına göre filtreleme:
```javascript
const filteredProducts = await axios.get(
  'http://localhost:3001/api/products?minPrice=100&maxPrice=500'
);
```

Altın fiyatını getirme:
```javascript
const goldPrice = await axios.get('http://localhost:3001/api/gold-price');
```

### cURL
Tüm ürünleri listele:
```bash
curl -X GET http://localhost:3001/api/products
```

Belirli ürün detayı:
```bash
curl -X GET http://localhost:3001/api/products/1
```

Fiyat aralığına göre filtrele:
```bash
curl -X GET "http://localhost:3001/api/products?minPrice=100&maxPrice=500"
```

## Geliştirme Notları

### Environment Variables
Backend uygulaması için gerekli environment variables:
- PORT: Sunucu portu (varsayılan: 3001)
- GOLD_PRICE_API_KEY: Altın fiyatı API anahtarı
- GOLD_PRICE_API_URL: Altın fiyatı API URL'si
- CORS_ORIGIN: Frontend origin URL'si

### Cache Stratejisi
Performans optimizasyonu için cache stratejisi:
- Altın fiyatı: 5 dakika cache
- Ürün listesi: 1 dakika cache
- Ürün detayı: 5 dakika cache

### Logging
API istekleri ve hataları için logging:
- Tüm API istekleri loglanır
- Hata durumları detaylı loglanır
- Performance metrikleri toplanır

### Güvenlik
API güvenliği için uygulanan önlemler:
- Helmet.js ile güvenlik headers
- Rate limiting ile DDoS koruması
- Input validation
- CORS konfigürasyonu

### Performance
API performansı için optimizasyonlar:
- Response compression
- Database connection pooling
- Caching stratejisi
- Error handling

Bu API dokümantasyonu, uygulamanın tüm endpoint'lerini ve kullanım şekillerini kapsar. Geliştirme sürecinde bu dokümantasyon referans alınarak API entegrasyonu yapılabilir.