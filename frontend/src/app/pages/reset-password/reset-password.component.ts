import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // URL query parameters'dan token ve email okunacak
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];

      if (!this.token || !this.email) {
        this.errorMessage = 'Geçersiz veya eksik şifre sıfırlama bağlantısı.';
      }
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token && this.email) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const payload = {
        email: this.email,
        token: this.token,
        newPassword: this.resetPasswordForm.get('newPassword')?.value
      };

      this.authService.resetPassword(payload).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Şifreniz başarıyla sıfırlandı.';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // 3 saniye sonra login sayfasına yönlendir
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Bir hata oluştu.';
          this.isLoading = false;
        }
      });
    }
  }
}
