import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-page">
      <div class="page-header">
        <h1>İletişim</h1>
        <p>Projeleriniz için bizimle iletişime geçin</p>
      </div>
      
      <div class="contact-container">
        <!-- İletişim Bilgileri (Aynı) -->
        <div class="contact-info">
          <h2>Bize Ulaşın</h2>
          
          <div class="info-item">
            <span class="icon"><i data-lucide="map-pin"></i></span>
            <div>
              <h3>Adres</h3>
              <p>İstanbul, Türkiye<br>Pendik Sanayi Sitesi</p>
            </div>
          </div>
          
          <div class="info-item">
            <span class="icon"><i data-lucide="phone"></i></span>
            <div>
              <h3>Telefon</h3>
              <p>+90 555 123 4567</p>
            </div>
          </div>
          
          <div class="info-item">
            <span class="icon"><i data-lucide="mail"></i></span>
            <div>
              <h3>E-posta</h3>
              <p>info&#64;marangozatolyesi.com</p>
            </div>
          </div>
          
          <div class="info-item">
            <span class="icon"><i data-lucide="clock"></i></span>
            <div>
              <h3>Çalışma Saatleri</h3>
              <p>Pazartesi - Cumartesi: 09:00 - 18:00</p>
            </div>
          </div>
          
          <div class="whatsapp-btn">
            <a href="https://wa.me/905551234567" target="_blank">
              <i data-lucide="message-circle"></i> WhatsApp ile İletişime Geç
            </a>
          </div>
        </div>
        
        <!-- Form -->
        <div class="contact-form">
          <h2>Mesaj Gönderin</h2>
          
          <form (ngSubmit)="onSubmit()" #form="ngForm">
            <!-- Honeypot Field (Gizli) -->
            <input type="text" name="website" style="display:none" [(ngModel)]="honeypot" tabindex="-1" autocomplete="off">

            <div class="form-row">
              <div class="form-group">
                <label for="name">Adınız</label>
                <input type="text" id="name" [(ngModel)]="formData.name" name="name" required class="form-control" [disabled]="isSubmitting">
              </div>
              <div class="form-group">
                <label for="email">E-posta</label>
                <input type="email" id="email" [(ngModel)]="formData.email" name="email" required class="form-control" [disabled]="isSubmitting">
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Telefon (İsteğe Bağlı)</label>
              <input type="tel" id="phone" [(ngModel)]="formData.phone" name="phone" class="form-control" [disabled]="isSubmitting" placeholder="+90 555 ...">
            </div>
            
            <div class="form-group">
              <label for="subject">Konu</label>
              <select id="subject" [(ngModel)]="formData.subject" name="subject" required class="form-control" [disabled]="isSubmitting">
                <option value="">Seçiniz...</option>
                <option value="Fiyat Teklifi">Fiyat Teklifi</option>
                <option value="Özel Tasarım">Özel Tasarım</option>
                <option value="Sipariş Hakkında">Sipariş Hakkında</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="message">Mesajınız</label>
              <textarea id="message" [(ngModel)]="formData.content" name="content" rows="5" required class="form-control" [disabled]="isSubmitting"></textarea>
            </div>
            
            <button type="submit" class="submit-btn" [disabled]="!form.valid || isSubmitting">
              {{ isSubmitting ? 'Gönderiliyor...' : 'Gönder' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  // Styles ...
  styles: [`
    /* ... önceki stiller ... */
    .contact-page { min-height: 80vh; background: #FAFAFA; }
    .page-header { background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%); padding: 3rem 2rem; text-align: center; color: white; }
    .page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .contact-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    .contact-info h2, .contact-form h2 { color: #3E2723; margin-bottom: 2rem; }
    .info-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .info-item .icon { font-size: 2rem; }
    .info-item h3 { color: #5D4037; font-size: 1rem; margin-bottom: 0.25rem; }
    .info-item p { color: #757575; }
    .whatsapp-btn { margin-top: 2rem; }
    .whatsapp-btn a { display: inline-block; padding: 1rem 2rem; background: #25D366; color: white; border-radius: 8px; font-weight: 600; transition: transform 0.3s; text-decoration: none; }
    .whatsapp-btn a:hover { transform: translateY(-2px); }
    .contact-form { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #5D4037; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem 1rem; border: 2px solid #EFEBE9; border-radius: 8px; font-size: 1rem; font-family: inherit; transition: border-color 0.3s; }
    .form-control:focus { outline: none; border-color: #8D6E63; }
    .submit-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.3s; }
    .submit-btn:hover { transform: translateY(-2px); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    @media (max-width: 768px) { .contact-container { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ContactComponent implements AfterViewInit {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    content: ''
  };
  honeypot: string = ''; // Spam protection
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

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

  onSubmit(): void {
    // ... same ...
    if (this.honeypot) {
      console.log('Spam detected');
      return;
    }

    this.isSubmitting = true;
    this.apiService.sendMessage(this.formData).subscribe({
      next: (res) => {
        this.toastService.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        this.formData = { name: '', email: '', phone: '', subject: '', content: '' };
        this.isSubmitting = false;
        this.initIcons(); // Re-init icons just in case view updates
      },
      error: (err) => {
        // Rate limit (429) veya diğer hatalar
        if (err.status === 429) {
          this.toastService.error('Çok fazla mesaj gönderdiniz. Lütfen bir süre bekleyin.');
        } else {
          this.toastService.error('Mesaj gönderilirken bir hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
        }
        this.isSubmitting = false;
      }
    });
  }
}
