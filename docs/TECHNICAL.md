# Teknik Dokümantasyon

Bu dokümantasyon, takı ürün listeleme uygulamasının teknik detaylarını ve mimarisini açıklar.

## 🏗️ Sistem Mimarisi

### Genel Mimari
Uygulama üç katmanlı bir mimariye sahiptir:

1. **Frontend Katmanı (React)**: Kullanıcı arayüzü ve etkileşim
2. **Backend Katmanı (Node.js)**: API servisleri ve iş mantığı
3. **External API Katmanı**: Altın fiyatı ve diğer harici servisler

Frontend, backend API'sine HTTP istekleri gönderir. Backend, ürün verilerini JSON dosyasından okur ve altın fiyatını harici API'den alır. Fiyat hesaplama işlemi backend'de gerçekleştirilir.

### Teknoloji Stack

#### Backend Teknolojileri
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **HTTP Client**: Axios
- **CORS**: cors middleware
- **Environment**: dotenv
- **Validation**: joi (opsiyonel)

#### Frontend Teknolojileri
- **Framework**: React (v18+)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router (opsiyonel)

## 📊 Veri Modeli

### Ürün Veri Yapısı
Her ürün aşağıdaki yapıda saklanır:
- **id**: Benzersiz ürün kimliği
- **name**: Ürün adı
- **popularityScore**: 0-1 arası popülerlik skoru (0.85 = %85)
- **weight**: Gram cinsinden ağırlık
- **images**: Üç farklı renk seçeneği için görseller
  - yellow: Sarı altın görseli
  - rose: Rose gold görseli
  - white: Beyaz altın görseli
- **calculatedPrice**: Hesaplanmış fiyat (USD)
- **popularityRating**: 5 puanlık sistemde popülerlik

### API Response Yapısı
Tüm API yanıtları standart bir formatta döner:
- **success**: İşlem başarı durumu (boolean)
- **data**: Ana veri içeriği
- **total**: Toplam kayıt sayısı (liste isteklerinde)
- **filters**: Uygulanan filtreler (filtreleme isteklerinde)
- **error**: Hata bilgileri (hata durumunda)

## 🔧 Backend Teknik Detaylar

### Express.js Konfigürasyonu
Backend uygulaması Express.js framework'ü kullanır. Güvenlik için Helmet.js, CORS için cors middleware, rate limiting için express-rate-limit kullanılır. Tüm middleware'ler sırasıyla uygulanır.

### Fiyat Hesaplama Servisi
Fiyat hesaplama işlemi ayrı bir servis sınıfında yapılır. Bu servis, altın fiyatı servisinden güncel fiyatı alır ve her ürün için fiyat hesaplar. Popülerlik skorunu da 5 puanlık sisteme dönüştürür.

### Altın Fiyatı Servisi
Altın fiyatı servisi, harici API'den güncel altın fiyatını alır. Performans için 5 dakikalık cache kullanır.

### Filtreleme Servisi
Ürün filtreleme işlemi ayrı bir servis sınıfında yapılır. Fiyat aralığı ve popülerlik skoru filtrelerini destekler. Filtreleme işlemi memory'de yapılır.

## 🎨 Frontend Teknik Detaylar

### React Component Yapısı
Frontend uygulaması component-based mimariye sahiptir. Ana uygulama bileşeni, ürün listesi ve filtreleme işlemlerini yönetir. Her component kendi state'ini yönetir.

### Ürün Kartı Bileşeni
Ürün kartı bileşeni, her ürün için ayrı bir kart oluşturur. Kart içinde ürün bilgileri, görseller, renk seçici ve popülerlik skoru bulunur. Renk değişikliği state ile yönetilir.

### Resim Karuseli Bileşeni
Resim karuseli bileşeni, ürün görsellerini döngüsel olarak gösterir. Sol/sağ ok navigasyonu ve touch/swipe desteği bulunur. Aktif görsel göstergesi ile kullanıcıya hangi görselde olduğu bildirilir.

### Renk Seçici Bileşeni
Renk seçici bileşeni, üç farklı renk seçeneği sunar. Her renk için farklı görsel gösterilir. Aktif renk vurgulanır ve renk değişikliği anında görsel değişir.

## 🔄 State Management

### API Servisi
API servisi, backend ile iletişimi yönetir. Axios kullanarak HTTP istekleri yapar. Tüm endpoint'ler için ayrı metodlar bulunur. Hata yönetimi ve timeout konfigürasyonu yapılır.

### React Hooks Kullanımı
Uygulama React Hooks kullanır:
- **useState**: Component state yönetimi
- **useEffect**: Side effect'ler ve API çağrıları
- **useCallback**: Performance optimizasyonu
- **useMemo**: Hesaplama optimizasyonu

## 📱 Responsive Tasarım

### Tailwind CSS Breakpoints
Uygulama mobile-first yaklaşımı kullanır:
- **Mobile**: 1 sütun grid
- **Tablet**: 2 sütun grid
- **Desktop**: 3 sütun grid
- **Large Desktop**: 4 sütun grid

### Touch/Swipe Desteği
Mobil cihazlar için touch event'leri desteklenir. Swipe hareketleri ile karusel navigasyonu yapılabilir. Touch başlangıç ve bitiş pozisyonları takip edilir.

## 🚀 Performance Optimizasyonu

### React Optimizasyonları
- **Memoization**: React.memo ile component re-render'ları azaltılır
- **Callback Memoization**: useCallback ile function re-creation'ları önlenir
- **Effect Dependencies**: useEffect dependency array'leri optimize edilir

### Image Optimization
- **Lazy Loading**: Intersection Observer API ile görseller lazy load edilir
- **WebP Format**: Modern tarayıcılar için WebP formatı kullanılır
- **Responsive Images**: Farklı ekran boyutları için uygun görsel boyutları

### Bundle Optimization
- **Code Splitting**: React.lazy ile component'ler lazy load edilir
- **Tree Shaking**: Kullanılmayan kod'lar bundle'dan çıkarılır
- **Minification**: Production build'de kod minify edilir

## 🔒 Güvenlik

### Backend Güvenlik
- **Helmet.js**: Güvenlik headers'ları eklenir
- **Rate Limiting**: DDoS koruması için rate limiting uygulanır
- **Input Validation**: Tüm input'lar validate edilir
- **CORS**: Cross-origin istekler kontrol edilir

### Frontend Güvenlik
- **HTTPS**: Tüm trafik HTTPS üzerinden
- **Content Security Policy**: CSP headers ile XSS koruması
- **Input Sanitization**: Kullanıcı input'ları sanitize edilir

## 📊 Monitoring ve Analytics

### Error Tracking
- **Global Error Handler**: Window error event'leri yakalanır
- **React Error Boundary**: React component hataları yakalanır
- **API Error Handling**: API hataları merkezi olarak yönetilir

### Performance Monitoring
- **Navigation Timing**: Sayfa yükleme süreleri ölçülür
- **Paint Timing**: First paint ve first contentful paint ölçülür
- **Custom Metrics**: Uygulama özel metrikleri toplanır

## 🔍 Debugging

### Backend Debugging
- **Console Logging**: Tüm API istekleri loglanır
- **Error Logging**: Hata durumları detaylı loglanır
- **Performance Logging**: Response time'lar ölçülür

### Frontend Debugging
- **React Developer Tools**: Component state ve props takip edilir
- **Network Tab**: API istekleri ve response'lar incelenir
- **Console Logging**: Debug bilgileri console'a yazılır

## 📝 Kod Standartları

### JavaScript/React Best Practices
- **Component Naming**: PascalCase
- **Function Naming**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **File Naming**: camelCase.js
- **Import Order**: External → Internal → Relative

### CSS/Tailwind Best Practices
- **Utility Classes**: Tailwind utility classes kullanılır
- **Custom CSS**: Minimal custom CSS
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Consistent color palette

### API Best Practices
- **RESTful Design**: HTTP methods doğru kullanılır
- **Error Handling**: Consistent error format
- **Validation**: Input validation
- **Documentation**: API dokümantasyonu

## 🧪 Test Stratejisi

### Backend Testleri
- **Unit Tests**: Servis sınıfları test edilir
- **Integration Tests**: API endpoint'leri test edilir
- **Integration Tests**: Harici API'ler test edilir

### Frontend Testleri
- **Component Tests**: React component'leri test edilir
- **Integration Tests**: Component etkileşimleri test edilir
- **E2E Tests**: Kullanıcı senaryoları test edilir

## 🔄 CI/CD Pipeline

### Git Workflow
- **Feature Branches**: Her özellik için ayrı branch
- **Pull Requests**: Code review süreci
- **Automated Tests**: CI/CD pipeline'da test çalıştırma
- **Deployment**: Otomatik deployment

### Build Process
- **Backend**: Node.js uygulaması build edilir
- **Frontend**: React uygulaması build edilir
- **Assets**: Static asset'ler optimize edilir
- **Bundle**: Production bundle oluşturulur

Bu teknik dokümantasyon, uygulamanın tüm teknik detaylarını ve implementasyon stratejilerini kapsar. Geliştirme sürecinde bu dokümantasyon referans alınarak kod yazılabilir.