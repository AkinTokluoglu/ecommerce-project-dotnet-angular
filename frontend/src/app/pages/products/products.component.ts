import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="products-page">
      <div class="page-header">
        <h1>Ürünlerimiz</h1>
        <p>El yapımı, özel tasarım ahşap mobilyalarımızı keşfedin</p>
      </div>
      
      <div class="products-container">
        <!-- Sidebar Filters -->
        <aside class="sidebar">
          <div class="filter-group search-group">
            <h3>Arama</h3>
            <div class="search-box">
              <i data-lucide="search"></i>
              <input type="text" [(ngModel)]="searchTerm" (input)="onFilterChange()" placeholder="Ürün ara...">
            </div>
          </div>

          <div class="filter-group">
            <h3>Kategoriler</h3>
            <ul class="category-list">
              <li>
                <a [class.active]="!selectedCategorySlug" (click)="selectCategory(null)">
                  Tüm Ürünler
                </a>
              </li>
              @for (category of categories; track category.id) {
                <li>
                  <a [class.active]="selectedCategorySlug === category.slug" 
                     (click)="selectCategory(category.slug)">
                    {{ category.name }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <div class="filter-group">
            <h3>Stok Durumu</h3>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="inStockOnly" (change)="onFilterChange()">
              Sadece Stoktakiler
            </label>
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="products-main">
          @if (loading) {
            <div class="loading">
              <div class="spinner"></div>
              <span>Ürünler yükleniyor...</span>
            </div>
          } @else if (filteredProducts.length === 0) {
            <div class="no-products">
              <i data-lucide="search-x"></i>
              <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
              <button (click)="resetFilters()" class="btn-reset">Filtreleri Temizle</button>
            </div>
          } @else {
            <div class="products-info-bar">
              <span>{{ filteredProducts.length }} ürün listeleniyor</span>
              <select (change)="onSortChange($event)">
                <option value="newest">En Yeniler</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
              </select>
            </div>

            <div class="products-grid">
              @for (product of filteredProducts; track product.id) {
                <div class="product-card">
                  <a [routerLink]="['/product', product.slug]" class="product-link">
                    <div class="product-image">
                      <img [src]="product.mainImageUrl" [alt]="product.name" loading="lazy">
                      @if (product.stockQuantity <= 5 && product.stockQuantity > 0) {
                        <span class="badge low-stock">Son {{ product.stockQuantity }}</span>
                      }
                      @if (product.stockQuantity === 0) {
                        <span class="badge out-of-stock">Tükendi</span>
                      }
                      <div class="overlay">
                        <span>İncele</span>
                      </div>
                    </div>
                    <div class="product-info">
                      <span class="category-tag">{{ product.categoryName }}</span>
                      <h3>{{ product.name }}</h3>
                      <p class="description">{{ product.description | slice:0:80 }}...</p>
                      <div class="price-row">
                        <span class="price">{{ product.price | number:'1.0-0' }} ₺</span>
                      </div>
                    </div>
                  </a>
                  <button class="add-to-cart" (click)="addToCart(product)" [disabled]="product.stockQuantity === 0">
                    <span *ngIf="product.stockQuantity > 0">Sepete Ekle</span>
                    <span *ngIf="product.stockQuantity === 0">Stokta Yok</span>
                  </button>
                </div>
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      min-height: 100vh;
      background: #F9FAFB;
    }
    
    .page-header {
      background: linear-gradient(135deg, #4A3428 0%, #2D1B15 100%);
      padding: 4rem 2rem;
      text-align: center;
      color: white;
    }
    
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-family: 'Playfair Display', serif;
    }
    
    .page-header p {
      opacity: 0.9;
      font-size: 1.1rem;
    }
    
    .products-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2.5rem;
    }
    
    /* Sidebar Styles */
    .sidebar {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }
    
    .filter-group {
      margin-bottom: 2rem;
    }
    
    .filter-group:last-child {
      margin-bottom: 0;
    }
    
    .filter-group h3 {
      font-size: 1rem;
      color: #111827;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    .search-box {
      position: relative;
    }
    
    .search-box i {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #9CA3AF;
      width: 18px;
    }
    
    .search-box input {
      width: 100%;
      padding: 0.75rem 0.75rem 0.75rem 2.25rem;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    
    .category-list {
      list-style: none;
      padding: 0;
    }
    
    .category-list li {
      margin-bottom: 0.25rem;
    }
    
    .category-list a {
      display: block;
      padding: 0.5rem 0.75rem;
      color: #4B5563;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.95rem;
    }
    
    .category-list a:hover,
    .category-list a.active {
      background: #F3F4F6;
      color: #4A3428;
      font-weight: 500;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4B5563;
      cursor: pointer;
      font-size: 0.95rem;
    }
    
    /* Main Content */
    .products-info-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      color: #6B7280;
      font-size: 0.9rem;
    }
    
    .products-info-bar select {
      padding: 0.5rem 2rem 0.5rem 1rem;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background-color: white;
      cursor: pointer;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 2rem;
    }
    
    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #E5E7EB;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border-color: #D1D5DB;
    }
    
    .product-link {
      text-decoration: none;
      color: inherit;
      flex: 1;
    }
    
    .product-image {
      position: relative;
      padding-top: 100%; /* 1:1 Aspect Ratio */
      overflow: hidden;
      background: #F3F4F6;
    }
    
    .product-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    .product-card:hover .product-image img {
      transform: scale(1.08);
    }
    
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .product-card:hover .overlay {
      opacity: 1;
    }
    
    .overlay span {
      background: white;
      color: #111827;
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      z-index: 2;
    }
    
    .low-stock {
      background: #FEF3C7;
      color: #D97706;
    }
    
    .out-of-stock {
      background: #FEE2E2;
      color: #DC2626;
    }
    
    .product-info {
      padding: 1.25rem;
    }
    
    .category-tag {
      font-size: 0.75rem;
      color: #4A3428;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    .product-info h3 {
      font-size: 1.1rem;
      color: #111827;
      margin: 0 0 0.5rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .description {
      font-size: 0.875rem;
      color: #6B7280;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }
    
    .add-to-cart {
      width: 100%;
      padding: 1rem;
      background: #F9FAFB;
      color: #111827;
      border: none;
      border-top: 1px solid #E5E7EB;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .add-to-cart:hover:not(:disabled) {
      background: #4A3428;
      color: white;
    }
    
    .add-to-cart:disabled {
      background: #F3F4F6;
      color: #9CA3AF;
      cursor: not-allowed;
    }
    
    .loading, .no-products {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      text-align: center;
      color: #6B7280;
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
    }
    
    .no-products i {
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      color: #9CA3AF;
    }
    
    .btn-reset {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #4A3428;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #E5E7EB;
      border-top-color: #4A3428;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .products-container {
        grid-template-columns: 1fr;
        padding: 1rem;
      }
      
      .sidebar {
        position: static;
        margin-bottom: 2rem;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  // Filters
  selectedCategorySlug: string | null = null;
  searchTerm: string = '';
  inStockOnly: boolean = false;
  sortOption: string = 'newest';

  loading = true;

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // combineLatest: Hem kategorileri, hem ürünleri, hem URL parametrelerini bekle
    combineLatest([
      this.apiService.getCategories(),
      this.apiService.getProducts(),
      this.route.queryParams
    ]).subscribe({
      next: ([categories, products, params]) => {
        this.categories = categories;
        this.products = products;

        // URL'den kategori seçimi
        if (params['category']) {
          this.selectedCategorySlug = params['category'];
        }

        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Data loading error:', err);
        this.loading = false;
      }
    });
  }

  selectCategory(slug: string | null): void {
    this.selectedCategorySlug = slug;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCategorySlug = null;
    this.searchTerm = '';
    this.inStockOnly = false;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];

    // 1. Category Filter
    if (this.selectedCategorySlug) {
      const category = this.categories.find(c => c.slug === this.selectedCategorySlug);
      if (category) {
        result = result.filter(p => p.categoryId === category.id);
      }
    }

    // 2. Search Filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // 3. Stock Filter
    if (this.inStockOnly) {
      result = result.filter(p => p.stockQuantity > 0);
    }

    // 4. Sorting
    switch (this.sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Varsayılan sıralama (örneğin ID'ye veya CreatedAt'e göre)
        // Şimdilik dokunmuyoruz veya CreatedAt varsa ona göre sıralarız
        break;
    }

    this.filteredProducts = result;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.mainImageUrl,
      quantity: 1,
      unitPrice: product.price
    });
  }
}
