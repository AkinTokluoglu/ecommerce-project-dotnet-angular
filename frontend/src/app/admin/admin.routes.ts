import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./products/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'products/new',
                loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent)
            },
            {
                path: 'products/:id',
                loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./categories/category-list.component').then(m => m.CategoryListComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./orders/order-list.component').then(m => m.OrderListComponent)
            },
            {
                path: 'customers',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'messages',
                loadComponent: () => import('./messages/message-list.component').then(m => m.MessageListComponent)
            },
            {
                path: 'portfolio',
                loadComponent: () => import('./portfolio/portfolio-list.component').then(m => m.PortfolioListComponent)
            },
            {
                path: 'portfolio/new',
                loadComponent: () => import('./portfolio/portfolio-form.component').then(m => m.PortfolioFormComponent)
            },
            {
                path: 'portfolio/:id',
                loadComponent: () => import('./portfolio/portfolio-form.component').then(m => m.PortfolioFormComponent)
            }
        ]
    }
];
