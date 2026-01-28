import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="category-management">
      <div class="page-header">
        <div>
          <h1>Kategori Yönetimi</h1>
          <p>Kategorileri oluşturun ve düzenleyin</p>
        </div>
        <button (click)="showAddModal = true" class="btn btn-primary">
          <i data-lucide="plus"></i>
          Yeni Kategori
        </button>
      </div>
      
      <!-- Categories Grid -->
      <div class="categories-grid">
        @for (category of categories; track category.id) {
          <div class="category-card">
            <div class="category-icon">
              <i [attr.data-lucide]="getCategoryIcon(category.slug)"></i>
            </div>
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description || 'Açıklama yok' }}</p>
              <span class="product-count">{{ category.productCount || 0 }} ürün</span>
            </div>
            <div class="category-actions">
              <button (click)="editCategory(category)" class="action-btn edit">
                <i data-lucide="pencil"></i>
              </button>
              <button (click)="deleteCategory(category)" class="action-btn delete">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <i data-lucide="folder-plus"></i>
            <h3>Henüz kategori yok</h3>
            <p>İlk kategorinizi ekleyerek başlayın</p>
            <button (click)="showAddModal = true" class="btn btn-primary">
              <i data-lucide="plus"></i>
              Kategori Ekle
            </button>
          </div>
        }
      </div>
      
      <!-- Add/Edit Modal -->
      @if (showAddModal || editingCategory) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori' }}</h2>
              <button (click)="closeModal()" class="close-btn">
                <i data-lucide="x"></i>
              </button>
            </div>
            <form (ngSubmit)="onSubmit()">
              <div class="modal-body">
                <div class="form-group">
                  <label>Kategori Adı *</label>
                  <input type="text" [(ngModel)]="formData.name" name="name" required
                         placeholder="Örn: Mutfak Dolapları">
                </div>
                <div class="form-group">
                  <label>Açıklama</label>
                  <textarea [(ngModel)]="formData.description" name="description" rows="3"
                            placeholder="Kategori hakkında kısa açıklama..."></textarea>
                </div>
                <div class="form-group">
                  <label>Sıralama</label>
                  <input type="number" [(ngModel)]="formData.displayOrder" name="displayOrder"
                         min="0" placeholder="0">
                </div>
                <div class="form-group">
                  <label>Üst Kategori</label>
                  <select [(ngModel)]="formData.parentCategoryId" name="parentCategoryId">
                    <option value="">Ana Kategori</option>
                    @for (cat of categories; track cat.id) {
                      @if (cat.id !== formData.id) {
                        <option [value]="cat.id">{{ cat.name }}</option>
                      }
                    }
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" (click)="closeModal()" class="btn btn-secondary">İptal</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  {{ saving ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Ekle') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .category-management {
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
    
    .btn i { width: 18px; height: 18px; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-700); }
    .btn-secondary { background: var(--gray-100); color: var(--gray-700); }
    .btn-secondary:hover { background: var(--gray-200); }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .category-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      transition: all 0.2s;
    }
    
    .category-card:hover {
      box-shadow: var(--shadow-md);
    }
    
    .category-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-100), var(--accent-100));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .category-icon i {
      width: 24px;
      height: 24px;
      color: var(--primary);
    }
    
    .category-info {
      flex: 1;
    }
    
    .category-info h3 {
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .category-info p {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 0.5rem;
    }
    
    .product-count {
      font-size: 0.75rem;
      color: var(--primary);
      font-weight: 500;
    }
    
    .category-actions {
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
    
    .action-btn i { width: 16px; height: 16px; }
    .action-btn.edit { background: var(--primary-100); color: var(--primary); }
    .action-btn.edit:hover { background: var(--primary-200); }
    .action-btn.delete { background: var(--error-100); color: var(--error); }
    .action-btn.delete:hover { background: var(--error); color: white; }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
    }
    
    .empty-state i {
      width: 64px;
      height: 64px;
      color: var(--gray-300);
      margin-bottom: 1rem;
    }
    
    .empty-state h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .empty-state p {
      color: var(--gray-500);
      margin-bottom: 1.5rem;
    }
    
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    
    .modal {
      background: white;
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 480px;
      box-shadow: var(--shadow-2xl);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .modal-header h2 {
      font-size: 1.125rem;
      font-family: 'Inter', sans-serif;
    }
    
    .close-btn {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--gray-400);
    }
    
    .close-btn:hover { color: var(--gray-600); }
    .close-btn i { width: 20px; height: 20px; }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group:last-child { margin-bottom: 0; }
    
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
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    .modal-footer {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--gray-100);
    }
  `]
})
export class CategoryListComponent implements OnInit, AfterViewInit {
    categories: any[] = [];
    showAddModal = false;
    editingCategory: any = null;
    saving = false;

    formData = {
        id: '',
        name: '',
        description: '',
        displayOrder: 0,
        parentCategoryId: ''
    };

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
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

    loadCategories(): void {
        this.apiService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
                setTimeout(() => this.initIcons(), 100);
            },
            error: (err) => console.error('Categories error:', err)
        });
    }

    getCategoryIcon(slug: string): string {
        const icons: { [key: string]: string } = {
            'mutfak-dolaplari': 'chef-hat',
            'banyo-dolaplari': 'bath',
            'salon-mobilyalari': 'sofa',
            'yatak-odasi': 'bed-double',
            'kapilar': 'door-open'
        };
        return icons[slug] || 'folder';
    }

    editCategory(category: any): void {
        this.editingCategory = category;
        this.formData = {
            id: category.id,
            name: category.name,
            description: category.description || '',
            displayOrder: category.displayOrder || 0,
            parentCategoryId: category.parentCategoryId || ''
        };
        setTimeout(() => this.initIcons(), 100);
    }

    deleteCategory(category: any): void {
        if (confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) {
            console.log('Delete category:', category.id);
        }
    }

    closeModal(): void {
        this.showAddModal = false;
        this.editingCategory = null;
        this.resetForm();
    }

    resetForm(): void {
        this.formData = {
            id: '',
            name: '',
            description: '',
            displayOrder: 0,
            parentCategoryId: ''
        };
    }

    onSubmit(): void {
        this.saving = true;

        setTimeout(() => {
            this.saving = false;
            this.closeModal();
            this.loadCategories();
        }, 1000);
    }
}
