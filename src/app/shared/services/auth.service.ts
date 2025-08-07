import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  private checkAuthStatus(): void {
    const isAuth = this.hasToken();
    this.isAuthenticatedSubject.next(isAuth);
  }

  login(token: string, userId: string, refreshToken?: string): void {
    console.log('AuthService.login called with:', { token, userId, refreshToken });
    
    if (!token) {
      console.error('No token provided to AuthService.login');
      return;
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    console.log('Token stored in AuthService:', localStorage.getItem('token'));
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('refreshToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Check if user is on login page
  isOnLoginPage(): boolean {
    return window.location.pathname === '/login';
  }

  // Redirect to login if not authenticated
  redirectToLoginIfNotAuthenticated(): void {
    if (!this.isAuthenticated() && !this.isOnLoginPage()) {
      this.router.navigate(['/login']);
    }
  }
} 