import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { PortfolioItem } from '../../models';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page-header">
      <h2>Portföy Yönetimi</h2>
      <a routerLink="/admin/portfolio/new" class="btn-primary">
        <i data-lucide="plus"></i> Yeni Proje Ekle
      </a>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Resim</th>
              <th>Başlık</th>
              <th>Kategori</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            @for (item of items; track item.id) {
              <tr>
                <td>
                  <img [src]="item.images[0]" alt="" class="thumb">
                </td>
                <td>
                  <div class="font-medium">{{ item.title }}</div>
                  <small class="text-muted">{{ item.description | slice:0:50 }}...</small>
                </td>
                <td>
                  <span class="badge">{{ item.category }}</span>
                </td>
                <td>{{ item.completedDate | date:'dd.MM.yyyy' }}</td>
                <td>
                  <div class="actions">
                    <a [routerLink]="['/admin/portfolio', item.id]" class="btn-icon">
                      <i data-lucide="edit-2"></i> Düzenle
                    </a>
                    <button class="btn-icon danger" (click)="deleteItem(item)">
                      <i data-lucide="trash-2"></i> Sil
                    </button>
                  </div>
                </td>
              </tr>
            }
            @if (items.length === 0) {
              <tr>
                <td colspan="5" class="text-center">Henüz proje eklenmemiş.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .btn-primary {
      background: #8B4513;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th, .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .thumb {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    .badge {
      background: #eee;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.875rem;
    }

    .btn-icon {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      text-decoration: none;
      color: #6b7280;
    }
    
    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .btn-icon.danger {
      color: #dc3545;
    }

    .btn-icon.danger:hover {
      background: #fff5f5;
    }
    
    .text-center { text-align: center; padding: 2rem; color: #666; }
  `]
})
export class PortfolioListComponent implements OnInit {
  items: PortfolioItem[] = [];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.apiService.getPortfolioItems().subscribe({
      next: (data) => {
        this.items = data;
        setTimeout(() => (window as any).lucide?.createIcons(), 100);
      }
    });
  }

  async deleteItem(item: PortfolioItem) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Proje Sil',
      message: `"${item.title}" projesini silmek istediğinize emin misiniz?`,
      type: 'danger',
      confirmText: 'Sil'
    });

    if (!confirmed) return;

    this.apiService.deletePortfolioItem(item.id).subscribe({
      next: () => {
        this.loadItems();
        this.toastService.success('Proje silindi.');
      },
      error: () => this.toastService.error('Silme işlemi başarısız!')
    });
  }
}
