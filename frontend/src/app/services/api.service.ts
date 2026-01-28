import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Products
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products`);
    }

    getProductBySlug(slug: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/products/slug/${slug}`);
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
    }

    getProductsByCategory(categoryId: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products/category/${categoryId}`);
    }

    // Categories
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.baseUrl}/categories`);
    }

    getCategoryBySlug(slug: string): Observable<Category> {
        return this.http.get<Category>(`${this.baseUrl}/categories/slug/${slug}`);
    }
    // Upload Image
    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/products/upload-image`, formData);
    }

    // Orders
    createOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/orders`, orderData);
    }

    // Admin Orders
    getAdminOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/orders/admin`);
    }

    updateOrderStatus(orderId: string, status: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/orders/admin/${orderId}/status`, { status });
    }

    promoteMe(): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/promote-me`, {});
    }

    getDashboardStats(): Observable<import('../models').DashboardStats> {
        return this.http.get<import('../models').DashboardStats>(`${this.baseUrl}/dashboard`);
    }

    // Products CRUD
    createProduct(product: any): Observable<Product> {
        return this.http.post<Product>(`${this.baseUrl}/products`, product);
    }

    updateProduct(id: string, product: any): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
    }

    // Portfolio
    getPortfolioItems(): Observable<import('../models').PortfolioItem[]> {
        return this.http.get<import('../models').PortfolioItem[]>(`${this.baseUrl}/portfolio`);
    }

    getPortfolioItemById(id: string): Observable<import('../models').PortfolioItem> {
        return this.http.get<import('../models').PortfolioItem>(`${this.baseUrl}/portfolio/${id}`);
    }

    createPortfolioItem(item: import('../models').CreatePortfolioItemRequest): Observable<import('../models').PortfolioItem> {
        return this.http.post<import('../models').PortfolioItem>(`${this.baseUrl}/portfolio`, item);
    }

    updatePortfolioItem(id: string, item: import('../models').UpdatePortfolioItemRequest): Observable<import('../models').PortfolioItem> {
        return this.http.put<import('../models').PortfolioItem>(`${this.baseUrl}/portfolio/${id}`, item);
    }

    deletePortfolioItem(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/portfolio/${id}`);
    }

    // Messages
    getMessages(): Observable<import('../models').Message[]> {
        return this.http.get<import('../models').Message[]>(`${this.baseUrl}/messages`);
    }

    getMessageById(id: string): Observable<import('../models').Message> {
        return this.http.get<import('../models').Message>(`${this.baseUrl}/messages/${id}`);
    }

    sendMessage(message: import('../models').CreateMessageRequest): Observable<import('../models').Message> {
        return this.http.post<import('../models').Message>(`${this.baseUrl}/messages`, message);
    }

    deleteMessage(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/messages/${id}`);
    }
}
