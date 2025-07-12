import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  password?: string;
  OAuth?: boolean;
  gender?: string;
  wishlist?: any[];
  cart?: any[];
  birthDate?: Date;
  role?: string;
  ban?: boolean;
  recoveryEmail?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  OAuth?: boolean;
  gender?: string;
  birthDate?: Date;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshtoken: string;
  tokenExpiration: string;
  Uid: string;
}

export interface PasswordResetRequest {
  email: string;
  destination: string;
}

export interface OTPVerification {
  otp: string;
  email: string;
}

export interface PasswordUpdate {
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  // Authentication
  register(userData: RegisterRequest): Observable<any> {
    return this.apiService.post('/register', userData);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post('/login', credentials);
  }

  refreshToken(refreshToken: string, uid: string): Observable<AuthResponse> {
    return this.apiService.post('/refreshtoken', { refreshtoken: refreshToken, uid });
  }

  // Password Management
  forgetPassword(request: PasswordResetRequest): Observable<any> {
    return this.apiService.post('/forgetPassword', request);
  }

  verifyOTP(verification: OTPVerification): Observable<any> {
    return this.apiService.post('/verifCode', verification);
  }

  resetPassword(update: PasswordUpdate): Observable<any> {
    return this.apiService.post('/resetPassword', update);
  }

  updatePassword(id: string, oldPassword: string, newPassword: string, newRecovery?: string): Observable<any> {
    return this.apiService.post('/updatepassword', {
      id,
      oldPassword,
      newPassword,
      newRecovery
    });
  }

  // Profile Management
  getProfileById(id: string): Observable<any> {
    return this.apiService.post('/profilgetById', { id });
  }

  updateProfile(userData: Partial<User> & { id: string }): Observable<any> {
    return this.apiService.put('/updateProfil', userData);
  }

  // Shopping Features
  updateWishlist(id: string, wishlist: any[]): Observable<any> {
    return this.apiService.put('/updateWishlist', { id, wishlist });
  }

  updateCart(id: string, cart: any[]): Observable<any> {
    return this.apiService.put('/updateCart', { id, cart });
  }

  // Payment
  processPayment(paymentData: any): Observable<any> {
    return this.apiService.post('/pay', paymentData);
  }

  // Admin Functions
  getAllUsers(): Observable<User[]> {
    return this.apiService.get('/users');
  }

  banUser(id: string, ban: boolean): Observable<any> {
    return this.apiService.put('/banUser', { id, ban });
  }

  deleteUser(id: string): Observable<any> {
    return this.apiService.delete(`/deleteUser/${id}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.apiService.post('/getAllUserEmails', { email });
  }

  // Token Management
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 