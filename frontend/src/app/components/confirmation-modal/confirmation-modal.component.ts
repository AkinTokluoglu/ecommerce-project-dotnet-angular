import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationOptions } from '../../services/confirmation.service';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (data) {
      <div class="modal-backdrop" (click)="cancel()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header" [class.danger]="data.options.type === 'danger'">
            <h3>{{ data.options.title }}</h3>
          </div>
          <div class="modal-body">
            <p>{{ data.options.message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="cancel()">{{ data.options.cancelText || 'İptal' }}</button>
            <button class="btn-confirm" 
                    [class.btn-danger]="data.options.type === 'danger'"
                    [class.btn-primary]="!data.options.type || data.options.type === 'info'"
                    (click)="confirm()">
              {{ data.options.confirmText || 'Onayla' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;
      animation: fadeIn 0.2s;
    }
    .modal-content {
      background: white; border-radius: 8px; width: 90%; max-width: 400px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      animation: slideUp 0.2s;
    }
    .modal-header { padding: 1.5rem 1.5rem 0.5rem; }
    .modal-header.danger h3 { color: #DC2626; }
    .modal-header h3 { margin: 0; font-size: 1.25rem; }
    .modal-body { padding: 1rem 1.5rem; color: #4B5563; line-height: 1.5; }
    .modal-footer { padding: 1rem 1.5rem 1.5rem; display: flex; justify-content: flex-end; gap: 1rem; }
    
    button { padding: 0.5rem 1rem; border-radius: 6px; border: none; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-cancel { background: #E5E7EB; color: #374151; }
    .btn-cancel:hover { background: #D1D5DB; }
    .btn-confirm { color: white; }
    .btn-primary { background: #8B4513; }
    .btn-primary:hover { background: #5D4037; }
    .btn-danger { background: #EF4444; }
    .btn-danger:hover { background: #DC2626; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class ConfirmationModalComponent {
    data: { options: ConfirmationOptions, resolve: (result: boolean) => void } | null = null;

    constructor(private confirmationService: ConfirmationService) {
        this.confirmationService.confirmationState$.subscribe(data => {
            this.data = data;
        });
    }

    confirm() {
        if (this.data) {
            this.data.resolve(true);
            this.data = null;
        }
    }

    cancel() {
        if (this.data) {
            this.data.resolve(false);
            this.data = null;
        }
    }
}
