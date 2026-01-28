import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Slider Section -->
    <section class="hero-slider">
      <div class="slides-container">
        @for (slide of heroSlides; track slide.id; let i = $index) {
          <div class="slide" [class.active]="currentSlide === i" [style.background-image]="'url(' + slide.image + ')'">
            <div class="slide-overlay"></div>
            <div class="slide-content">
              <span class="slide-badge">{{ slide.badge }}</span>
              <h1>{{ slide.title }}</h1>
              <p>{{ slide.description }}</p>
              <div class="slide-buttons">
                <a [routerLink]="slide.primaryLink" class="btn-hero-primary">
                  <i data-lucide="arrow-right"></i>
                  {{ slide.primaryText }}
                </a>
                <a [routerLink]="slide.secondaryLink" class="btn-hero-secondary">
                  {{ slide.secondaryText }}
                </a>
              </div>
            </div>
          </div>
        }
      </div>
      
      <!-- Slider Controls -->
      <div class="slider-controls">
        <button class="slider-btn prev" (click)="prevSlide()">
          <i data-lucide="chevron-left"></i>
        </button>
        <div class="slider-dots">
          @for (slide of heroSlides; track slide.id; let i = $index) {
            <button class="dot" [class.active]="currentSlide === i" (click)="goToSlide(i)"></button>
          }
        </div>
        <button class="slider-btn next" (click)="nextSlide()">
          <i data-lucide="chevron-right"></i>
        </button>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <span>Keşfetmek için kaydırın</span>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container stats-grid">
        <div class="stat-item">
          <i data-lucide="package" class="stat-icon"></i>
          <div class="stat-content">
            <span class="stat-number">500+</span>
            <span class="stat-label">Tamamlanan Proje</span>
          </div>
        </div>
        <div class="stat-item">
          <i data-lucide="users" class="stat-icon"></i>
          <div class="stat-content">
            <span class="stat-number">350+</span>
            <span class="stat-label">Mutlu Müşteri</span>
          </div>
        </div>
        <div class="stat-item">
          <i data-lucide="award" class="stat-icon"></i>
          <div class="stat-content">
            <span class="stat-number">15+</span>
            <span class="stat-label">Yıllık Deneyim</span>
          </div>
        </div>
        <div class="stat-item">
          <i data-lucide="star" class="stat-icon"></i>
          <div class="stat-content">
            <span class="stat-number">4.9</span>
            <span class="stat-label">Müşteri Puanı</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">KATEGORİLER</span>
          <h2 class="section-title">Uzmanlık Alanlarımız</h2>
          <p class="section-subtitle">Her kategoride yılların deneyimiyle kaliteli işçilik sunuyoruz</p>
        </div>
        <div class="categories-grid">
          @for (category of categories; track category.id) {
            <a [routerLink]="['/products']" [queryParams]="{category: category.slug}" class="category-card">
              <div class="category-icon-wrapper">
                <i [attr.data-lucide]="getCategoryIcon(category.slug)"></i>
              </div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <span class="category-link">
                Keşfet <i data-lucide="arrow-right"></i>
              </span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="products-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">ÖNE ÇIKAN</span>
          <h2 class="section-title">En Çok Tercih Edilenler</h2>
          <p class="section-subtitle">Müşterilerimizin en beğendiği ürünler</p>
        </div>
        <div class="products-grid">
          @for (product of featuredProducts; track product.id) {
            <a [routerLink]="['/product', product.slug]" class="product-card">
              <div class="product-image-wrapper">
                <img [src]="product.mainImageUrl" [alt]="product.name" loading="lazy">
                <div class="product-overlay">
                  <span class="quick-view">
                    <i data-lucide="eye"></i>
                    Hızlı Bakış
                  </span>
                </div>
                @if (product.stockQuantity <= 5 && product.stockQuantity > 0) {
                  <span class="product-badge warning">Son {{ product.stockQuantity }} adet</span>
                }
              </div>
              <div class="product-info">
                <span class="product-category">{{ product.categoryName || 'Mobilya' }}</span>
                <h3>{{ product.name }}</h3>
                <div class="product-footer">
                  <span class="product-price">{{ product.price | number:'1.0-0' }} ₺</span>
                  <button class="add-cart-btn">
                    <i data-lucide="shopping-bag"></i>
                  </button>
                </div>
              </div>
            </a>
          }
        </div>
        <div class="section-footer">
          <a routerLink="/products" class="btn btn-secondary">
            Tüm Ürünleri Gör
            <i data-lucide="arrow-right"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="new-arrivals-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">YENİ GELENLER</span>
          <h2 class="section-title">Atölyeden Taze Çıktı</h2>
          <p class="section-subtitle">En son tasarımlarımızı ilk siz keşfedin</p>
        </div>
        <div class="new-arrivals-grid">
          @for (product of newArrivals; track product.id; let i = $index) {
            <a [routerLink]="['/product', product.slug]" class="arrival-card" [class.featured]="i === 0">
              <div class="arrival-image">
                <img [src]="product.mainImageUrl" [alt]="product.name" loading="lazy">
                <span class="new-badge">YENİ</span>
              </div>
              <div class="arrival-info">
                <h3>{{ product.name }}</h3>
                <p>{{ product.description | slice:0:80 }}...</p>
                <span class="arrival-price">{{ product.price | number:'1.0-0' }} ₺</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Why Us Section -->
    <section class="why-us-section section">
      <div class="container">
        <div class="why-us-grid">
          <div class="why-us-content">
            <span class="section-label">NEDEN BİZ?</span>
            <h2>El İşçiliğinin <span class="text-accent">Değerini</span> Biliyoruz</h2>
            <p>15 yılı aşkın deneyimimizle, her müşterimize özel tasarım mobilyalar üretiyoruz. 
               Kaliteli malzeme, ustaca işçilik ve müşteri memnuniyeti önceliğimizdir.</p>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <i data-lucide="hammer"></i>
                </div>
                <div class="feature-content">
                  <h4>El İşçiliği</h4>
                  <p>Her parça usta ellerden çıkan benzersiz bir eser</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i data-lucide="leaf"></i>
                </div>
                <div class="feature-content">
                  <h4>Doğal Malzeme</h4>
                  <p>FSC sertifikalı, sürdürülebilir ahşap kaynakları</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i data-lucide="pencil-ruler"></i>
                </div>
                <div class="feature-content">
                  <h4>Özel Tasarım</h4>
                  <p>Mekanınıza özel ölçü ve tasarım çözümleri</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i data-lucide="truck"></i>
                </div>
                <div class="feature-content">
                  <h4>Kurulum Dahil</h4>
                  <p>Ücretsiz teslimat ve profesyonel montaj hizmeti</p>
                </div>
              </div>
            </div>
            
            <a routerLink="/contact" class="btn btn-primary">
              <i data-lucide="phone"></i>
              Ücretsiz Keşif Talep Et
            </a>
          </div>
          <div class="why-us-image">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Marangoz Atölyesi">
            <div class="experience-badge">
              <span class="years">15+</span>
              <span class="text">Yıllık<br>Deneyim</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Content Section -->
    <section class="seo-content-section section">
      <div class="container">
        <div class="seo-content-grid">
          <article class="seo-article">
            <h2>İstanbul'un Güvenilir Marangoz Atölyesi</h2>
            <p>
              Marangoz Atölyesi olarak 15 yılı aşkın süredir İstanbul'da özel tasarım ahşap mobilya üretimi yapıyoruz. 
              <strong>Mutfak dolapları</strong>, <strong>yatak odası mobilyaları</strong>, <strong>salon takımları</strong> ve 
              <strong>özel tasarım ahşap kapılar</strong> konusunda uzmanlaşmış ekibimizle, hayalinizdeki mobilyayı gerçeğe dönüştürüyoruz.
            </p>
            <p>
              Tüm projelerimizde birinci sınıf ahşap malzeme kullanıyor, çevre dostu üretim süreçleri uyguluyoruz. 
              Meşe, ceviz, kayın ve akçaağaç gibi <strong>doğal ahşap türleri</strong> ile çalışarak dayanıklı ve estetik mobilyalar üretiyoruz.
            </p>
          </article>
          <article class="seo-article">
            <h3>Hizmet Bölgelerimiz</h3>
            <p>
              İstanbul'un tüm ilçelerine hizmet veriyoruz. Özellikle <strong>Kadıköy</strong>, <strong>Beşiktaş</strong>, 
              <strong>Ataşehir</strong>, <strong>Pendik</strong> ve <strong>Üsküdar</strong> bölgelerinde yoğun olarak çalışıyoruz.
              Anadolu ve Avrupa yakası fark etmeksizin ücretsiz keşif hizmeti sunuyoruz.
            </p>
          </article>
          <article class="seo-article">
            <h3>Neden Özel Tasarım Mobilya?</h3>
            <p>
              Hazır mobilyaların aksine, <strong>özel tasarım mobilyalar</strong> tam olarak evinizin ölçülerine ve 
              zevkinize göre üretilir. Böylece hem mekanınızı maksimum verimle kullanır, hem de benzersiz bir yaşam alanı yaratırsınız.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Hayalinizdeki Mobilyayı Birlikte Tasarlayalım</h2>
          <p>Ücretsiz keşif ve fiyat teklifi için hemen iletişime geçin</p>
          <div class="cta-buttons">
            <a routerLink="/contact" class="btn btn-accent">
              <i data-lucide="message-circle"></i>
              İletişime Geç
            </a>
            <a href="https://wa.me/905551234567" target="_blank" class="btn btn-whatsapp">
              <i data-lucide="message-circle"></i>
              WhatsApp ile Yaz
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Slider */
    .hero-slider {
      position: relative;
      height: 100vh;
      min-height: 700px;
      overflow: hidden;
    }
    
    .slides-container {
      position: relative;
      height: 100%;
    }
    
    .slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    
    .slide.active {
      opacity: 1;
    }
    
    .slide-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(26, 21, 18, 0.85) 0%, rgba(45, 37, 32, 0.7) 100%);
    }
    
    .slide-content {
      position: relative;
      z-index: 2;
      max-width: 700px;
      padding: 0 2rem;
      margin-left: 10%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .slide-badge {
      display: inline-block;
      background: var(--accent);
      color: var(--primary-900);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
      width: fit-content;
    }
    
    .slide-content h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      color: white;
      margin-bottom: 1.5rem;
      line-height: 1.1;
    }
    
    .slide-content p {
      font-size: 1.25rem;
      color: rgba(255,255,255,0.9);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .slide-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .btn-hero-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--accent);
      color: var(--primary-900);
      padding: 1rem 2rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .btn-hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(240, 200, 120, 0.4);
    }
    
    .btn-hero-secondary {
      display: inline-flex;
      align-items: center;
      background: transparent;
      color: white;
      padding: 1rem 2rem;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: var(--radius-md);
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .btn-hero-secondary:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.5);
    }
    
    .slider-controls {
      position: absolute;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      z-index: 10;
    }
    
    .slider-btn {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .slider-btn:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .slider-dots {
      display: flex;
      gap: 0.5rem;
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-full);
      background: rgba(255,255,255,0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .dot.active {
      background: var(--accent);
      width: 32px;
    }
    
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      right: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.6);
      font-size: 0.75rem;
    }
    
    .mouse {
      width: 24px;
      height: 40px;
      border: 2px solid rgba(255,255,255,0.4);
      border-radius: 12px;
      position: relative;
    }
    
    .wheel {
      width: 4px;
      height: 8px;
      background: rgba(255,255,255,0.6);
      border-radius: 2px;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 2s infinite;
    }
    
    @keyframes scroll {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
      50% { transform: translateX(-50%) translateY(8px); opacity: 0.5; }
    }
    
    /* Stats Section */
    .stats-section {
      background: white;
      padding: 2rem 0;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      color: var(--primary);
    }
    
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary-800);
      font-family: 'Inter', sans-serif;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--gray-500);
    }
    
    /* Section Labels */
    .section-label {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--primary);
      margin-bottom: 0.75rem;
      font-family: 'Inter', sans-serif;
    }
    
    /* Categories */
    .categories-section {
      background: var(--gray-50);
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    
    .category-card {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      text-align: center;
      transition: all 0.3s;
      border: 1px solid var(--gray-100);
    }
    
    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-200);
    }
    
    .category-icon-wrapper {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, var(--primary-100), var(--accent-100));
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .category-icon-wrapper i {
      width: 32px;
      height: 32px;
      color: var(--primary);
    }
    
    .category-card h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
    }
    
    .category-card p {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 1rem;
    }
    
    .category-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .category-link i {
      width: 16px;
      height: 16px;
      transition: transform 0.3s;
    }
    
    .category-card:hover .category-link i {
      transform: translateX(4px);
    }
    
    /* Products Grid */
    .products-section {
      background: white;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .product-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--gray-100);
      transition: all 0.3s;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }
    
    .product-image-wrapper {
      position: relative;
      height: 280px;
      overflow: hidden;
    }
    
    .product-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    .product-card:hover .product-image-wrapper img {
      transform: scale(1.05);
    }
    
    .product-overlay {
      position: absolute;
      inset: 0;
      background: rgba(26, 21, 18, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .product-card:hover .product-overlay {
      opacity: 1;
    }
    
    .quick-view {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      color: var(--primary-800);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .quick-view i {
      width: 18px;
      height: 18px;
    }
    
    .product-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .product-badge.warning {
      background: #FEF3C7;
      color: #D97706;
    }
    
    .product-info {
      padding: 1.5rem;
    }
    
    .product-category {
      font-size: 0.75rem;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    .product-info h3 {
      font-size: 1.125rem;
      margin: 0.5rem 0 1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
    }
    
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .product-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--success-600);
    }
    
    .add-cart-btn {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--primary-100);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    
    .add-cart-btn i {
      width: 20px;
      height: 20px;
      color: var(--primary);
    }
    
    .add-cart-btn:hover {
      background: var(--primary);
    }
    
    .add-cart-btn:hover i {
      color: white;
    }
    
    .section-footer {
      text-align: center;
      margin-top: 3rem;
    }
    
    /* New Arrivals */
    .new-arrivals-section {
      background: var(--primary-50);
    }
    
    .new-arrivals-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.5rem;
    }
    
    .arrival-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.3s;
    }
    
    .arrival-card.featured {
      grid-row: span 2;
    }
    
    .arrival-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }
    
    .arrival-image {
      position: relative;
      height: 200px;
    }
    
    .arrival-card.featured .arrival-image {
      height: 100%;
      min-height: 400px;
    }
    
    .arrival-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .new-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--accent);
      color: var(--primary-900);
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
    }
    
    .arrival-info {
      padding: 1.5rem;
    }
    
    .arrival-info h3 {
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .arrival-info p {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 1rem;
    }
    
    .arrival-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--success-600);
    }
    
    /* Why Us */
    .why-us-section {
      background: white;
    }
    
    .why-us-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .why-us-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }
    
    .text-accent {
      color: var(--primary);
    }
    
    .why-us-content > p {
      color: var(--gray-600);
      margin-bottom: 2rem;
      line-height: 1.8;
    }
    
    .features-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .feature-item {
      display: flex;
      gap: 1rem;
    }
    
    .feature-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-100), var(--accent-100));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .feature-icon i {
      width: 24px;
      height: 24px;
      color: var(--primary);
    }
    
    .feature-content h4 {
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .feature-content p {
      font-size: 0.875rem;
      color: var(--gray-500);
    }
    
    .why-us-image {
      position: relative;
    }
    
    .why-us-image img {
      width: 100%;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
    }
    
    .experience-badge {
      position: absolute;
      bottom: -2rem;
      left: -2rem;
      background: var(--primary-800);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: var(--radius-xl);
      text-align: center;
      box-shadow: var(--shadow-xl);
    }
    
    .experience-badge .years {
      display: block;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--accent);
      font-family: 'Inter', sans-serif;
    }
    
    .experience-badge .text {
      font-size: 0.875rem;
      line-height: 1.3;
    }
    
    /* SEO Content */
    .seo-content-section {
      background: var(--gray-50);
    }
    
    .seo-content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2rem;
    }
    
    .seo-article h2, .seo-article h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      font-family: 'Inter', sans-serif;
    }
    
    .seo-article p {
      color: var(--gray-600);
      line-height: 1.8;
      margin-bottom: 1rem;
    }
    
    .seo-article strong {
      color: var(--primary-800);
    }
    
    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--primary-800), var(--primary-900));
      padding: 5rem 0;
    }
    
    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .cta-content h2 {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 1rem;
    }
    
    .cta-content p {
      color: rgba(255,255,255,0.8);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-whatsapp {
      background: #25D366;
      color: white;
      padding: 0.875rem 1.75rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-whatsapp:hover {
      background: #128C7E;
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .why-us-grid,
      .seo-content-grid {
        grid-template-columns: 1fr;
      }
      
      .new-arrivals-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .arrival-card.featured {
        grid-column: span 2;
        grid-row: span 1;
      }
    }
    
    @media (max-width: 768px) {
      .hero-slider {
        min-height: 600px;
      }
      
      .slide-content {
        margin-left: 0;
        text-align: center;
        align-items: center;
      }
      
      .slide-buttons {
        justify-content: center;
      }
      
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .features-list {
        grid-template-columns: 1fr;
      }
      
      .new-arrivals-grid {
        grid-template-columns: 1fr;
      }
      
      .arrival-card.featured {
        grid-column: span 1;
      }
      
      .experience-badge {
        position: static;
        margin-top: 1rem;
      }
      
      .scroll-indicator {
        display: none;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  currentSlide = 0;
  private slideInterval: any;

  heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80',
      badge: 'EL YAPIMI KALİTE',
      title: 'Hayalinizdeki Mobilya, Ustaca İşçilik',
      description: 'Özel tasarım ahşap mobilyalarla yaşam alanlarınızı dönüştürün. Her parça sizin için özenle üretiliyor.',
      primaryText: 'Ürünleri Keşfet',
      primaryLink: '/products',
      secondaryText: 'Portfolyoyu Gör',
      secondaryLink: '/portfolio'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
      badge: 'MUTFAK UZMANI',
      title: 'Modern Mutfaklar, Zamansız Tasarım',
      description: 'Lake, ahşap veya membran kapaklarla mutfağınızı yenileyin. Ücretsiz keşif ve 3D tasarım hizmeti.',
      primaryText: 'Mutfak Modelleri',
      primaryLink: '/products',
      secondaryText: 'Ücretsiz Keşif',
      secondaryLink: '/contact'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80',
      badge: 'YATAK ODASI',
      title: 'Huzurlu Uykular, Özel Tasarımlar',
      description: 'Gardıroptan karyolaya, komodinden şifonyere tüm yatak odası mobilyaları.',
      primaryText: 'Yatak Odası',
      primaryLink: '/products',
      secondaryText: 'İletişime Geç',
      secondaryLink: '/contact'
    }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.startSlider();
    this.loadData();
    this.initIcons();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  initIcons(): void {
    setTimeout(() => {
      if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
      }
    }, 100);
  }

  loadData(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        setTimeout(() => this.initIcons(), 200);
      },
      error: (err) => console.error('Categories error:', err)
    });

    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data.slice(0, 6);
        this.newArrivals = data.slice(0, 4);
        setTimeout(() => this.initIcons(), 200);
      },
      error: (err) => console.error('Products error:', err)
    });
  }

  startSlider(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopSlider(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.stopSlider();
    this.startSlider();
  }

  getCategoryIcon(slug: string): string {
    const icons: { [key: string]: string } = {
      'mutfak-dolaplari': 'chef-hat',
      'banyo-dolaplari': 'bath',
      'salon-mobilyalari': 'sofa',
      'yatak-odasi': 'bed-double',
      'kapilar': 'door-open'
    };
    return icons[slug] || 'box';
  }
}
