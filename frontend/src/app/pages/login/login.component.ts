import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-form-wrapper">
          <h1>{{ isRegister ? 'Hesap Oluştur' : 'Giriş Yap' }}</h1>
          <p class="subtitle">{{ isRegister ? 'Yeni müşterimiz olun' : 'Hesabınıza giriş yapın' }}</p>
          
          <form (ngSubmit)="onSubmit()">
            @if (isRegister) {
              <div class="form-group">
                <label for="fullName">Ad Soyad</label>
                <input type="text" id="fullName" [(ngModel)]="fullName" name="fullName" required>
              </div>
            }
            
            <div class="form-group">
              <label for="email">E-posta</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Şifre</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" required>
            </div>
            
            @if (isRegister) {
              <div class="form-group">
                <label for="phone">Telefon (Opsiyonel)</label>
                <input type="tel" id="phone" [(ngModel)]="phone" name="phone">
              </div>
            }
            
            <button type="submit" class="submit-btn">
              {{ isRegister ? 'Kayıt Ol' : 'Giriş Yap' }}
            </button>

            @if (!isRegister) {
              <div class="mt-3 text-center">
                <a routerLink="/forgot-password" class="text-muted" style="font-size: 0.9rem; text-decoration: none;">Şifremi Unuttum</a>
              </div>
            }
          </form>
          
          <div class="toggle-form">
            @if (isRegister) {
              <p>Zaten hesabınız var mı? <a (click)="isRegister = false">Giriş Yap</a></p>
            } @else {
              <p>Hesabınız yok mu? <a (click)="isRegister = true">Kayıt Ol</a></p>
            }
          </div>
        </div>
        
        <div class="login-image">
          <img src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80" alt="Workshop">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FAFAFA;
      padding: 2rem;
    }
    
    .login-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 900px;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .login-form-wrapper {
      padding: 3rem;
    }
    
    .login-form-wrapper h1 {
      color: #3E2723;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #757575;
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #5D4037;
      font-weight: 500;
    }
    
    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #EFEBE9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #8D6E63;
    }
    
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s;
    }
    
    .submit-btn:hover {
      transform: translateY(-2px);
    }
    
    .toggle-form {
      text-align: center;
      margin-top: 1.5rem;
      color: #757575;
    }
    
    .toggle-form a {
      color: #5D4037;
      font-weight: 600;
      cursor: pointer;
    }
    
    .toggle-form a:hover {
      text-decoration: underline;
    }
    
    .login-image {
      display: none;
    }
    
    .login-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    @media (min-width: 768px) {
      .login-image {
        display: block;
      }
    }
    
    @media (max-width: 768px) {
      .login-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoginComponent {
  isRegister = false;
  email = '';
  password = '';
  fullName = '';
  phone = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  onSubmit(): void {
    if (this.isRegister) {
      this.authService.register({
        email: this.email,
        password: this.password,
        fullName: this.fullName,
        phone: this.phone || undefined
      }).subscribe({
        next: () => {
          this.toastService.success('Kayıt başarılı! Giriş yapılıyor...');
          this.router.navigate(['/']);
        },
        error: (err) => this.toastService.error('Kayıt başarısız: ' + (err.error?.message || err.message))
      });
    } else {
      this.authService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: () => {
          this.toastService.success('Giriş başarılı');
          this.router.navigate(['/']);
        },
        error: (err) => this.toastService.error('Giriş başarısız: ' + (err.error?.message || err.message))
      });
    }
  }
}
