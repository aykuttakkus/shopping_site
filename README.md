# Takı Ürün Listeleme Uygulaması

Bu proje, takı şirketi için geliştirilmiş bir ürün listeleme uygulamasıdır. Backend API ve React frontend'den oluşan full-stack bir uygulamadır.

## 🚀 Proje Özellikleri

### Backend (Node.js + Express)
- RESTful API ile ürün verilerini servis etme
- Gerçek zamanlı altın fiyatı entegrasyonu
- Dinamik fiyat hesaplama
- Ürün filtreleme (fiyat aralığı, popülerlik skoru)
- JSON dosyasından ürün verilerini okuma

### Frontend (React)
- Modern ve responsive tasarım
- Ürün kartları ile listeleme
- Renk seçici ile görsel değiştirme
- Resim karuseli (ok navigasyonu + kaydırma)
- Popülerlik skorunu 5 puanlık sisteme dönüştürme
- Mobil ve masaüstü uyumlu

## 📋 Gereksinimler

### Backend Gereksinimleri
- Node.js (v16 veya üzeri)
- Express.js
- Axios (altın fiyatı API'si için)
- CORS middleware

### Frontend Gereksinimleri
- React (v18 veya üzeri)
- Modern CSS framework (Tailwind CSS veya Styled Components)
- Axios (API çağrıları için)
- React Icons (ikonlar için)

## 🏗️ Proje Yapısı

```
renart_case/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── data/
│   │   └── products.json
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── TECHNICAL.md
└── README.md
```

## 🚀 Kurulum ve Çalıştırma

### Backend Kurulumu
```bash
cd backend
npm install
npm start
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

## 🔧 API Endpoints

### Ürün Endpoints
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Belirli ürün detayı
- `GET /api/products?minPrice=100&maxPrice=500` - Fiyat aralığına göre filtrele
- `GET /api/products?minPopularity=3&maxPopularity=5` - Popülerlik skoruna göre filtrele

### Altın Fiyatı
- `GET /api/gold-price` - Güncel altın fiyatını getir

## 💰 Fiyat Hesaplama

Her ürünün fiyatı aşağıdaki formül ile hesaplanır:
```
Fiyat = (popülerlikSkoru + 1) × ağırlık × altınFiyatı
```

### Örnek Hesaplama
- **Engagement Ring 1**: popularityScore: 0.85, weight: 2.1g
- Altın fiyatı: $126.08/gram
- Hesaplama: (0.85 + 1) × 2.1 × 126.08 = **$489.82**

## 🎨 Frontend Özellikleri

### Ürün Kartları
- Ürün adı (Engagement Ring 1-8)
- Hesaplanmış fiyat (USD)
- Popülerlik skoru (5 puanlık sistem)
- Renk seçenekleri (Sarı Altın, Rose Gold, Beyaz Altın)
- Resim karuseli

### Responsive Tasarım
- Mobil uyumlu
- Tablet uyumlu
- Masaüstü uyumlu
- Touch/swipe desteği

## 🚀 Deployment

### Backend (Heroku)
```bash
# Heroku CLI ile
heroku create renart-backend
git subtree push --prefix backend heroku main
```

### Frontend (Vercel)
```bash
# Vercel CLI ile
vercel --prod
```

## 📱 Teknoloji Stack

### Backend
- Node.js
- Express.js
- Axios
- CORS
- Dotenv

### Frontend
- React
- Tailwind CSS
- Axios
- React Icons
- React Router (opsiyonel)

## 🔍 Altın Fiyatı API

Proje, gerçek zamanlı altın fiyatı için aşağıdaki API'lerden birini kullanabilir:
- MetalAPI
- Fixer.io
- CurrencyAPI
- Alpha Vantage

## 📝 Geliştirme Notları

### Popülerlik Skoru Dönüştürme
Popülerlik skoru 0-1 arası decimal değer olarak saklanır (0.85 = %85). Bu değer 5 puanlık sisteme dönüştürülürken doğrudan 5 ile çarpılır. Örneğin 0.85 değeri 4.3/5 olarak gösterilir.

### Renk Seçici
Her ürün için 3 farklı renk seçeneği bulunur (Sarı Altın, Rose Gold, Beyaz Altın). Renk değiştiğinde görsel değişir ve aktif renk vurgulanır.

### Karusel Özellikleri
- Sol/sağ ok navigasyonu
- Touch/swipe desteği
- Responsive tasarım
- Otomatik oynatma (opsiyonel)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için: [email@example.com]

---

**Not**: Bu proje bir case study olarak geliştirilmiştir ve ticari kullanım için uygun olmayabilir.