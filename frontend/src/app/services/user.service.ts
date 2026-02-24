import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest, Order } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.baseUrl}/users/profile`);
    }

    updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${this.baseUrl}/users/profile`, request);
    }

    changePassword(request: ChangePasswordRequest): Observable<any> {
        return this.http.put(`${this.baseUrl}/users/change-password`, request);
    }

    getUserOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.baseUrl}/orders`);
    }
}
