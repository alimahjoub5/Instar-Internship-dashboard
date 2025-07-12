import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  private router = inject(Router);
  private userService = inject(UserService);

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.userService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.userService.setToken(response.token);
        localStorage.setItem('refreshToken', response.refreshtoken);
        localStorage.setItem('userId', response.Uid);
        
        // Navigate based on user role (you might want to get this from user profile)
        this.router.navigate(['/dash-adm']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.error = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
} 