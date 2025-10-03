# Deployment Rehberi

Bu dokümantasyon, takı ürün listeleme uygulamasının production ortamına deploy edilmesi için gerekli adımları açıklar.

## 🚀 Deployment Seçenekleri

### Backend Deployment (Heroku)

#### 1. Heroku CLI Kurulumu
Heroku CLI kurulumu:
- **macOS**: Homebrew ile kurulum
- **Windows**: Resmi web sitesinden indirme
- **Linux**: Package manager ile kurulum

#### 2. Heroku'ya Giriş
Heroku CLI ile giriş yapın ve authentication tamamlayın.

#### 3. Backend Projesini Deploy Etme
Backend deployment süreci:
1. Heroku app oluşturma
2. Environment variables ayarlama
3. Git subtree ile deployment
4. Build process konfigürasyonu

#### 4. Backend package.json Güncelleme
Backend package.json dosyası production için güncellenir:
- Start script tanımlanır
- Node.js engine versiyonu belirtilir
- Production dependencies ayrılır

### Frontend Deployment (Vercel)

#### 1. Vercel CLI Kurulumu
Vercel CLI global olarak kurulur ve authentication yapılır.

#### 2. Frontend Projesini Deploy Etme
Frontend deployment süreci:
1. Vercel projesi oluşturma
2. Build konfigürasyonu
3. Environment variables ayarlama
4. Production deployment

#### 3. Environment Variables (Vercel Dashboard)
Vercel dashboard üzerinden environment variables ayarlanır:
- API URL konfigürasyonu
- Build-time variables
- Runtime variables

## 🔧 Environment Variables

### Backend Environment Variables
Backend için gerekli environment variables:
- **NODE_ENV**: Production/development ortamı
- **PORT**: Sunucu portu
- **GOLD_PRICE_API_KEY**: Altın fiyatı API anahtarı
- **GOLD_PRICE_API_URL**: Altın fiyatı API URL'si
- **CORS_ORIGIN**: Frontend origin URL'si

### Frontend Environment Variables
Frontend için gerekli environment variables:
- **REACT_APP_API_URL**: Backend API URL'si
- **REACT_APP_ENVIRONMENT**: Ortam bilgisi
- **REACT_APP_VERSION**: Uygulama versiyonu

## 📦 Build Konfigürasyonu

### Backend Build
Backend build süreci:
- Node.js uygulaması için build gerekmez
- Dependencies production için optimize edilir
- Start script production için konfigüre edilir

### Frontend Build
Frontend build süreci:
- React uygulaması build edilir
- Static assets optimize edilir
- Bundle size minimize edilir
- Source maps production'da devre dışı bırakılır

## 🌐 Domain ve SSL

### Custom Domain (Vercel)
Vercel'de custom domain ayarlama:
1. Vercel Dashboard → Project Settings → Domains
2. Custom domain ekleme
3. DNS kayıtlarını güncelleme
4. SSL sertifikası otomatik oluşturma

### SSL Sertifikası
SSL sertifikası otomatik olarak sağlanır:
- **Vercel**: Otomatik SSL
- **Heroku**: Otomatik SSL
- **Custom Domain**: Let's Encrypt

## 📊 Monitoring ve Logging

### Heroku Logs
Heroku log takibi:
- Real-time log görüntüleme
- Log history erişimi
- Error log filtreleme
- Performance metrikleri

### Vercel Analytics
Vercel analytics özellikleri:
- Performance metrikleri
- Error tracking
- User analytics
- Core Web Vitals

## 🔄 CI/CD Pipeline

### GitHub Actions (Opsiyonel)
GitHub Actions ile CI/CD pipeline:
- **Backend Deploy**: Heroku'ya otomatik deployment
- **Frontend Deploy**: Vercel'e otomatik deployment
- **Test Execution**: Otomatik test çalıştırma
- **Build Process**: Otomatik build süreci

### Workflow Konfigürasyonu
Workflow konfigürasyonu:
- Trigger events (push, pull request)
- Environment variables
- Secret management
- Deployment strategies

## 🚨 Troubleshooting

### Backend Sorunları

#### Port Binding Hatası
Port binding sorunları:
- Heroku'da port otomatik atanır
- Environment variable kontrolü
- Process binding konfigürasyonu

#### CORS Hatası
CORS konfigürasyonu:
- Origin URL kontrolü
- Method ve header konfigürasyonu
- Credentials ayarları

### Frontend Sorunları

#### API URL Hatası
API URL konfigürasyonu:
- Environment variable kontrolü
- Build-time vs runtime variables
- CORS origin uyumluluğu

#### Build Hatası
Build sorunları:
- Node modules temizleme
- Cache temizleme
- Dependency conflicts
- Memory limit aşımı

## 📈 Performance Optimizasyonu

### Backend Performance
Backend performans optimizasyonu:
- **Compression**: Gzip sıkıştırma
- **Caching**: Redis cache (opsiyonel)
- **Rate Limiting**: API rate limiting
- **Connection Pooling**: Database bağlantı havuzu

### Frontend Performance
Frontend performans optimizasyonu:
- **Code Splitting**: React.lazy()
- **Image Optimization**: WebP format
- **Bundle Analysis**: webpack-bundle-analyzer
- **CDN**: Static asset CDN

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
- **Dependency Scanning**: Güvenlik açığı taraması
- **Environment Variables**: Sensitive data koruması

## 📱 Mobile Optimization

### PWA (Progressive Web App)
PWA özellikleri:
- **Manifest**: Web app manifest dosyası
- **Service Worker**: Offline çalışma desteği
- **Responsive Design**: Mobil uyumlu tasarım
- **Touch Support**: Touch gesture desteği

### Mobile Performance
Mobil performans optimizasyonu:
- **Image Optimization**: WebP format ve lazy loading
- **Code Splitting**: Chunk'lar halinde yükleme
- **Caching**: Service worker ile caching
- **Compression**: Gzip sıkıştırma

## 🎯 Production Checklist

### Backend Checklist
Backend production hazırlığı:
- [ ] Environment variables ayarlandı
- [ ] CORS konfigürasyonu
- [ ] Error handling
- [ ] Logging
- [ ] Rate limiting
- [ ] SSL sertifikası
- [ ] Health check endpoint

### Frontend Checklist
Frontend production hazırlığı:
- [ ] Build başarılı
- [ ] Environment variables
- [ ] API URL konfigürasyonu
- [ ] Responsive tasarım
- [ ] Performance optimizasyonu
- [ ] Error boundaries
- [ ] Loading states

## 🔗 Deployment Links

### Production URLs
Production ortamı URL'leri:
- **Frontend**: https://renart-frontend.vercel.app
- **Backend**: https://renart-backend-api.herokuapp.com
- **API Docs**: https://renart-backend-api.herokuapp.com/api-docs

### Development URLs
Development ortamı URL'leri:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API**: http://localhost:3001/api

## 📊 Monitoring ve Alerting

### Application Monitoring
Uygulama izleme:
- **Uptime Monitoring**: Servis durumu takibi
- **Performance Monitoring**: Response time takibi
- **Error Tracking**: Hata oranı takibi
- **User Analytics**: Kullanıcı davranışı analizi

### Alerting
Uyarı sistemi:
- **Email Alerts**: Kritik hatalar için email
- **Slack Integration**: Team notification
- **SMS Alerts**: Acil durumlar için SMS
- **Webhook Integration**: Custom alert handling

Bu deployment rehberi, uygulamanın production ortamına güvenli ve verimli bir şekilde deploy edilmesi için gerekli tüm adımları kapsar. Deployment sürecinde bu rehberi takip ederek sorunsuz bir production ortamı oluşturabilirsiniz.