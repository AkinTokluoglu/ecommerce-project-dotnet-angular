import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-order-success',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="success-page">
      <div class="success-card">
        <div class="icon-wrapper">
          <i data-lucide="check" class="success-icon"></i>
        </div>
        <h1>Siparişiniz Alındı!</h1>
        <p class="message">Siparişiniz başarıyla oluşturuldu.</p>
        
        @if (orderNumber) {
          <div class="order-info">
            <span class="label">Sipariş No:</span>
            <span class="number">{{ orderNumber }}</span>
          </div>
        }
        
        <p class="description">
          Sipariş detaylarınıza "Siparişlerim" sayfasından ulaşabilirsiniz.
          Size ayrıca bir onay e-postası gönderilecektir.
        </p>
        
        <div class="actions">
          <a routerLink="/products" class="btn-primary">Alışverişe Devam Et</a>
          <!-- <a routerLink="/profile/orders" class="btn-secondary">Siparişlerim</a> -->
        </div>
      </div>
    </div>
  `,
    styles: [`
    .success-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9f9f9;
      padding: 2rem;
    }
    
    .success-card {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    
    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: #E8F5E9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    
    .success-icon {
      width: 40px;
      height: 40px;
      color: #2E7D32;
    }
    
    h1 {
      color: #3E2723;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }
    
    .message {
      color: #2E7D32;
      font-weight: 500;
      margin-bottom: 2rem;
    }
    
    .order-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .order-info .label {
      color: #666;
    }
    
    .order-info .number {
      font-weight: 700;
      color: #333;
    }
    
    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }
    
    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
    }
    
    .btn-secondary {
      background: white;
      color: #5D4037;
      border: 1px solid #D7CCC8;
      padding: 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
    
    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
    }
  `]
})
export class OrderSuccessComponent {
    @Input() orderNumber?: string;

    ngAfterViewInit() {
        if (typeof (window as any).lucide !== 'undefined') {
            (window as any).lucide.createIcons();
        }
    }
}
