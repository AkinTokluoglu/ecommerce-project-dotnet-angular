import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon products">
            <i data-lucide="package"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.products }}</span>
            <span class="stat-label">Toplam Ürün</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon categories">
            <i data-lucide="folder-tree"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.categories }}</span>
            <span class="stat-label">Kategori</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orders">
            <i data-lucide="shopping-cart"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.orders }}</span>
            <span class="stat-label">Sipariş</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon revenue">
            <i data-lucide="banknote"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.revenue | number:'1.0-0' }} ₺</span>
            <span class="stat-label">Toplam Gelir</span>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="section">
        <h2>Hızlı İşlemler</h2>
        <div class="quick-actions">
          <a routerLink="/admin/products/new" class="action-card">
            <i data-lucide="plus-circle"></i>
            <span>Yeni Ürün Ekle</span>
          </a>
          <a routerLink="/admin/categories/new" class="action-card">
            <i data-lucide="folder-plus"></i>
            <span>Yeni Kategori</span>
          </a>
          <a routerLink="/admin/orders" class="action-card">
            <i data-lucide="clipboard-list"></i>
            <span>Siparişleri Gör</span>
          </a>
          <a routerLink="/admin/messages" class="action-card">
            <i data-lucide="mail"></i>
            <span>Mesajlar</span>
          </a>
        </div>
      </div>
      
      <!-- Recent Products & Orders -->
      <div class="two-column">
        <div class="section">
          <div class="section-header">
            <h2>Son Ürünler</h2>
            <a routerLink="/admin/products" class="view-all">Tümünü Gör</a>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                </tr>
              </thead>
              <tbody>
                @for (product of recentProducts; track product.id) {
                  <tr>
                    <td>
                      <div class="product-cell">
                        <img [src]="product.mainImageUrl" [alt]="product.name">
                        <span>{{ product.name }}</span>
                      </div>
                    </td>
                    <td>{{ product.price | number:'1.0-0' }} ₺</td>
                    <td>
                      <span class="stock-badge" [class.low]="product.stockQuantity <= 5">
                        {{ product.stockQuantity }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="empty">Henüz ürün yok</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            <h2>Son Siparişler</h2>
            <a routerLink="/admin/orders" class="view-all">Tümünü Gör</a>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Durum</th>
                  <th>Tutar</th>
                </tr>
              </thead>
              <tbody>
                @for (order of recentOrders; track order.id) {
                  <tr>
                    <td>#{{ order.orderNumber }}</td>
                    <td>
                      <span class="status-badge" [class]="order.status.toLowerCase()">
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td>{{ order.totalAmount | number:'1.0-0' }} ₺</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="empty">Henüz sipariş yok</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: var(--shadow);
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-icon i {
      width: 28px;
      height: 28px;
      color: white;
    }
    
    .stat-icon.products { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
    .stat-icon.categories { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
    .stat-icon.orders { background: linear-gradient(135deg, #10B981, #059669); }
    .stat-icon.revenue { background: linear-gradient(135deg, #F59E0B, #D97706); }
    
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--gray-800);
      font-family: 'Inter', sans-serif;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--gray-500);
    }
    
    .section {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      margin-bottom: 1.5rem;
    }
    
    .section h2 {
      font-size: 1.125rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .section-header h2 {
      margin-bottom: 0;
    }
    
    .view-all {
      color: var(--primary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    
    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: var(--gray-50);
      border-radius: var(--radius-md);
      transition: all 0.2s;
      text-align: center;
    }
    
    .action-card i {
      width: 32px;
      height: 32px;
      color: var(--primary);
    }
    
    .action-card span {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-700);
    }
    
    .action-card:hover {
      background: var(--primary-100);
      transform: translateY(-2px);
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .data-table th {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--gray-500);
      letter-spacing: 0.05em;
    }
    
    .data-table td {
      font-size: 0.875rem;
      color: var(--gray-700);
    }
    
    .product-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .product-cell img {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      object-fit: cover;
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
    
    .status-badge.pending { background: #FEF3C7; color: #D97706; }
    .status-badge.confirmed { background: #DBEAFE; color: #2563EB; }
    .status-badge.processing { background: #E0E7FF; color: #4F46E5; }
    .status-badge.shipped { background: #D1FAE5; color: #059669; }
    .status-badge.delivered { background: #D1FAE5; color: #047857; }
    .status-badge.cancelled { background: #FEE2E2; color: #DC2626; }
    
    .empty {
      text-align: center;
      color: var(--gray-400);
      padding: 2rem !important;
    }
    
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .quick-actions {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .two-column {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats = {
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  };

  recentProducts: any[] = [];
  recentOrders: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDashboardData();
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

  loadDashboardData(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = {
          products: stats.totalProducts,
          categories: stats.totalCategories,
          orders: stats.totalOrders,
          revenue: stats.totalRevenue
        };
        this.recentProducts = stats.recentProducts;
        this.recentOrders = stats.recentOrders;

        setTimeout(() => this.initIcons(), 100);
      },
      error: (err) => console.error('Dashboard stats error:', err)
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Beklemede',
      'confirmed': 'Onaylandı',
      'processing': 'Hazırlanıyor',
      'shipped': 'Kargoda',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal'
    };
    return statusMap[status.toLowerCase()] || status;
  }
}
