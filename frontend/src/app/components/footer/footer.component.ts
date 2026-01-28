import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer" itemscope itemtype="https://schema.org/LocalBusiness">
      <div class="footer-top">
        <div class="container footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <a routerLink="/" class="footer-logo">
              <div class="logo-icon">
                <i data-lucide="tree-pine"></i>
              </div>
              <span class="logo-text" itemprop="name">Marangoz Atölyesi</span>
            </a>
            <p class="brand-description" itemprop="description">
              15 yılı aşkın deneyimle İstanbul'da el yapımı, özel tasarım ahşap mobilya üretimi yapıyoruz. 
              Kalite ve müşteri memnuniyeti önceliğimizdir.
            </p>
            <div class="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
                <i data-lucide="facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
                <i data-lucide="instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">
                <i data-lucide="twitter"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
                <i data-lucide="youtube"></i>
              </a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div class="footer-section">
            <h4>Hızlı Linkler</h4>
            <nav aria-label="Footer navigation">
              <ul>
                <li><a routerLink="/">Ana Sayfa</a></li>
                <li><a routerLink="/products">Tüm Ürünler</a></li>
                <li><a routerLink="/portfolio">Portfolyo</a></li>
                <li><a routerLink="/contact">İletişim</a></li>
                <li><a routerLink="/login">Hesabım</a></li>
              </ul>
            </nav>
          </div>
          
          <!-- Categories -->
          <div class="footer-section">
            <h4>Kategoriler</h4>
            <nav aria-label="Category navigation">
              <ul>
                <li><a routerLink="/products" [queryParams]="{category: 'mutfak-dolaplari'}">Mutfak Dolapları</a></li>
                <li><a routerLink="/products" [queryParams]="{category: 'banyo-dolaplari'}">Banyo Dolapları</a></li>
                <li><a routerLink="/products" [queryParams]="{category: 'salon-mobilyalari'}">Salon Mobilyaları</a></li>
                <li><a routerLink="/products" [queryParams]="{category: 'yatak-odasi'}">Yatak Odası</a></li>
                <li><a routerLink="/products" [queryParams]="{category: 'kapilar'}">Kapılar</a></li>
              </ul>
            </nav>
          </div>
          
          <!-- Contact Info -->
          <div class="footer-section footer-contact">
            <h4>İletişim</h4>
            <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
              <div class="contact-item">
                <i data-lucide="map-pin"></i>
                <div>
                  <span itemprop="streetAddress">Pendik Sanayi Sitesi</span><br>
                  <span itemprop="addressLocality">İstanbul</span>, <span itemprop="addressCountry">Türkiye</span>
                </div>
              </div>
            </address>
            <div class="contact-item">
              <i data-lucide="phone"></i>
              <a href="tel:+905551234567" itemprop="telephone">+90 555 123 4567</a>
            </div>
            <div class="contact-item">
              <i data-lucide="mail"></i>
              <a href="mailto:info@marangozatolyesi.com" itemprop="email">info&#64;marangozatolyesi.com</a>
            </div>
            <div class="contact-item">
              <i data-lucide="clock"></i>
              <span>Pzt - Cmt: 09:00 - 18:00</span>
            </div>
            
            <a href="https://wa.me/905551234567" target="_blank" class="whatsapp-btn">
              <i data-lucide="message-circle"></i>
              WhatsApp ile Yaz
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="container footer-bottom-content">
          <p>&copy; {{ currentYear }} Marangoz Atölyesi. Tüm hakları saklıdır.</p>
          <div class="footer-links">
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Şartları</a>
            <a href="#">KVKK</a>
          </div>
          <div class="payment-methods">
            <span>Güvenli Ödeme:</span>
            <i data-lucide="credit-card"></i>
            <i data-lucide="landmark"></i>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(180deg, var(--primary-800) 0%, var(--primary-900) 100%);
      color: var(--primary-100);
      margin-top: auto;
    }
    
    .footer-top {
      padding: 4rem 0 3rem;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.25fr;
      gap: 3rem;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    
    .footer-logo .logo-icon {
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .footer-logo .logo-icon i {
      width: 24px;
      height: 24px;
      color: var(--accent);
    }
    
    .footer-logo .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      font-family: 'Inter', sans-serif;
    }
    
    .brand-description {
      font-size: 0.9375rem;
      line-height: 1.7;
      opacity: 0.8;
      margin-bottom: 1.5rem;
    }
    
    .social-links {
      display: flex;
      gap: 0.75rem;
    }
    
    .social-links a {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .social-links a i {
      width: 18px;
      height: 18px;
      color: var(--primary-200);
    }
    
    .social-links a:hover {
      background: var(--accent);
    }
    
    .social-links a:hover i {
      color: var(--primary-900);
    }
    
    .footer-section h4 {
      color: white;
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 1.25rem;
      position: relative;
      padding-bottom: 0.75rem;
    }
    
    .footer-section h4::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 32px;
      height: 2px;
      background: var(--accent);
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section li {
      margin-bottom: 0.625rem;
    }
    
    .footer-section a {
      color: var(--primary-200);
      font-size: 0.9375rem;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
    
    .footer-section a:hover {
      color: var(--accent);
      padding-left: 4px;
    }
    
    .footer-contact address {
      font-style: normal;
    }
    
    .contact-item {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
      align-items: flex-start;
    }
    
    .contact-item i {
      width: 20px;
      height: 20px;
      color: var(--accent);
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .contact-item a, .contact-item span {
      color: var(--primary-200);
      font-size: 0.9375rem;
    }
    
    .contact-item a:hover {
      color: var(--accent);
    }
    
    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #25D366;
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      transition: all 0.2s;
    }
    
    .whatsapp-btn i {
      width: 18px;
      height: 18px;
    }
    
    .whatsapp-btn:hover {
      background: #128C7E;
      transform: translateY(-2px);
    }
    
    .footer-bottom {
      background: rgba(0,0,0,0.2);
      padding: 1.25rem 0;
    }
    
    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .footer-bottom p {
      font-size: 0.875rem;
      opacity: 0.7;
      margin: 0;
    }
    
    .footer-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .footer-links a {
      color: var(--primary-200);
      font-size: 0.875rem;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .footer-links a:hover {
      opacity: 1;
    }
    
    .payment-methods {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      opacity: 0.7;
    }
    
    .payment-methods i {
      width: 24px;
      height: 24px;
    }
    
    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .footer-brand {
        grid-column: span 2;
      }
    }
    
    @media (max-width: 640px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      
      .footer-brand {
        grid-column: span 1;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent implements AfterViewInit {
  currentYear = new Date().getFullYear();

  ngAfterViewInit(): void {
    this.initIcons();
  }

  initIcons(): void {
    setTimeout(() => {
      if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
      }
    }, 100);
  }
}
