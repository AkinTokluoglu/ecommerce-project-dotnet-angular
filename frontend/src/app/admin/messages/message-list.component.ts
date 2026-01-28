import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { Message } from '../../models';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page-header">
      <h2>Gelen Kutusu</h2>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px"></th>
              <th>Tarih</th>
              <th>Gönderen</th>
              <th>Konu</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            @for (msg of messages; track msg.id) {
              <tr [class.unread]="!msg.isRead">
                <td class="status-cell">
                  @if (!msg.isRead) {
                    <div class="unread-dot"></div>
                  }
                </td>
                <td>{{ msg.createdAt | date:'dd.MM.yyyy HH:mm' }}</td>
                <td>
                  <div class="font-medium">{{ msg.name }}</div>
                  <small class="text-muted">{{ msg.email }}</small>
                </td>
                <td>
                  <div class="font-medium">{{ msg.subject }}</div>
                  <small class="text-muted">{{ msg.content | slice:0:50 }}...</small>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-sm btn-info" (click)="viewMessage(msg)">Oku</button>
                    <button class="btn-sm btn-danger" (click)="deleteMessage(msg)">Sil</button>
                  </div>
                </td>
              </tr>
            }
            @if (messages.length === 0) {
              <tr>
                <td colspan="5" class="text-center">Henüz mesaj yok.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Message Detail Modal -->
    @if (selectedMessage) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ selectedMessage.subject }}</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="message-meta">
              <p><strong>Gönderen:</strong> {{ selectedMessage.name }} ({{ selectedMessage.email }})</p>
              <p *ngIf="selectedMessage.phone"><strong>Telefon:</strong> {{ selectedMessage.phone }}</p>
              <p><strong>Tarih:</strong> {{ selectedMessage.createdAt | date:'dd.MM.yyyy HH:mm' }}</p>
            </div>
            <div class="message-content">
              {{ selectedMessage.content }}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()">Kapat</button>
            <a [href]="'mailto:' + selectedMessage.email" class="btn-primary">Yanıtla (E-mail)</a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-page-header { margin-bottom: 2rem; }
    .card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #eee; }
    
    .unread { background-color: #f0fdf4; font-weight: 500; }
    .unread-dot { width: 10px; height: 10px; background: #8B4513; border-radius: 50%; margin: 0 auto; }
    
    .actions { display: flex; gap: 0.5rem; }
    .btn-sm { padding: 0.25rem 0.5rem; border-radius: 4px; border: none; cursor: pointer; color: white; }
    .btn-info { background: #3B82F6; }
    .btn-danger { background: #EF4444; }
    
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content {
      background: white; border-radius: 8px; width: 90%; max-width: 600px; padding: 1.5rem;
    }
    .modal-header { display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .message-meta { margin-bottom: 1rem; color: #555; }
    .message-content { white-space: pre-wrap; line-height: 1.6; margin-bottom: 2rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-primary { background: #8B4513; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; }
    .btn-secondary { background: #eee; color: #333; padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; }
    .text-center { text-align: center; padding: 2rem; color: #666; }
  `]
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];
  selectedMessage: Message | null = null;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.apiService.getMessages().subscribe({
      next: (data) => this.messages = data,
      error: () => this.toastService.error('Mesajlar yüklenemedi!')
    });
  }

  viewMessage(msg: Message) {
    // Okundu olarak işaretle (Backend'de GetById bunu yapıyor)
    this.apiService.getMessageById(msg.id).subscribe({
      next: (fullMsg) => {
        this.selectedMessage = fullMsg;
        // Listede de okundu yap
        const index = this.messages.findIndex(m => m.id === msg.id);
        if (index !== -1) {
          this.messages[index].isRead = true;
        }
      }
    });
  }

  async deleteMessage(msg: Message) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Mesajı Sil',
      message: 'Bu mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      type: 'danger',
      confirmText: 'Sil'
    });

    if (!confirmed) return;

    this.apiService.deleteMessage(msg.id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== msg.id);
        this.toastService.success('Mesaj silindi.');
      },
      error: () => this.toastService.error('Silme başarısız!')
    });
  }

  closeModal() {
    this.selectedMessage = null;
  }
}
