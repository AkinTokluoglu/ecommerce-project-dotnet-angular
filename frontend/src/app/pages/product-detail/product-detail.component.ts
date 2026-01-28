import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="product-detail-page">
      @if (loading) {
        <div class="loading">
          <div class="spinner"></div>
          <span>Yükleniyor...</span>
        </div>
      } @else if (product) {
        <div class="breadcrumb">
          <a routerLink="/">Ana Sayfa</a> / 
          <a routerLink="/products">Ürünler</a> / 
          <span>{{ product.name }}</span>
        </div>
        
        <div class="product-container">
          <div class="product-gallery">
            <div class="main-image">
              <img [src]="selectedImage" [alt]="product.name">
            </div>
            @if (product.images && product.images.length > 1) {
              <div class="thumbnails">
                @for (image of product.images; track image.id) {
                  <img [src]="image.imageUrl" 
                       [class.active]="selectedImage === image.imageUrl"
                       (click)="selectedImage = image.imageUrl"
                       [alt]="product.name">
                }
              </div>
            }
          </div>
          
          <div class="product-info">
            <span class="category">{{ product.categoryName }}</span>
            <h1>{{ product.name }}</h1>
            <p class="price">{{ calculateTotalPrice() | number:'1.0-0' }} ₺</p>
            
            <div class="stock-status" [class.low]="product.stockQuantity <= 5">
              @if (product.stockQuantity > 0) {
                <span>✓ Stokta {{ product.stockQuantity }} adet</span>
              } @else {
                <span class="out">✗ Stokta yok</span>
              }
            </div>
            
            <p class="description">{{ product.description }}</p>
            
            @if (product.customizations && product.customizations.length > 0) {
              <div class="customizations">
                <h3>Özelleştirme Seçenekleri</h3>
                @for (custom of product.customizations; track custom.id) {
                  <div class="custom-option">
                    <label>
                      {{ custom.optionName }}
                      @if (custom.priceModifier > 0) {
                        <span class="price-mod">(+{{ custom.priceModifier }} ₺)</span>
                      }
                    </label>
                    <select [(ngModel)]="selectedOptions[custom.optionName]" (change)="onOptionChange()">
                      <option value="" disabled selected>Seçiniz</option>
                      @for (value of custom.optionValues; track value) {
                        <option [value]="value">{{ value }}</option>
                      }
                    </select>
                  </div>
                }
              </div>
            }
            
            <div class="quantity-selector">
              <label>Adet:</label>
              <button (click)="quantity > 1 && quantity = quantity - 1">−</button>
              <span>{{ quantity }}</span>
              <button (click)="quantity = quantity + 1">+</button>
            </div>
            
            <button class="add-to-cart" (click)="addToCart()" [disabled]="product.stockQuantity === 0 || !areAllOptionsSelected()">
              @if (!areAllOptionsSelected() && product.customizations?.length) {
                <span>Lütfen Seçenekleri Belirleyin</span>
              } @else {
                <span>🛒 Sepete Ekle - {{ calculateTotalPrice() * quantity | number:'1.0-0' }} ₺</span>
              }
            </button>
            
            <div class="features">
              <div class="feature">🚚 Ücretsiz Kargo</div>
              <div class="feature">🔧 Kurulum Dahil</div>
              <div class="feature">📦 2-4 Hafta Teslimat</div>
            </div>
          </div>
        </div>
      } @else {
        <div class="not-found">
          <h2>Ürün Bulunamadı</h2>
          <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <a routerLink="/products" class="btn">Ürünlere Dön</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 80vh;
    }
    
    .breadcrumb {
      margin-bottom: 2rem;
      color: #757575;
      font-size: 0.95rem;
    }
    
    .breadcrumb a {
      color: #5D4037;
      text-decoration: none;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    
    .product-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
    
    .main-image {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      background: #f5f5f5;
    }
    
    .main-image img {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }
    
    .thumbnails {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    
    .thumbnails img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.3s;
      border: 2px solid transparent;
    }
    
    .thumbnails img:hover,
    .thumbnails img.active {
      opacity: 1;
      border-color: #5D4037;
    }
    
    .product-info .category {
      color: #8D6E63;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 1px;
      font-weight: 600;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    .product-info h1 {
      font-size: 2.5rem;
      color: #1a1a1a;
      margin: 0 0 1rem;
      line-height: 1.2;
    }
    
    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #2E7D32;
      margin-bottom: 1.5rem;
    }
    
    .stock-status {
      padding: 0.5rem 1rem;
      background: #E8F5E9;
      color: #2E7D32;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 2rem;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .stock-status.low {
      background: #FFF3E0;
      color: #E65100;
    }
    
    .stock-status .out {
      color: #E53935;
    }
    
    .description {
      color: #555;
      line-height: 1.8;
      margin-bottom: 2.5rem;
      font-size: 1.05rem;
    }
    
    .customizations {
      background: #FAFAFA;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px solid #EEEEEE;
    }
    
    .customizations h3 {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      color: #333;
    }
    
    .custom-option {
      margin-bottom: 1.25rem;
    }
    
    .custom-option:last-child {
      margin-bottom: 0;
    }
    
    .custom-option label {
      display: block;
      margin-bottom: 0.5rem;
      color: #444;
      font-weight: 500;
      font-size: 0.95rem;
    }
    
    .price-mod {
      color: #E65100;
      font-size: 0.85rem;
      margin-left: 0.5rem;
    }
    
    .custom-option select {
      width: 100%;
      padding: 0.85rem;
      border: 1px solid #DDD;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
      color: #333;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    
    .custom-option select:focus {
      outline: none;
      border-color: #5D4037;
    }
    
    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .quantity-selector label {
      font-weight: 600;
      color: #333;
    }
    
    .quantity-selector button {
      width: 44px;
      height: 44px;
      border: 1px solid #DDD;
      background: white;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s;
      color: #333;
    }
    
    .quantity-selector button:hover {
      background: #F5F5F5;
      border-color: #BBB;
    }
    
    .quantity-selector span {
      font-size: 1.2rem;
      font-weight: 600;
      min-width: 30px;
      text-align: center;
    }
    
    .add-to-cart {
      width: 100%;
      padding: 1.25rem 2rem;
      background: #2E7D32;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(46, 125, 50, 0.2);
    }
    
    .add-to-cart:hover:not(:disabled) {
      background: #1B5E20;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
    }
    
    .add-to-cart:disabled {
      background: #E0E0E0;
      color: #9E9E9E;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    
    .features {
      display: flex;
      gap: 1rem;
      margin-top: 2.5rem;
      flex-wrap: wrap;
    }
    
    .feature {
      padding: 0.75rem 1.25rem;
      background: #F5F5F5;
      border-radius: 50px;
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }
    
    .loading, .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      text-align: center;
      color: #666;
    }
    
    .not-found h2 {
      margin-bottom: 1rem;
      color: #333;
    }
    
    .not-found .btn {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 2rem;
      background: #5D4037;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      transition: background 0.2s;
    }

    .not-found .btn:hover {
      background: #4E342E;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #E0E0E0;
      border-top-color: #5D4037;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 900px) {
      .product-container {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      
      .main-image img {
        height: 350px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedImage = '';
  quantity = 1;
  selectedOptions: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loading = true;
      this.apiService.getProductBySlug(slug).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = product.mainImageUrl;
          this.selectedOptions = {}; // Reset options
          this.loading = false;
        },
        error: (err) => {
          console.error('Product error:', err);
          this.loading = false;
        }
      });
    });
  }

  calculateTotalPrice(): number {
    if (!this.product) return 0;

    let total = this.product.price;

    if (this.product.customizations) {
      for (const custom of this.product.customizations) {
        if (this.selectedOptions[custom.optionName]) {
          total += custom.priceModifier;
        }
      }
    }

    return total;
  }

  onOptionChange(): void {
    // Fiyat veya görsel güncellemesi gerekirse burada yapılabilir
  }

  areAllOptionsSelected(): boolean {
    if (!this.product?.customizations) return true;

    for (const custom of this.product.customizations) {
      if (!this.selectedOptions[custom.optionName]) {
        return false;
      }
    }
    return true;
  }

  addToCart(): void {
    if (this.product && this.areAllOptionsSelected()) {
      this.cartService.addToCart({
        productId: this.product.id,
        productName: this.product.name,
        productImage: this.product.mainImageUrl,
        quantity: this.quantity,
        unitPrice: this.calculateTotalPrice(), // Güncel fiyat
        selectedCustomizations: { ...this.selectedOptions }
      });

      this.toastService.success('Ürün sepete eklendi! 🛒');
    }
  }
}
