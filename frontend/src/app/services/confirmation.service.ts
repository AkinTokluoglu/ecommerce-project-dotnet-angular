import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    private confirmationSubject = new Subject<{ options: ConfirmationOptions, resolve: (result: boolean) => void }>();
    public confirmationState$ = this.confirmationSubject.asObservable();

    confirm(options: ConfirmationOptions): Promise<boolean> {
        return new Promise((resolve) => {
            this.confirmationSubject.next({ options, resolve });
        });
    }
}
