import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <div class="container">
        <h1>Siparişi Tamamla</h1>
        
        <div class="checkout-grid">
          <!-- Sol Taraf: Form -->
          <div class="checkout-form-section">
            <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Ad Soyad</label>
                <input type="text" formControlName="contactName" class="form-control" placeholder="Adınız ve Soyadınız">
                @if (checkoutForm.get('contactName')?.invalid && checkoutForm.get('contactName')?.touched) {
                  <small class="error">Ad Soyad zorunludur.</small>
                }
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Telefon</label>
                  <input type="tel" formControlName="contactPhone" class="form-control" placeholder="0555 555 55 55">
                  @if (checkoutForm.get('contactPhone')?.invalid && checkoutForm.get('contactPhone')?.touched) {
                    <small class="error">Telefon zorunludur.</small>
                  }
                </div>

                <div class="form-group">
                  <label>E-posta</label>
                  <input type="email" formControlName="contactEmail" class="form-control" placeholder="ornek@email.com">
                  @if (checkoutForm.get('contactEmail')?.invalid && checkoutForm.get('contactEmail')?.touched) {
                    <small class="error">Geçerli bir e-posta adresi giriniz.</small>
                  }
                </div>
              </div>

              <div class="form-group">
                <label>Teslimat Adresi</label>
                <textarea formControlName="shippingAddress" rows="4" placeholder="Adresinizi detaylı bir şekilde yazınız..."></textarea>
                @if (checkoutForm.get('shippingAddress')?.invalid && checkoutForm.get('shippingAddress')?.touched) {
                  <small class="error">Adres alanı zorunludur.</small>
                }
              </div>

              <div class="form-group">
                <label>Sipariş Notu (Opsiyonel)</label>
                <textarea formControlName="notes" rows="2" placeholder="Varsa eklemek istedikleriniz..."></textarea>
              </div>

              <div class="form-group">
                <label>Ödeme Yöntemi</label>
                <div class="payment-methods">
                  <label class="radio-label">
                    <input type="radio" formControlName="paymentMethod" [value]="0">
                    <span>Kredi Kartı</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" formControlName="paymentMethod" [value]="1">
                    <span>Havale / EFT</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" formControlName="paymentMethod" [value]="2">
                    <span>Kapıda Ödeme</span>
                  </label>
                </div>
              </div>

              <button type="submit" class="submit-btn" [disabled]="checkoutForm.invalid || isSubmitting">
                @if (isSubmitting) {
                  <span class="spinner"></span> İşleniyor...
                } @else {
                  Siparişi Onayla
                }
              </button>
            </form>
          </div>

          <!-- Sağ Taraf: Özet -->
          <div class="checkout-summary">
            <h2>Sipariş Özeti</h2>
            <div class="summary-items">
              @for (item of cartService.cart().items; track item.id) {
                <div class="summary-item">
                  <div class="item-info">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-meta">x{{ item.quantity }}</span>
                  </div>
                  <span class="item-price">{{ (item.unitPrice * item.quantity) | number:'1.0-0' }} ₺</span>
                </div>
              }
            </div>
            
            <div class="summary-total">
              <div class="row">
                <span>Ara Toplam</span>
                <span>{{ cartService.cart().totalAmount | number:'1.0-0' }} ₺</span>
              </div>
              <div class="row">
                <span>Kargo</span>
                <span class="free">Ücretsiz</span>
              </div>
              <div class="row total">
                <span>Toplam</span>
                <span>{{ cartService.cart().totalAmount | number:'1.0-0' }} ₺</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
      padding: 2rem 0;
      background: #f9f9f9;
      min-height: 80vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    h1 {
      color: #3E2723;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }
    
    .checkout-form-section, .checkout-summary {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }
    
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      resize: vertical;
      font-family: inherit;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    
    .error {
      color: #d32f2f;
      font-size: 0.85rem;
    }
    
    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .radio-label:hover {
      background: #f5f5f5;
    }
    
    .radio-label input:checked + span {
      font-weight: 700;
      color: #2E7D32;
    }
    
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .summary-items {
      margin-bottom: 2rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }
    
    .item-name {
      display: block;
      color: #333;
    }
    
    .item-meta {
      color: #777;
      font-size: 0.85rem;
    }
    
    .summary-total .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: #555;
    }
    
    .summary-total .total {
      font-size: 1.25rem;
      font-weight: 700;
      color: #3E2723;
      border-top: 1px solid #eee;
      padding-top: 1rem;
      margin-top: 0.5rem;
    }
    
    .free {
      color: #2E7D32;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  apiService = inject(ApiService);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);

  checkoutForm: FormGroup = this.fb.group({
    contactName: ['', Validators.required],
    contactPhone: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    shippingAddress: ['', Validators.required],
    notes: [''],
    paymentMethod: [0, Validators.required] // Default: CreditCard
  });

  isSubmitting = false;

  onSubmit() {
    if (this.checkoutForm.invalid) return;

    const cartItems = this.cartService.cart().items;
    if (cartItems.length === 0) {
      this.toastService.error('Sepetiniz boş!');
      return;
    }

    this.isSubmitting = true;

    // Backend DTO formatına hazırla
    const orderData = {
      contactName: this.checkoutForm.value.contactName,
      contactPhone: this.checkoutForm.value.contactPhone,
      contactEmail: this.checkoutForm.value.contactEmail,
      shippingAddress: this.checkoutForm.value.shippingAddress,
      notes: this.checkoutForm.value.notes,
      paymentMethod: this.checkoutForm.value.paymentMethod,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        customizations: item.selectedCustomizations
      }))
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success', res.orderNumber]);
      },
      error: (err) => {
        console.error('Order failed', err);
        this.toastService.error('Sipariş oluşturulurken bir hata oluştu: ' + (err.error?.message || err.message));
        this.isSubmitting = false;
      }
    });
  }
}
