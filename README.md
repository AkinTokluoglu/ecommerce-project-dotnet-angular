# Marangoz Atölyesi - Premium E-Ticaret Platformu

![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

**Marangoz Atölyesi**, el yapımı ahşap mobilyalar ve özel tasarım dekorasyon ürünleri için geliştirilmiş, modern ve premium tasarıma sahip bir e-ticaret platformudur. Bu proje, .NET Web API ve Angular son sürümleri kullanılarak modern yazılım mimarilerine uygun şekilde inşa edilmiştir.

## ✨ Temel Özellikler

-   **Premium Tasarım:** Ahşap ve toprak tonlarıyla harmanlanmış, kurumsal ve şık kullanıcı arayüzü.
-   **Kapsamlı Kimlik Doğrulama:**
    -   JWT tabanlı güvenli giriş sistemi.
    -   Kullanıcı kaydı.
    -   Şifremi unuttum ve şifre sıfırlama (E-posta simülasyonu ile).
-   **Ürün Yönetimi:**
    -   Kategori bazlı listeleme.
    -   Özel kişiselleştirme seçenekleri (Ölçü, Ahşap türü vb.).
    -   Yüksek çözünürlüklü ürün galerileri.
-   **E-Ticaret Akışı:** 
    -   Dinamik sepet sistemi.
    -   Adres ve iletişim bilgilerini içeren ödeme (Checkout) adımları.
-   **Müşteri Paneli:**
    -   Sipariş geçmişi görüntüleme.
    -   Profil bilgileri ve adres güncelleme.
    -   Şifre değiştirme.
-   **Portfolyo:** Tamamlanan projelerin sergilendiği özel bölüm.
-   **Yönetim Paneli (Admin):**
    -   Satış ve kullanıcı istatistikleri.
    -   Ürün, Kategori ve Sipariş yönetimi.
    -   Müşteri mesajlarını okuma ve yönetme.

## 🗄️ Veritabanı Yapılandırması (Database Configuration)

Proje, hem **SQLite** hem de **PostgreSQL** veritabanlarını destekleyecek şekilde kurgulanmıştır. Varsayılan olarak kolay kurulum için SQLite aktif gelmektedir.

### 1. SQLite Kullanımı (Varsayılan)
Herhangi bir kurulum gerektirmez. `backend/src/API/appsettings.json` dosyasında şu ayarların olduğundan emin olun:
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=marangoz.db"
},
"DbProvider": "sqlite"
```

### 2. PostgreSQL Kullanımı
Canlı ortam veya daha ölçeklenebilir bir yapı için PostgreSQL'e geçmek oldukça basittir:
1.  **Bağlantı Dizesini Güncelleyin:** `appsettings.json` içinde PostgreSQL sunucu bilgilerinizi girin:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Host=localhost;Database=MarangozDb;Username=postgres;Password=sifreniz"
    }
    ```
2.  **Sağlayıcıyı Değiştirin:** `DbProvider` değerini `"postgres"` yapın:
    ```json
    "DbProvider": "postgres"
  ```
3.  **Migration Uygulayın:** Terminalde backend dizinindeyken veritabanını oluşturun:
    ```bash
    dotnet ef database update
    ```

## 🚀 Teknolojik Altyapı

### Backend (.NET API)
-   **Framework:** .NET 8.0 / 10.0
-   **ORM:** Entity Framework Core
-   **Veritabanı:** SQLite & PostgreSQL desteği
-   **Güvenlik:** JWT Authentication, BCrypt Password Hashing
-   **Mimari:** Clean Architecture prensiplerine uygun katmanlı yapı

### Frontend (Angular)
-   **Framework:** Angular 18/19 (Standalone Components)
-   **State Management:** Angular Signals
-   **Styling:** Modern SCSS / Vanilla CSS
-   **Icons:** Lucide Icons
-   **Responsive:** Mobil uyumlu tasarım (Mobile First)

## 🛠️ Kurulum

### Gereksinimler
-   .NET SDK (8.0+)
-   Node.js (18.0+)
-   Angular CLI

### Çalıştırma adımları

1.  **Repository'yi Klonlayın:**
    ```bash
    git clone https://github.com/AkinTokluoglu/ecommerce-project-dotnet-angular.git
    cd marangoz-ecommerce
    ```

2.  **Backend'i Başlatın:**
    ```bash
    cd backend
    dotnet restore
    dotnet ef database update # Veritabanını oluşturur
    dotnet run --project src/API
    ```

3.  **Frontend'i Başlatın:**
    ```bash
    cd frontend
    npm install
    npm run start
    ```
    Uygulama `http://localhost:4200` adresinde çalışacaktır.

## 📝 Gelecek Planları
- [ ] Ürün arama ve dinamik filtreleme sistemi.
- [ ] Ürün yorumları ve yıldızlı değerlendirme özelliği.
- [ ] Gerçek SMTP servisi ile e-posta gönderimi.
- [ ] Üç boyutlu ürün önizleme desteği.

---
*Bu proje, modern web teknolojilerini kullanarak yüksek performanslı ve estetik bir alışveriş deneyimi sunmak amacıyla geliştirilmiştir.*