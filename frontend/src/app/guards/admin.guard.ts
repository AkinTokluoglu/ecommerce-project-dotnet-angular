import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    if (authService.isAdmin()) {
        return true;
    }

    // Admin değilse dashboard'a atmasın, login'e atsın veya uyarısın
    // Ancak admin panel içindeysek ve yetki yoksa ana sayfaya atmalı
    toastService.error('Bu sayfaya erişim yetkiniz yok.');
    router.navigate(['/']);
    return false;
};
