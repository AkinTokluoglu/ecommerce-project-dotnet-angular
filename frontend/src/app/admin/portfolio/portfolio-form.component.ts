import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-portfolio-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-page-header">
      <h2>{{ isEditMode ? 'Projeyi Düzenle' : 'Yeni Proje Ekle' }}</h2>
    </div>

    <div class="card">
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label>Proje Başlığı</label>
          <input type="text" [(ngModel)]="model.title" name="title" required class="form-control">
        </div>

        <div class="form-group">
          <label>Kategori</label>
          <select [(ngModel)]="model.category" name="category" required class="form-control">
            <option value="">Seçiniz</option>
            <option value="Mutfak">Mutfak</option>
            <option value="Banyo">Banyo</option>
            <option value="Salon">Salon</option>
            <option value="Yatak Odası">Yatak Odası</option>
            <option value="Yemek Odası">Yemek Odası</option>
            <option value="Ofis">Ofis</option>
            <option value="Dış Mekan">Dış Mekan</option>
          </select>
        </div>

        <div class="form-group">
          <label>Açıklama</label>
          <textarea [(ngModel)]="model.description" name="description" rows="4" class="form-control"></textarea>
        </div>

        <div class="form-group">
          <label>Tarih</label>
          <input type="date" [(ngModel)]="dateStr" name="completedDate" required class="form-control">
        </div>

        <div class="form-group">
          <label>Görseller</label>
          <div class="image-upload-area">
            <input type="file" multiple (change)="onFileSelected($event)" accept="image/*">
            <p>Resimleri seçmek için tıklayın veya sürükleyin</p>
          </div>
          
          <div class="image-preview-list">
             @for (img of model.images; track img; let i = $index) {
               <div class="preview-item">
                 <img [src]="img" class="preview-img">
                 <button type="button" class="remove-btn" (click)="removeImage(i)">×</button>
               </div>
             }
          </div>
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/admin/portfolio" class="btn-secondary">İptal</button>
          <button type="submit" [disabled]="!form.valid || model.images.length === 0" class="btn-primary">
            {{ isSubmitting ? 'Kaydediliyor...' : 'Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      max-width: 800px;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
    }

    .image-upload-area {
      border: 2px dashed #d1d5db;
      padding: 2rem;
      text-align: center;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
    }

    .image-upload-area input {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .image-preview-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .preview-item {
      position: relative;
      aspect-ratio: 1;
    }

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .remove-btn {
      position: absolute;
      top: -5px;
      right: -5px;
      background: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary {
      background: #8B4513;
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class PortfolioFormComponent implements OnInit {
  model = {
    title: '',
    category: '',
    description: '',
    images: [] as string[]
  };
  dateStr = new Date().toISOString().split('T')[0];
  isSubmitting = false;
  isEditMode = false;
  itemId: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditMode = true;
      this.loadItem(this.itemId);
    }
  }

  loadItem(id: string) {
    this.apiService.getPortfolioItemById(id).subscribe({
      next: (item) => {
        this.model = {
          title: item.title,
          category: item.category,
          description: item.description,
          images: item.images
        };
        this.dateStr = new Date(item.completedDate).toISOString().split('T')[0];
      },
      error: () => {
        this.toastService.error('Proje yüklenirken hata oluştu.');
        this.router.navigate(['/admin/portfolio']);
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.apiService.uploadImage(file).subscribe({
          next: (res: any) => {
            this.model.images.push(res.imageUrl || res.url);
          },
          error: (err) => this.toastService.error('Resim yüklenirken hata oluştu')
        });
      }
    }
  }

  removeImage(index: number) {
    this.model.images.splice(index, 1);
  }

  onSubmit() {
    this.isSubmitting = true;
    const request = {
      ...this.model,
      completedDate: new Date(this.dateStr)
    };

    if (this.isEditMode && this.itemId) {
      this.apiService.updatePortfolioItem(this.itemId, request).subscribe({
        next: () => {
          this.toastService.success('Proje güncellendi');
          this.router.navigate(['/admin/portfolio']);
        },
        error: (err) => {
          this.toastService.error('Güncelleme başarısız: ' + err.message);
          this.isSubmitting = false;
        }
      });
    } else {
      this.apiService.createPortfolioItem(request).subscribe({
        next: () => {
          this.toastService.success('Proje oluşturuldu');
          this.router.navigate(['/admin/portfolio']);
        },
        error: (err) => {
          this.toastService.error('Kaydetme başarısız: ' + err.message);
          this.isSubmitting = false;
        }
      });
    }
  }
}
