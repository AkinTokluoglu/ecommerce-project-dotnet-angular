import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup;
    isLoading = false;
    successMessage = '';
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
                next: (res) => {
                    this.successMessage = res.message || 'E-posta adresinize sıfırlama bağlantısı gönderildi.';
                    this.isLoading = false;
                    // Optionally, user can stay here or be routed contextually
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Bir hata oluştu.';
                    this.isLoading = false;
                }
            });
        }
    }
}
