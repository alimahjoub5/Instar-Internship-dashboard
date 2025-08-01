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
        console.log('✅ Réponse de connexion reçue:', response);
        console.log('📊 Type de réponse:', typeof response);
        console.log('🔑 Clés de réponse:', Object.keys(response));
        
        // Check if response has the expected structure
        if (!response || !response.token) {
          console.error('❌ Structure de réponse invalide:', response);
          this.error = 'Réponse invalide du serveur';
          this.isLoading = false;
          return;
        }
        
        console.log('🎫 Token reçu:', response.token);
        console.log('👤 ID utilisateur reçu:', response.Uid);
        
        // Use the new auth service
        this.authService.login(response.token, response.Uid, response.refreshtoken);
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        console.log('💾 Token stocké dans localStorage:', storedToken);
        
        if (storedToken) {
          console.log('🎉 Connexion réussie! Redirection vers le dashboard...');
          this.router.navigate(['/dash-adm']);
        } else {
          console.error('❌ Token non stocké correctement');
          this.error = 'Erreur lors du stockage du token';
        }
        
        this.isLoading = false;
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