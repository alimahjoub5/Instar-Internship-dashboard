import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; max-width: 400px; margin: 0 auto;">
      <h2>Test de Connexion</h2>
      
      <div style="margin-bottom: 20px;">
        <h3>Identifiants de test :</h3>
        <p><strong>Email:</strong> admin&#64;test.com</p>
        <p><strong>Mot de passe:</strong> admin123</p>
      </div>

      <div style="margin-bottom: 15px;">
        <label>Email:</label>
        <input type="email" [(ngModel)]="email" style="width: 100%; padding: 8px; margin-top: 5px;">
      </div>

      <div style="margin-bottom: 15px;">
        <label>Mot de passe:</label>
        <input type="password" [(ngModel)]="password" style="width: 100%; padding: 8px; margin-top: 5px;">
      </div>

      <button (click)="testLogin()" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px;">
        Tester la Connexion
      </button>

      <div *ngIf="result" style="margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
        <h4>Résultat :</h4>
        <pre>{{ result | json }}</pre>
      </div>

      <div *ngIf="error" style="margin-top: 20px; padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px;">
        <h4>Erreur :</h4>
        <p>{{ error }}</p>
      </div>
    </div>
  `
})
export class TestLoginComponent {
  email: string = 'admin@test.com';
  password: string = 'admin123';
  result: any = null;
  error: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  testLogin() {
    this.result = null;
    this.error = '';

    console.log('Tentative de connexion avec:', { email: this.email, password: this.password });

    this.userService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Réponse de connexion reçue:', response);
        this.result = response;
        
        if (response && response.token) {
          console.log('Token reçu:', response.token);
          this.authService.login(response.token, response.Uid, response.refreshtoken);
          
          const storedToken = localStorage.getItem('token');
          console.log('Token stocké:', storedToken);
          
          if (storedToken) {
            console.log('✅ Connexion réussie! Redirection...');
            this.router.navigate(['/dash-adm']);
          } else {
            this.error = 'Token non stocké correctement';
          }
        } else {
          this.error = 'Réponse invalide du serveur';
        }
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        this.error = err.error?.message || 'Erreur de connexion';
      }
    });
  }
} 