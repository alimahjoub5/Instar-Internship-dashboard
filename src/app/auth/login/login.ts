import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';

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
  private authService = inject(AuthService);

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    console.log('🔐 Tentative de connexion avec:', { email: this.email, password: this.password });

    this.userService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.userService.storeAuthData(response);
        console.log('✅ Login successful, fetching profile...');
        this.userService.getUserById(response.Uid).subscribe({
          next: (profileResponse) => {
            // Handle the nested response structure: { message: "...", user: {...} }
            const profile = profileResponse.user || profileResponse;
            console.log('👤 Profile fetched:', profile);
            
            // Save user profile in auth service for app-wide access
            this.authService.setCurrentUser(profile);
            
            if(profile.role === 'admin') {
              this.router.navigate(['/dash-adm']);
              this.isLoading = false;
            } else if(profile.role === 'vendor') {
              this.router.navigate(['/dash-fn']);
              this.isLoading = false;
            } else {
              this.error = 'Invalid user role. Please contact support.';
              this.isLoading = false;
            }
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
            this.error = 'Failed to fetch user profile. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Erreur de connexion:', error);
        console.error('📋 Détails de l\'erreur:', error.error);
        this.error = error.error?.message || 'Échec de la connexion. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}