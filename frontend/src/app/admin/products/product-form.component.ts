import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="product-form-page">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? 'Ürün Düzenle' : 'Yeni Ürün' }}</h1>
          <p>{{ isEdit ? 'Ürün bilgilerini güncelleyin' : 'Yeni bir ürün ekleyin' }}</p>
        </div>
        <a routerLink="/admin/products" class="btn btn-secondary">
          <i data-lucide="arrow-left"></i>
          Geri
        </a>
      </div>
      
      <form (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-grid">
          <!-- Left Column - Main Info -->
          <div class="form-column main">
            <div class="form-section">
              <h3>Temel Bilgiler</h3>
              
              <div class="form-group">
                <label for="name">Ürün Adı *</label>
                <input type="text" id="name" [(ngModel)]="product.name" name="name" required
                       placeholder="Örn: Masif Meşe Yemek Masası">
              </div>
              
              <div class="form-group">
                <label for="description">Açıklama</label>
                <textarea id="description" [(ngModel)]="product.description" name="description"
                          rows="5" placeholder="Ürün hakkında detaylı bilgi..."></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="price">Fiyat (₺) *</label>
                  <input type="number" id="price" [(ngModel)]="product.price" name="price" required
                         min="0" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                  <label for="stock">Stok Miktarı *</label>
                  <input type="number" id="stock" [(ngModel)]="product.stockQuantity" name="stockQuantity" required
                         min="0" placeholder="0">
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3>Görseller</h3>
              <div class="image-upload-area">
                <div class="upload-placeholder" (click)="triggerFileInput()">
                  <i data-lucide="image-plus"></i>
                  <span>Görsel yüklemek için tıklayın</span>
                  <small>PNG, JPG, WebP - Maks 5MB</small>
                </div>
                <input type="file" #fileInput hidden accept="image/*" multiple (change)="onFileSelect($event)">
              </div>
              
              @if (product.mainImageUrl) {
                <div class="current-image">
                  <img [src]="product.mainImageUrl" alt="Mevcut görsel">
                  <span>Mevcut ana görsel</span>
                </div>
              }
              
              <div class="form-group">
                <label for="imageUrl">veya Görsel URL'si</label>
                <input type="url" id="imageUrl" [(ngModel)]="product.mainImageUrl" name="mainImageUrl"
                       placeholder="https://example.com/image.jpg">
              </div>
            </div>
          </div>
          
          <!-- Right Column - Details -->
          <div class="form-column side">
            <div class="form-section">
              <h3>Kategori & Durum</h3>
              
              <div class="form-group">
                <label for="category">Kategori *</label>
                <select id="category" [(ngModel)]="product.categoryId" name="categoryId" required>
                  <option value="">Kategori seçin</option>
                  @for (category of categories; track category.id) {
                    <option [value]="category.id">{{ category.name }}</option>
                  }
                </select>
              </div>
              
              <div class="form-group">
                <label class="toggle-label">
                  <input type="checkbox" [(ngModel)]="product.isActive" name="isActive">
                  <span class="toggle-switch"></span>
                  Ürün Aktif
                </label>
                <small>Aktif ürünler sitede görünür</small>
              </div>
            </div>
            
            <div class="form-section">
              <h3>SEO Ayarları</h3>
              
              <div class="form-group">
                <label for="slug">URL Slug</label>
                <input type="text" id="slug" [(ngModel)]="product.slug" name="slug"
                       placeholder="urun-adi-slug">
                <small>Boş bırakırsanız otomatik oluşturulur</small>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                <i data-lucide="save"></i>
                {{ saving ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Kaydet') }}
              </button>
              <a routerLink="/admin/products" class="btn btn-secondary">İptal</a>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-form-page {
      max-width: 1200px;
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
    
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: var(--gray-100);
      color: var(--gray-700);
    }
    
    .btn-secondary:hover {
      background: var(--gray-200);
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    
    .form-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      margin-bottom: 1.5rem;
    }
    
    .form-section h3 {
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    .form-group:last-child {
      margin-bottom: 0;
    }
    
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 0.5rem;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
    }
    
    .form-group small {
      display: block;
      font-size: 0.75rem;
      color: var(--gray-500);
      margin-top: 0.375rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .image-upload-area {
      margin-bottom: 1rem;
    }
    
    .upload-placeholder {
      border: 2px dashed var(--gray-200);
      border-radius: var(--radius-md);
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .upload-placeholder:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
    }
    
    .upload-placeholder i {
      width: 40px;
      height: 40px;
      color: var(--gray-400);
      margin-bottom: 0.75rem;
    }
    
    .upload-placeholder span {
      display: block;
      font-size: 0.875rem;
      color: var(--gray-600);
      margin-bottom: 0.25rem;
    }
    
    .upload-placeholder small {
      font-size: 0.75rem;
      color: var(--gray-400);
    }
    
    .current-image {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--gray-50);
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }
    
    .current-image img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }
    
    .current-image span {
      font-size: 0.875rem;
      color: var(--gray-600);
    }
    
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    
    .toggle-label input {
      display: none;
    }
    
    .toggle-switch {
      width: 44px;
      height: 24px;
      background: var(--gray-300);
      border-radius: 12px;
      position: relative;
      transition: background 0.2s;
    }
    
    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: transform 0.2s;
    }
    
    .toggle-label input:checked + .toggle-switch {
      background: var(--success);
    }
    
    .toggle-label input:checked + .toggle-switch::after {
      transform: translateX(20px);
    }
    
    .form-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .form-actions .btn-primary {
      flex: 1;
    }
    
    @media (max-width: 1024px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isEdit = false;
  saving = false;
  uploading = false;
  categories: any[] = [];

  product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    categoryId: '',
    slug: '',
    mainImageUrl: '',
    isActive: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.loadProduct(id);
    }
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

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Categories error:', err)
    });
  }

  loadProduct(id: string): void {
    this.apiService.getProductById(id).subscribe({
      next: (data) => {
        this.product = { ...this.product, ...data };
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.uploading = true;
      const file = input.files[0];

      this.apiService.uploadImage(file).subscribe({
        next: (response) => {
          this.product.mainImageUrl = response.imageUrl;
          this.uploading = false;
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.uploading = false;
          this.toastService.error('Resim yüklenirken bir hata oluştu.');
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.product.categoryId) {
      this.toastService.error('Lütfen bir kategori seçin.');
      return;
    }

    this.saving = true;

    const request = this.isEdit
      ? this.apiService.updateProduct(this.product.id, this.product)
      : this.apiService.createProduct(this.product);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.toastService.success(this.isEdit ? 'Ürün güncellendi' : 'Ürün oluşturuldu');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Save failed:', err);
        this.saving = false;
        this.toastService.error('Kaydedilirken bir hata oluştu: ' + (err.error?.message || err.message));
      }
    });
  }
}
