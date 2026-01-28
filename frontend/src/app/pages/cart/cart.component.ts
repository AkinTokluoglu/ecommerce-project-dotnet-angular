import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <div class="page-header">
        <h1>🛒 Sepetim</h1>
      </div>
      
      <div class="cart-container">
        @if (cartService.cart().items.length === 0) {
          <div class="empty-cart">
            <span class="empty-icon">🛒</span>
            <h2>Sepetiniz Boş</h2>
            <p>Henüz sepetinize ürün eklemediniz.</p>
            <a routerLink="/products" class="btn-shop">Alışverişe Başla</a>
          </div>
        } @else {
          <div class="cart-items">
            @for (item of cartService.cart().items; track item.id) {
              <div class="cart-item">
                <img [src]="item.productImage" [alt]="item.productName" class="item-image">
                <div class="item-details">
                  <h3>{{ item.productName }}</h3>
                  
                  @if (item.selectedCustomizations) {
                    <div class="item-options">
                      @for (option of objectKeys(item.selectedCustomizations); track option) {
                        <span class="option-tag">{{ option }}: {{ item.selectedCustomizations[option] }}</span>
                      }
                    </div>
                  }
                  
                  <p class="item-price">{{ item.unitPrice | number:'1.0-0' }} ₺</p>
                </div>
                <div class="item-quantity">
                  <button (click)="updateQuantity(item.id!, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item.id!, item.quantity + 1)">+</button>
                </div>
                <div class="item-total">
                  {{ item.unitPrice * item.quantity | number:'1.0-0' }} ₺
                </div>
                <button class="remove-btn" (click)="removeItem(item.id!)" title="Sepetten Çıkar">🗑️</button>
              </div>
            }
          </div>
          
          <div class="cart-summary">
            <div class="summary-row">
              <span>Ara Toplam:</span>
              <span>{{ cartService.cart().totalAmount | number:'1.0-0' }} ₺</span>
            </div>
            <div class="summary-row">
              <span>Kargo:</span>
              <span class="free">Ücretsiz</span>
            </div>
            <div class="summary-row total">
              <span>Toplam:</span>
              <span>{{ cartService.cart().totalAmount | number:'1.0-0' }} ₺</span>
            </div>
            <button type="button" class="checkout-btn" (click)="router.navigate(['/checkout'])">Siparişi Tamamla</button>
            <a routerLink="/products" class="continue-shopping">← Alışverişe Devam Et</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      min-height: 80vh;
      background: #FAFAFA;
    }
    
    .page-header {
      background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
      padding: 3rem 2rem;
      text-align: center;
      color: white;
    }
    
    .page-header h1 {
      font-size: 2rem;
      margin: 0;
    }
    
    .cart-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .empty-cart {
      text-align: center;
      padding: 4rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .empty-icon {
      font-size: 5rem;
      display: block;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    .empty-cart h2 {
      color: #3E2723;
      margin-bottom: 0.5rem;
    }
    
    .empty-cart p {
      color: #757575;
      margin-bottom: 2rem;
    }
    
    .btn-shop {
      display: inline-block;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
      color: white;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.3s;
    }
    
    .btn-shop:hover {
      opacity: 0.9;
    }
    
    .cart-items {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
    }
    
    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto auto;
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #EFEBE9;
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .item-details h3 {
      color: #3E2723;
      font-size: 1.1rem;
      margin: 0 0 0.5rem;
    }
    
    .item-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .option-tag {
      font-size: 0.85rem;
      background: #F5F5F5;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      color: #666;
    }
    
    .item-price {
      color: #757575;
      font-weight: 500;
      margin: 0;
    }
    
    .item-quantity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .item-quantity button {
      width: 32px;
      height: 32px;
      border: 1px solid #E0E0E0;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .item-quantity button:hover {
      background: #F5F5F5;
      border-color: #BDBDBD;
    }
    
    .item-quantity span {
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }
    
    .item-total {
      font-weight: 700;
      color: #2E7D32;
      min-width: 100px;
      text-align: right;
      font-size: 1.1rem;
    }
    
    .remove-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.4;
      transition: opacity 0.2s;
      padding: 0.5rem;
    }
    
    .remove-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .cart-summary {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #F5F5F5;
      color: #555;
    }
    
    .summary-row.total {
      font-size: 1.4rem;
      font-weight: 700;
      color: #3E2723;
      border-bottom: none;
      padding-top: 1.5rem;
      margin-top: 0.5rem;
    }
    
    .free {
      color: #2E7D32;
      font-weight: 600;
    }
    
    .checkout-btn {
      width: 100%;
      padding: 1.25rem;
      background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1.5rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .checkout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(46, 125, 50, 0.25);
    }
    
    .continue-shopping {
      display: block;
      text-align: center;
      margin-top: 1.5rem;
      color: #5D4037;
      text-decoration: none;
      font-weight: 500;
    }
    
    .continue-shopping:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 1rem;
        position: relative;
      }
      
      .item-quantity {
        grid-column: 2;
        justify-self: start;
      }
      
      .item-total {
        grid-column: 2;
        justify-self: start;
        text-align: left;
      }
      
      .remove-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }
    }
  `]
})

export class CartComponent {
  router = inject(Router);
  cartService = inject(CartService);
  confirmationService = inject(ConfirmationService);

  constructor() { }

  updateQuantity(cartItemId: string, quantity: number): void {
    this.cartService.updateQuantity(cartItemId, quantity);
  }

  async removeItem(cartItemId: string) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Ürünü Sil',
      message: 'Ürünü sepetten çıkarmak istediğinize emin misiniz?',
      type: 'danger',
      confirmText: 'Çıkar'
    });

    if (confirmed) {
      this.cartService.removeFromCart(cartItemId);
    }
  }

  // HTML şablonunda Object.keys kullanabilmek için helper
  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
