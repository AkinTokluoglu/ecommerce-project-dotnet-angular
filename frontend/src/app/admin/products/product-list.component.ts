import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-management">
      <div class="page-header">
        <div>
          <h1>Ürün Yönetimi</h1>
          <p>Tüm ürünleri görüntüleyin ve yönetin</p>
        </div>
        <a routerLink="/admin/products/new" class="btn btn-primary">
          <i data-lucide="plus"></i>
          Yeni Ürün
        </a>
      </div>
      
      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Ürün ara..." (input)="onSearch($event)">
        </div>
        <div class="filter-actions">
          <select (change)="onCategoryFilter($event)">
            <option value="">Tüm Kategoriler</option>
            @for (category of categories; track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
          <select (change)="onStockFilter($event)">
            <option value="">Tüm Stok</option>
            <option value="in-stock">Stokta Var</option>
            <option value="low-stock">Düşük Stok</option>
            <option value="out-of-stock">Stokta Yok</option>
          </select>
        </div>
      </div>
      
      <!-- Products Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" (change)="toggleAll($event)">
              </th>
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            @for (product of filteredProducts; track product.id) {
              <tr>
                <td>
                  <input type="checkbox" [checked]="selectedProducts.has(product.id)">
                </td>
                <td>
                  <div class="product-cell">
                    <img [src]="product.mainImageUrl" [alt]="product.name">
                    <div class="product-info">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-slug">{{ product.slug }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ product.categoryName || 'Kategori Yok' }}</td>
                <td class="price">{{ product.price | number:'1.0-0' }} ₺</td>
                <td>
                  <span class="stock-badge" [class.low]="product.stockQuantity <= 5" [class.out]="product.stockQuantity === 0">
                    {{ product.stockQuantity }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class.active]="product.isActive" [class.inactive]="!product.isActive">
                    {{ product.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <a [routerLink]="['/admin/products', product.id]" class="action-btn edit" title="Düzenle">
                      <i data-lucide="pencil"></i>
                    </a>
                    <button (click)="deleteProduct(product)" class="action-btn delete" title="Sil">
                      <i data-lucide="trash-2"></i>
                    </button>
                    <a [routerLink]="['/product', product.slug]" target="_blank" class="action-btn view" title="Görüntüle">
                      <i data-lucide="external-link"></i>
                    </a>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty">
                  <i data-lucide="package-x"></i>
                  <span>Henüz ürün eklenmemiş</span>
                  <a routerLink="/admin/products/new" class="btn btn-primary">İlk Ürünü Ekle</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      @if (totalPages > 1) {
        <div class="pagination">
          <button [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">
            <i data-lucide="chevron-left"></i>
          </button>
          @for (page of pages; track page) {
            <button [class.active]="page === currentPage" (click)="goToPage(page)">{{ page }}</button>
          }
          <button [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-management {
      max-width: 1400px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    
    .page-header h1 {
      font-size: 1.5rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .page-header p {
      color: var(--gray-500);
      font-size: 0.875rem;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn i {
      width: 18px;
      height: 18px;
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-primary:hover {
      background: var(--primary-700);
    }
    
    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
    }
    
    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--gray-400);
    }
    
    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    .filter-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .filter-actions select {
      padding: 0.75rem 2rem 0.75rem 1rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
    }
    
    .table-container {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .data-table th {
      background: var(--gray-50);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--gray-500);
      letter-spacing: 0.05em;
    }
    
    .product-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .product-cell img {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }
    
    .product-info {
      display: flex;
      flex-direction: column;
    }
    
    .product-name {
      font-weight: 500;
      color: var(--gray-800);
    }
    
    .product-slug {
      font-size: 0.75rem;
      color: var(--gray-400);
    }
    
    .price {
      font-weight: 600;
      color: var(--gray-800);
    }
    
    .stock-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--success-100);
      color: var(--success-600);
    }
    
    .stock-badge.low {
      background: #FEF3C7;
      color: #D97706;
    }
    
    .stock-badge.out {
      background: var(--error-100);
      color: var(--error-600);
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .status-badge.active {
      background: var(--success-100);
      color: var(--success-600);
    }
    
    .status-badge.inactive {
      background: var(--gray-100);
      color: var(--gray-500);
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .action-btn i {
      width: 16px;
      height: 16px;
    }
    
    .action-btn.edit {
      background: var(--primary-100);
      color: var(--primary);
    }
    
    .action-btn.edit:hover {
      background: var(--primary-200);
    }
    
    .action-btn.delete {
      background: var(--error-100);
      color: var(--error);
    }
    
    .action-btn.delete:hover {
      background: var(--error);
      color: white;
    }
    
    .action-btn.view {
      background: var(--gray-100);
      color: var(--gray-600);
    }
    
    .action-btn.view:hover {
      background: var(--gray-200);
    }
    
    .empty {
      text-align: center;
      padding: 4rem 2rem !important;
    }
    
    .empty i {
      width: 48px;
      height: 48px;
      color: var(--gray-300);
      margin-bottom: 1rem;
    }
    
    .empty span {
      display: block;
      color: var(--gray-500);
      margin-bottom: 1rem;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    
    .pagination button {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .pagination button i {
      width: 16px;
      height: 16px;
    }
    
    .pagination button:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary);
    }
    
    .pagination button.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
    
    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  selectedProducts = new Set<string>();

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];

  searchTerm = '';
  categoryFilter = '';
  stockFilter = '';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

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

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        setTimeout(() => this.initIcons(), 100);
      },
      error: (err) => console.error('Products error:', err)
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Categories error:', err)
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(p => p.categoryId === this.categoryFilter);
    }

    // Stock filter
    if (this.stockFilter) {
      switch (this.stockFilter) {
        case 'in-stock':
          filtered = filtered.filter(p => p.stockQuantity > 5);
          break;
        case 'low-stock':
          filtered = filtered.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(p => p.stockQuantity === 0);
          break;
      }
    }

    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryFilter(event: Event): void {
    this.categoryFilter = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onStockFilter(event: Event): void {
    this.stockFilter = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filteredProducts.forEach(p => this.selectedProducts.add(p.id));
    } else {
      this.selectedProducts.clear();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  async deleteProduct(product: Product) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Ürünü Sil',
      message: `"${product.name}" ürününü silmek istediğinize emin misiniz?`,
      type: 'danger',
      confirmText: 'Sil'
    });

    if (confirmed) {
      this.apiService.deleteProduct(product.id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.applyFilters();
          this.toastService.success('Ürün silindi.');
        },
        error: () => this.toastService.error('Silme başarısız!')
      });
    }
  }
}
