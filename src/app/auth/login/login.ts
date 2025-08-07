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
        this.userService.getProfileById(response.Uid).subscribe({
          next: (profile) => {
           if(profile.role === 'admin') {
              this.router.navigate(['/dash-adm']);
              this.isLoading = false;
            }else if(profile.role === 'user') {
              this.router.navigate(['/dash-fn']);
              this.isLoading = false;
              }
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
            this.error = 'Failed to fetch user profile. Please try again.';
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