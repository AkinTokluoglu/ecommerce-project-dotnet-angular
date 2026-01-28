import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page-header">
      <h2>Sipariş Yönetimi</h2>
    </div>

    @if (errorMessage) {
      <div class="error-alert">
        {{ errorMessage }}
        @if (errorMessage.includes('Yetkiniz yok')) {
          <button class="btn-admin" (click)="makeMeAdmin()">Beni Admin Yap (Geliştirici Aracı)</button>
        }
      </div>
    }

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Sipariş No</th>
              <th>Tarih</th>
              <th>Müşteri</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders; track order.id) {
              <tr>
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.createdAt | date:'dd.MM.yyyy HH:mm' }}</td>
                <td>
                  <div>{{ order.contactName }}</div>
                  <small>{{ order.contactPhone }}</small>
                </td>
                <td>{{ order.totalAmount | number:'1.0-0' }} ₺</td>
                <td>
                  <span class="status-badge" [ngClass]="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-sm" (click)="viewDetails(order)">Detay</button>
                    
                    @if (order.status === 0) {
                      <button class="btn-sm btn-success" (click)="updateStatus(order, 1)">Onayla</button>
                      <button class="btn-sm btn-danger" (click)="updateStatus(order, 5)">Reddet</button>
                    }
                    @if (order.status === 1) {
                      <button class="btn-sm btn-info" (click)="updateStatus(order, 2)">Hazırla</button>
                    }
                    @if (order.status === 2) {
                      <button class="btn-sm btn-info" (click)="updateStatus(order, 3)">Kargola</button>
                    }
                    @if (order.status === 3) {
                      <button class="btn-sm btn-primary" (click)="updateStatus(order, 4)">Teslim Et</button>
                    }
                    @if (order.status !== 4 && order.status !== 5) {
                      <button class="btn-sm btn-danger" (click)="updateStatus(order, 5)">İptal</button>
                    }
                  </div>
                </td>
              </tr>
            }
            @if (orders.length === 0) {
              <tr>
                <td colspan="6" class="text-center">Henüz sipariş bulunmuyor.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sipariş Detay Modalı (Basit versiyon) -->
    @if (selectedOrder) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Sipariş Detayı: {{ selectedOrder.orderNumber }}</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="info-group">
              <h4>Müşteri Bilgileri</h4>
              <p>Has: {{ selectedOrder.contactName }}</p>
              <p>Tel: {{ selectedOrder.contactPhone }}</p>
              <p>Email: {{ selectedOrder.contactEmail }}</p>
              <p>Adres: {{ selectedOrder.shippingAddress }}</p>
              <p>Not: {{ selectedOrder.notes || '-' }}</p>
            </div>

            <div class="order-items">
              <h4>Ürünler</h4>
              @for (item of selectedOrder.items; track item.id) {
                <div class="order-item">
                  <img [src]="item.productImage" alt="" class="item-thumb">
                  <div class="item-info">
                    <div>{{ item.productName }}</div>
                    <small>{{ item.quantity }} adet x {{ item.unitPrice | number:'1.0-0' }} ₺</small>
                    @if (item.customizations) {
                       <div class="customizations">
                         @for (key of objectKeys(item.customizations); track key) {
                           <span>{{ key }}: {{ item.customizations[key] }}</span>
                         }
                       </div>
                    }
                  </div>
                  <div class="item-total">
                    {{ item.quantity * item.unitPrice | number:'1.0-0' }} ₺
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-page-header {
      margin-bottom: 2rem;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    
    .table-responsive {
      overflow-x: auto;
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
    
    .data-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .status-pending { background: #FEF3C7; color: #92400E; } /* Bekliyor */
    .status-confirmed { background: #DBEAFE; color: #1E40AF; } /* Onaylandı */
    .status-shipped { background: #E0E7FF; color: #3730A3; } /* Kargoda */
    .status-delivered { background: #D1FAE5; color: #065F46; } /* Teslim edildi/Tamamlandı */
    .status-cancelled { background: #FEE2E2; color: #991B1B; } /* İptal */
    
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      border: 1px solid #ddd;
      background: white;
    }
    
    .btn-success { background: #10B981; color: white; border: none; }
    .btn-danger { background: #EF4444; color: white; border: none; }
    .btn-info { background: #3B82F6; color: white; border: none; }
    .btn-primary { background: #8B4513; color: white; border: none; }
    
    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 1.5rem;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    .order-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .item-thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-info { flex: 1; }
    
    .text-center { text-align: center; }
    
    .error-alert {
      background: #FEE2E2;
      color: #991B1B;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid #FCA5A5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-admin {
      background: #B91C1C;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.errorMessage = '';
    this.apiService.getAdminOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => {
        console.error('Siparişler yüklenemedi', err);
        if (err.status === 403) {
          this.errorMessage = 'Yetkiniz yok! Lütfen Admin hesabıyla giriş yapın.';
        } else {
          // Toast ile de gösterelim
          this.toastService.error('Siparişler yüklenirken hata oluştu.');
        }
      }
    });
  }

  async updateStatus(order: any, status: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Durum Güncelle',
      message: 'Durumu güncellemek istediğinize emin misiniz?',
      type: 'info',
      confirmText: 'Evet'
    });

    if (!confirmed) return;

    this.apiService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        this.loadOrders(); // Listeyi yenile
        this.toastService.success('Sipariş durumu güncellendi.');
      },
      error: (err) => this.toastService.error('Güncelleme başarısız!')
    });
  }

  viewDetails(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Bekliyor';
      case 1: return 'Onaylandı';
      case 2: return 'Hazırlanıyor';
      case 3: return 'Kargoda';
      case 4: return 'Teslim Edildi';
      case 5: return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-pending';
      case 1: return 'status-confirmed'; // Blue
      case 2: return 'status-shipped'; // Reusing shipped style for Processing (Indigo)
      case 3: return 'status-shipped'; // Greenish
      case 4: return 'status-delivered'; // Green
      case 5: return 'status-cancelled'; // Red
      default: return '';
    }
  }

  objectKeys(obj: any) {
    return obj ? Object.keys(obj) : [];
  }

  makeMeAdmin() {
    this.apiService.promoteMe().subscribe({
      next: (res: any) => {
        this.toastService.success('Hesabınız Admin yapıldı! Lütfen çıkış yapıp tekrar giriş yapın.');
        // İsteğe bağlı: Otomatik çıkış
        // this.authService.logout();
      },
      error: (err: any) => this.toastService.error('İşlem başarısız: ' + err.message)
    });
  }
}
