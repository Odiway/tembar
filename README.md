# 📦 Stok Kontrol Sistemi

Modern ve kullanıcı dostu envanter yönetim sistemi. Next.js, TypeScript, SQLite ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

### ✅ Temel İşlevler
- **CRUD İşlemleri**: Ürün ekleme, düzenleme, silme ve görüntüleme
- **Fotoğraf Yükleme**: Ürünlere fotoğraf ekleme ve önizleme
- **Veri Dışa Aktarma**: JSON formatında yedek alma
- **Türkçe Arayüz**: Tamamen Türkçe kullanıcı arayüzü

### 🔍 Gelişmiş Filtreleme
- **Konum Filtresi**: Belirli konumdaki ürünleri görüntüleme
- **Proje Filtresi**: Proje bazında ürün listeleme
- **Arama**: Tüm alanlarda gerçek zamanlı arama
- **Sıralama**: Kolon başlıklarına tıklayarak sıralama

### 📊 İstatistikler
- **Konum Dağılımı**: Konumlara göre ürün sayıları
- **Proje Dağılımı**: Projelere göre ürün sayıları
- **Anlık Sayaçlar**: Filtrelenmiş sonuçların özeti

### 🗄️ Veri Saklama
- **SQLite Veritabanı**: Yerel, hızlı ve güvenilir
- **Prisma ORM**: Modern veritabanı yönetimi
- **Otomatik Yedekleme**: Kolay yedekleme ve geri yükleme

## 🏗️ Teknoloji Stack

- **Frontend**: Next.js 15.5.4, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Deployment**: Vercel Ready

## 📋 Ürün Alanları

- **Konum**: Ürünün bulunduğu yer
- **Ürün Adı**: Ürün tanımı
- **Seri Numarası**: Benzersiz tanımlayıcı
- **Miktar**: Stok miktarı
- **Proje Adı**: Bağlı olduğu proje
- **Proje Numarası**: Proje referans numarası
- **Teslimat Zamanı**: Planlanan teslimat tarihi
- **Fotoğraf**: Ürün görseli (opsiyonel)

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adım Adım Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd tembar
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Veritabanını oluşturun**
```bash
npx prisma migrate dev --name init
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Uygulamayı açın**
```
http://localhost:3000
```

## 📂 Proje Yapısı

```
tembar/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/stock/          # API routes
│   │   ├── layout.tsx          # Ana layout
│   │   └── page.tsx            # Ana sayfa
│   ├── components/             # React bileşenleri
│   │   ├── StockForm.tsx       # Ürün formu
│   │   ├── StockList.tsx       # Ürün listesi
│   │   └── StockSummary.tsx    # İstatistik özeti
│   ├── lib/                    # Yardımcı kütüphaneler
│   │   ├── prisma.ts           # Prisma client
│   │   └── stockService.ts     # API service
│   └── types/                  # TypeScript türleri
│       └── stock.ts            # Ürün türleri
├── prisma/                     # Veritabanı
│   ├── schema.prisma           # Veritabanı şeması
│   ├── migrations/             # Migrasyonlar
│   └── dev.db                  # SQLite veritabanı
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🗄️ Veritabanı Yönetimi

### Prisma Studio ile Veri Görüntüleme
```bash
npx prisma studio
```

### Veritabanı Yedekleme
```bash
# Windows
copy "prisma\\dev.db" "backup-2025-10-01.db"

# Linux/Mac
cp prisma/dev.db backup-2025-10-01.db
```

### Veritabanı Sıfırlama
```bash
npx prisma migrate reset
```

## 📊 Kullanım Kılavuzu

### Yeni Ürün Ekleme
1. "Yeni Ürün Ekle" butonuna tıklayın
2. Tüm gerekli alanları doldurun
3. İsteğe bağlı fotoğraf yükleyin
4. "Kaydet" butonuna tıklayın

### Filtreleme
1. "Filtreler" butonuna tıklayın
2. Konum veya proje seçin
3. Arama kutusunu kullanın
4. Sonuçlar otomatik güncellenir

### Veri Dışa Aktarma
1. "Verileri İndir" butonuna tıklayın
2. JSON dosyası indirilir
3. Dosyayı güvenli yerde saklayın

## 🚀 Deployment

### Vercel'e Deploy
1. Vercel hesabı oluşturun
2. Repository'yi bağlayın
3. Environment variables ekleyin
4. Deploy edin

**Not**: Production'da PostgreSQL kullanımı önerilir.

## 🛠️ Geliştirme

### Yeni Özellik Ekleme
1. Feature branch oluşturun
2. Değişiklikleri yapın
3. Test edin
4. Pull request açın

### Veritabanı Değişiklikleri
1. `prisma/schema.prisma` dosyasını güncelleyin
2. Migration oluşturun: `npx prisma migrate dev --name <name>`
3. Client'ı güncelleyin: `npx prisma generate`

## 📝 Lisans

Bu proje özel kullanım içindir.

## 👨‍💻 Geliştirici

Stok kontrol sistemi - Envanter yönetimi için modern çözüm

---

## 🆘 Sorun Giderme

### Veritabanı Bağlantı Sorunu
```bash
npx prisma generate
npx prisma migrate dev
```

### Port Kullanımda Hatası
```bash
# Farklı port kullanın
npm run dev -- -p 3001
```

### Dependencies Sorunu
```bash
rm -rf node_modules package-lock.json
npm install
```