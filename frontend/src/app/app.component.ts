import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ConfirmationModalComponent],
  template: `
    <app-toast></app-toast>
    <app-confirmation-modal></app-confirmation-modal>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
