import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="admin-login-page">
      <div class="login-box">
        <div class="header">
          <h2>Admin Paneli</h2>
          <p>Yönetici Girişi</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>E-posta</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="admin">
          </div>

          <div class="form-group">
            <label>Şifre</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="******">
          </div>

          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
          </button>

          @if (errorMessage) {
            <div class="error-msg">{{ errorMessage }}</div>
          }
        </form>
      </div>
    </div>
  `,
    styles: [`
    .admin-login-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111827;
      color: #E5E7EB;
    }

    .login-box {
      background: #1F2937;
      padding: 2.5rem;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #F3F4F6;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #9CA3AF;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #D1D5DB;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      background: #374151;
      border: 1px solid #4B5563;
      border-radius: 6px;
      color: white;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #60A5FA;
      ring: 2px solid #60A5FA;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: #2563EB;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #1D4ED8;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-msg {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #7F1D1D;
      color: #FECACA;
      border-radius: 6px;
      text-align: center;
      font-size: 0.875rem;
    }
  `]
})
export class AdminLoginComponent {
    email = '';
    password = '';
    isLoading = false;
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (res) => {
                if (this.authService.isAdmin()) {
                    this.router.navigate(['/admin']);
                } else {
                    // Admin değilse at
                    this.authService.logout();
                    this.errorMessage = 'Bu alana sadece yöneticiler girebilir!';
                    this.isLoading = false;
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Giriş başarısız: ' + (err.error?.message || 'Sunucu hatası');
            }
        });
    }
}
