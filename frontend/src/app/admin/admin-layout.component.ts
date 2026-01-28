import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-container">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <a routerLink="/" class="logo">
            <i data-lucide="tree-pine"></i>
            <span>Yönetim</span>
          </a>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i data-lucide="layout-dashboard"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="nav-item">
            <i data-lucide="package"></i>
            <span>Ürünler</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item">
            <i data-lucide="folder-tree"></i>
            <span>Kategoriler</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item">
            <i data-lucide="shopping-cart"></i>
            <span>Siparişler</span>
          </a>
          <a routerLink="/admin/customers" routerLinkActive="active" class="nav-item">
            <i data-lucide="users"></i>
            <span>Müşteriler</span>
          </a>
          <a routerLink="/admin/messages" routerLinkActive="active" class="nav-item">
            <i data-lucide="message-square"></i>
            <span>Mesajlar</span>
          </a>
          <a routerLink="/admin/portfolio" routerLinkActive="active" class="nav-item">
            <i data-lucide="image"></i>
            <span>Portfolyo</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <a routerLink="/" class="nav-item">
            <i data-lucide="home"></i>
            <span>Siteye Dön</span>
          </a>
          <button (click)="logout()" class="nav-item logout">
            <i data-lucide="log-out"></i>
            <span>Çıkış</span>
          </button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-header">
          <div class="header-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <i data-lucide="menu"></i>
            </button>
            <h1>{{ pageTitle }}</h1>
          </div>
          <div class="header-right">
            <div class="user-info">
              <span>{{ authService.currentUser()?.fullName || 'Admin' }}</span>
              <i data-lucide="user-circle"></i>
            </div>
          </div>
        </header>
        
        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: var(--gray-50);
    }
    
    .admin-sidebar {
      width: 260px;
      background: var(--primary-900);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 100;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      font-size: 1.25rem;
      font-weight: 700;
    }
    
    .logo i {
      width: 28px;
      height: 28px;
      color: var(--accent);
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: var(--primary-200);
      transition: all 0.2s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 0.9375rem;
      cursor: pointer;
    }
    
    .nav-item i {
      width: 20px;
      height: 20px;
    }
    
    .nav-item:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    
    .nav-item.active {
      background: var(--primary);
      color: white;
    }
    
    .sidebar-footer {
      padding: 1rem 0;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .nav-item.logout:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #FCA5A5;
    }
    
    .admin-main {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }
    
    .admin-header {
      background: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--gray-200);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .header-left h1 {
      font-size: 1.25rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      color: var(--gray-800);
    }
    
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
    }
    
    .menu-toggle i {
      width: 24px;
      height: 24px;
      color: var(--gray-600);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray-600);
      font-size: 0.875rem;
    }
    
    .user-info i {
      width: 24px;
      height: 24px;
    }
    
    .admin-content {
      padding: 2rem;
      flex: 1;
    }
    
    @media (max-width: 1024px) {
      .admin-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
      }
      
      .admin-sidebar.open {
        transform: translateX(0);
      }
      
      .admin-main {
        margin-left: 0;
      }
      
      .menu-toggle {
        display: block;
      }
    }
  `]
})
export class AdminLayoutComponent implements AfterViewInit {
  pageTitle = 'Dashboard';
  sidebarOpen = false;

  constructor(public authService: AuthService) { }

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

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
