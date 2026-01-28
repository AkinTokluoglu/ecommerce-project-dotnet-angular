import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;

    currentUser = signal<User | null>(null);
    isLoggedIn = signal(false);

    constructor(private http: HttpClient, private router: Router) {
        this.loadUser();
    }

    login(credentials: LoginRequest): Observable<any> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
            .pipe(
                tap((response: any) => this.setSession(response))
            );
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data)
            .pipe(
                tap((response: any) => this.setSession(response))
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        this.router.navigate(['/']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'Admin';
    }

    private setSession(response: any): void {
        console.log('Auth Response:', response);
        localStorage.setItem('token', response.token);

        // Backend düz (flat) obje döndürüyor, frontend User objesi istiyor
        const user: User = {
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            role: response.role,
            phone: '', // Eksik alanlar
            address: ''
            // passwordHash ve diğerleri gerekmez
        } as User;

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
    }

    private loadUser(): void {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
            try {
                const user = JSON.parse(userStr);
                this.currentUser.set(user);
                this.isLoggedIn.set(true);
            } catch (e) {
                console.error('Error parsing user data:', e);
                // Clear potentially corrupt data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }
}
