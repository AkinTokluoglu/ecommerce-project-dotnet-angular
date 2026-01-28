import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="navbar-container">
        <a routerLink="/" class="logo">
          <div class="logo-icon">
            <i data-lucide="tree-pine"></i>
          </div>
          <span class="logo-text">Marangoz<span class="logo-accent">Atölyesi</span></span>
        </a>
        
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Ana Sayfa</a></li>
          <li><a routerLink="/products" routerLinkActive="active">Ürünler</a></li>
          <li><a routerLink="/portfolio" routerLinkActive="active">Portfolyo</a></li>
          <li><a routerLink="/contact" routerLinkActive="active">İletişim</a></li>
        </ul>
        
        <div class="nav-actions">
          @if (authService.isLoggedIn()) {
            <div class="user-menu">
              <i data-lucide="user-circle"></i>
              <span>{{ authService.currentUser()?.fullName }}</span>
            </div>
            @if (authService.isAdmin()) {
              <a routerLink="/admin" class="btn-admin">
                <i data-lucide="settings"></i>
                Admin
              </a>
            }
            <button (click)="authService.logout()" class="btn-logout">
              <i data-lucide="log-out"></i>
            </button>
          } @else {
            <a routerLink="/login" class="btn-login">
              <i data-lucide="user"></i>
              Giriş Yap
            </a>
          }
          
          <a routerLink="/cart" class="cart-btn">
            <i data-lucide="shopping-bag"></i>
            @if (cartService.itemCount() > 0) {
              <span class="cart-badge">{{ cartService.itemCount() }}</span>
            }
          </a>
          
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <i data-lucide="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <ul>
          <li><a routerLink="/" (click)="closeMobileMenu()">Ana Sayfa</a></li>
          <li><a routerLink="/products" (click)="closeMobileMenu()">Ürünler</a></li>
          <li><a routerLink="/portfolio" (click)="closeMobileMenu()">Portfolyo</a></li>
          <li><a routerLink="/contact" (click)="closeMobileMenu()">İletişim</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 1rem 2rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: all 0.3s ease;
      border-bottom: 1px solid transparent;
    }
    
    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: var(--shadow-md);
      border-bottom: 1px solid var(--gray-100);
    }
    
    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    
    .logo-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--primary-700), var(--primary-800));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo-icon i {
      width: 24px;
      height: 24px;
      color: var(--accent);
    }
    
    .logo-text {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--primary-800);
      font-family: 'Inter', sans-serif;
    }
    
    .logo-accent {
      color: var(--primary);
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
    }
    
    .nav-links a {
      color: var(--gray-600);
      text-decoration: none;
      font-weight: 500;
      padding: 0.625rem 1rem;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      font-size: 0.9375rem;
    }
    
    .nav-links a:hover {
      color: var(--primary-800);
      background: var(--gray-50);
    }
    
    .nav-links a.active {
      color: var(--primary);
      background: var(--primary-100);
    }
    
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray-600);
      font-size: 0.875rem;
    }
    
    .user-menu i {
      width: 20px;
      height: 20px;
    }
    
    .btn-login {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--primary-100);
      color: var(--primary-700);
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .btn-login i {
      width: 18px;
      height: 18px;
    }
    
    .btn-login:hover {
      background: var(--primary-200);
    }
    
    .btn-admin {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      background: var(--gray-100);
      color: var(--gray-700);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .btn-admin i {
      width: 16px;
      height: 16px;
    }
    
    .btn-logout {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-500);
      transition: all 0.2s;
    }
    
    .btn-logout i {
      width: 18px;
      height: 18px;
    }
    
    .btn-logout:hover {
      background: var(--error-100);
      border-color: var(--error);
      color: var(--error);
    }
    
    .cart-btn {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--primary-800);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .cart-btn i {
      width: 20px;
      height: 20px;
      color: white;
    }
    
    .cart-btn:hover {
      background: var(--primary-700);
      transform: translateY(-2px);
    }
    
    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--accent);
      color: var(--primary-900);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full);
      min-width: 18px;
      text-align: center;
    }
    
    .mobile-menu-btn {
      display: none;
      width: 44px;
      height: 44px;
      border: none;
      background: transparent;
      color: var(--gray-700);
    }
    
    .mobile-menu-btn i {
      width: 24px;
      height: 24px;
    }
    
    .mobile-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      box-shadow: var(--shadow-lg);
      padding: 1rem;
    }
    
    .mobile-menu.open {
      display: block;
    }
    
    .mobile-menu ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .mobile-menu a {
      display: block;
      padding: 0.875rem 1rem;
      color: var(--gray-700);
      border-radius: var(--radius-md);
    }
    
    .mobile-menu a:hover {
      background: var(--gray-50);
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .btn-login span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isScrolled = false;
  mobileMenuOpen = false;

  constructor(
    public cartService: CartService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });
    }
  }

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

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
