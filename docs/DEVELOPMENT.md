# Geliştirme Rehberi

Bu dokümantasyon, takı ürün listeleme uygulamasının geliştirme sürecini ve best practice'lerini açıklar.

## 🚀 Hızlı Başlangıç

### Gereksinimler
Geliştirme ortamı için gerekli araçlar:
- Node.js (v18 veya üzeri)
- npm veya yarn
- Git
- Code editor (VS Code önerilir)

### Proje Kurulumu
Proje kurulumu için aşağıdaki adımları takip edin:

1. Repository'yi klonlayın
2. Backend klasörüne gidin ve bağımlılıkları yükleyin
3. Backend'i development modunda çalıştırın
4. Yeni terminal açın ve frontend klasörüne gidin
5. Frontend bağımlılıklarını yükleyin
6. Frontend'i development modunda çalıştırın

## 📁 Proje Yapısı Detayları

### Backend Yapısı
Backend uygulaması MVC (Model-View-Controller) mimarisine sahiptir:

- **controllers/**: API endpoint'lerini yöneten controller'lar
- **routes/**: URL routing konfigürasyonu
- **services/**: İş mantığı servisleri
- **utils/**: Yardımcı fonksiyonlar
- **middleware/**: Express middleware'leri
- **data/**: JSON veri dosyaları
- **tests/**: Test dosyaları

### Frontend Yapısı
Frontend uygulaması component-based mimariye sahiptir:

- **components/**: React component'leri
  - **common/**: Ortak kullanılan component'ler
  - **product/**: Ürün ile ilgili component'ler
  - **filters/**: Filtreleme component'leri
- **pages/**: Sayfa component'leri
- **services/**: API servisleri
- **utils/**: Yardımcı fonksiyonlar
- **hooks/**: Custom React hooks
- **styles/**: CSS dosyaları

## 🔧 Geliştirme Adımları

### 1. Backend Geliştirme

#### Package.json Oluşturma
Backend için package.json dosyası oluşturulur. Express.js, CORS, Helmet, Rate Limiting gibi bağımlılıklar eklenir. Development ve production script'leri tanımlanır.

#### Ana Uygulama Dosyası
Express.js uygulaması oluşturulur. Middleware'ler sırasıyla eklenir. Route'lar tanımlanır. Error handling ve 404 handler'ları eklenir.

#### Ürün Controller
Ürün controller'ı, ürün listesi ve detay endpoint'lerini yönetir. Filtreleme parametrelerini işler. Fiyat hesaplama servisini çağırır. Response formatını standardize eder.

#### Altın Fiyatı Servisi
Altın fiyatı servisi, harici API'den güncel fiyatı alır. Cache mekanizması kullanır. API key ve URL konfigürasyonu yapılır.

### 2. Frontend Geliştirme

#### Package.json Oluşturma
Frontend için package.json dosyası oluşturulur. React, Tailwind CSS, Axios gibi bağımlılıklar eklenir. Build ve development script'leri tanımlanır.

#### Ana Uygulama Bileşeni
React uygulaması oluşturulur. State management için hooks kullanılır. API servisleri entegre edilir. Loading ve error state'leri yönetilir.

#### Ürün Kartı Bileşeni
Ürün kartı bileşeni, her ürün için ayrı kart oluşturur. Renk seçici ve resim karuseli entegre edilir. Popülerlik skoru gösterilir. Hover efektleri eklenir.

## 🧪 Test Geliştirme

### Backend Testleri
Backend testleri Jest framework'ü kullanılarak yazılır. Unit testler servis sınıflarını test eder. Integration testler API endpoint'lerini test eder. Mock'lar harici API'ler için kullanılır.

### Frontend Testleri
Frontend testleri React Testing Library kullanılarak yazılır. Component testleri render ve etkileşimleri test eder. Integration testleri component etkileşimlerini test eder. Mock'lar API servisleri için kullanılır.

## 🔧 Geliştirme Araçları

### VS Code Extensions
Geliştirme verimliliği için önerilen VS Code eklentileri:
- TypeScript ve JavaScript desteği
- Tailwind CSS IntelliSense
- Prettier code formatter
- ESLint code linter
- Auto Rename Tag
- Path IntelliSense

### ESLint Konfigürasyonu
Kod kalitesi için ESLint konfigürasyonu:
- React uygulaması için özel kurallar
- Jest testleri için kurallar
- Kullanılmayan değişkenler için uyarılar
- Console kullanımı için uyarılar
- Const kullanımı için hatalar

### Prettier Konfigürasyonu
Kod formatlama için Prettier konfigürasyonu:
- Semicolon kullanımı
- Trailing comma
- Single quote kullanımı
- Print width
- Tab width

## 🚀 Geliştirme Workflow

### Git Workflow
Git workflow süreci:
1. Feature branch oluşturma
2. Değişiklikleri commit etme
3. Remote repository'ye push etme
4. Pull request oluşturma
5. Code review süreci
6. Merge işlemi

### Commit Message Formatı
Commit mesajları için standart format:
- **feat**: Yeni özellik ekleme
- **fix**: Bug düzeltme
- **docs**: Dokümantasyon güncelleme
- **style**: Kod formatlama
- **refactor**: Kod yeniden düzenleme
- **test**: Test ekleme
- **chore**: Build süreçleri

## 📊 Performance Monitoring

### Bundle Analysis
Frontend bundle analizi için webpack-bundle-analyzer kullanılır. Bundle boyutları analiz edilir. Gereksiz bağımlılıklar tespit edilir. Code splitting fırsatları belirlenir.

### Lighthouse Audit
Lighthouse CLI ile performance audit yapılır. Performance, Accessibility, Best Practices, SEO metrikleri ölçülür. Rapor HTML formatında oluşturulur.

## 🔍 Debugging

### Backend Debugging
Backend debugging için:
- Debug middleware ile istek loglama
- Console.log ile hata takibi
- Error stack trace analizi
- Performance profiling

### Frontend Debugging
Frontend debugging için:
- React Developer Tools kullanımı
- Browser DevTools Network tab
- Console logging
- Component state takibi

## 📝 Kod Standartları

### JavaScript/React Best Practices
Kod standartları:
- **Component Naming**: PascalCase
- **Function Naming**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **File Naming**: camelCase.js
- **Import Order**: External → Internal → Relative

### CSS/Tailwind Best Practices
CSS standartları:
- **Utility Classes**: Tailwind utility classes kullanılır
- **Custom CSS**: Minimal custom CSS
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Consistent color palette

### API Best Practices
API standartları:
- **RESTful Design**: HTTP methods doğru kullanılır
- **Error Handling**: Consistent error format
- **Validation**: Input validation
- **Documentation**: API dokümantasyonu

## 🧪 Test Stratejisi

### Test Türleri
Uygulama için test stratejisi:
- **Unit Tests**: Bireysel fonksiyon ve component testleri
- **Integration Tests**: Component etkileşim testleri
- **E2E Tests**: Kullanıcı senaryosu testleri
- **Performance Tests**: Yükleme süresi testleri

### Test Araçları
Test araçları:
- **Jest**: JavaScript test framework'ü
- **React Testing Library**: React component testleri
- **Supertest**: API endpoint testleri
- **Cypress**: E2E testleri

## 🔄 CI/CD Pipeline

### GitHub Actions
CI/CD pipeline GitHub Actions ile kurulur:
- **Backend Deploy**: Heroku'ya otomatik deployment
- **Frontend Deploy**: Vercel'e otomatik deployment
- **Test Execution**: Otomatik test çalıştırma
- **Build Process**: Otomatik build süreci

### Build Process
Build süreci:
- **Backend**: Node.js uygulaması build edilir
- **Frontend**: React uygulaması build edilir
- **Assets**: Static asset'ler optimize edilir
- **Bundle**: Production bundle oluşturulur

## 📱 Mobile Optimization

### PWA (Progressive Web App)
PWA özellikleri:
- **Manifest**: Web app manifest dosyası
- **Service Worker**: Offline çalışma desteği
- **Responsive Design**: Mobil uyumlu tasarım
- **Touch Support**: Touch gesture desteği

### Performance Optimization
Mobil performans optimizasyonu:
- **Image Optimization**: WebP format ve lazy loading
- **Code Splitting**: Chunk'lar halinde yükleme
- **Caching**: Service worker ile caching
- **Compression**: Gzip sıkıştırma

## 🔒 Güvenlik

### Backend Güvenlik
Backend güvenlik önlemleri:
- **Helmet.js**: Güvenlik headers
- **Rate Limiting**: DDoS koruması
- **Input Validation**: XSS ve injection koruması
- **CORS**: Cross-origin istek kontrolü

### Frontend Güvenlik
Frontend güvenlik önlemleri:
- **HTTPS**: Tüm trafik HTTPS
- **Content Security Policy**: XSS koruması
- **Input Sanitization**: Kullanıcı input temizleme
- **Dependency Scanning**: Güvenlik açığı taraması

Bu geliştirme rehberi, projenin tüm geliştirme sürecini kapsar ve best practice'leri içerir. Geliştirme sürecinde bu rehberi takip ederek tutarlı ve kaliteli kod yazabilirsiniz.