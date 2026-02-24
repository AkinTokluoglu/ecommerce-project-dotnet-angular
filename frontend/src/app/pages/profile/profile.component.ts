import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { UserProfile, Order, OrderStatus } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    activeTab: 'profile' | 'orders' | 'password' = 'profile';
    profileForm: FormGroup;
    passwordForm: FormGroup;
    profile: UserProfile | null = null;
    orders: Order[] = [];
    isLoading = false;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private toastService: ToastService
    ) {
        this.profileForm = this.fb.group({
            fullName: ['', Validators.required],
            phone: [''],
            address: ['']
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.loadProfile();
        this.loadOrders();
    }

    loadProfile(): void {
        this.isLoading = true;
        this.userService.getProfile().subscribe({
            next: (profile) => {
                this.profile = profile;
                this.profileForm.patchValue({
                    fullName: profile.fullName,
                    phone: profile.phone,
                    address: profile.address
                });
                this.isLoading = false;
            },
            error: () => {
                this.toastService.error('Profil bilgileri yüklenemedi.');
                this.isLoading = false;
            }
        });
    }

    loadOrders(): void {
        this.userService.getUserOrders().subscribe({
            next: (orders) => {
                this.orders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            },
            error: () => {
                this.toastService.error('Sipariş geçmişi yüklenemedi.');
            }
        });
    }

    onUpdateProfile(): void {
        if (this.profileForm.valid) {
            this.isSaving = true;
            this.userService.updateProfile(this.profileForm.value).subscribe({
                next: (updatedProfile) => {
                    this.profile = updatedProfile;
                    this.toastService.success('Profiliniz başarıyla güncellendi.');
                    this.isSaving = false;
                },
                error: (err) => {
                    this.toastService.error(err.error?.message || 'Profil güncellenirken bir hata oluştu.');
                    this.isSaving = false;
                }
            });
        }
    }

    onChangePassword(): void {
        if (this.passwordForm.valid) {
            this.isSaving = true;
            const { currentPassword, newPassword } = this.passwordForm.value;
            this.userService.changePassword({ currentPassword, newPassword }).subscribe({
                next: () => {
                    this.toastService.success('Şifreniz başarıyla değiştirildi.');
                    this.passwordForm.reset();
                    this.isSaving = false;
                },
                error: (err) => {
                    this.toastService.error(err.error?.message || 'Şifre değiştirilemedi.');
                    this.isSaving = false;
                }
            });
        }
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    getStatusLabel(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.Pending: return 'Beklemede';
            case OrderStatus.Processing: return 'Hazırlanıyor';
            case OrderStatus.Shipped: return 'Kargoya Verildi';
            case OrderStatus.Delivered: return 'Teslim Edildi';
            case OrderStatus.Cancelled: return 'İptal Edildi';
            default: return 'Bilinmiyor';
        }
    }

    getStatusClass(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.Pending: return 'status-pending';
            case OrderStatus.Processing: return 'status-processing';
            case OrderStatus.Shipped: return 'status-shipped';
            case OrderStatus.Delivered: return 'status-delivered';
            case OrderStatus.Cancelled: return 'status-cancelled';
            default: return '';
        }
    }
}
