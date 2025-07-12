import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>⚙️ Paramètres du Système</h1>
        <p>Configurez les paramètres de votre application</p>
      </div>

      <div class="settings-grid">
        <!-- General Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>settings</mat-icon>
              Paramètres Généraux
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="generalForm" class="settings-form">
              <mat-form-field appearance="outline">
                <mat-label>Nom de l'Application</mat-label>
                <input matInput formControlName="appName" placeholder="Mon Application">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>URL du Site</mat-label>
                <input matInput formControlName="siteUrl" placeholder="https://example.com">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Langue par défaut</mat-label>
                <mat-select formControlName="defaultLanguage">
                  <mat-option value="fr">Français</mat-option>
                  <mat-option value="en">English</mat-option>
                  <mat-option value="ar">العربية</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Fuseau horaire</mat-label>
                <mat-select formControlName="timezone">
                  <mat-option value="Africa/Tunis">Tunis (UTC+1)</mat-option>
                  <mat-option value="Europe/Paris">Paris (UTC+1/+2)</mat-option>
                  <mat-option value="UTC">UTC</mat-option>
                </mat-select>
              </mat-form-field>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Email Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>email</mat-icon>
              Paramètres Email
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="emailForm" class="settings-form">
              <mat-form-field appearance="outline">
                <mat-label>Serveur SMTP</mat-label>
                <input matInput formControlName="smtpServer" placeholder="smtp.gmail.com">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Port SMTP</mat-label>
                <input matInput type="number" formControlName="smtpPort" placeholder="587">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Email d'envoi</mat-label>
                <input matInput formControlName="fromEmail" placeholder="noreply@example.com">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Nom d'expéditeur</mat-label>
                <input matInput formControlName="fromName" placeholder="Mon Application">
              </mat-form-field>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Security Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>security</mat-icon>
              Sécurité
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="securityForm" class="settings-form">
              <mat-form-field appearance="outline">
                <mat-label>Durée de session (minutes)</mat-label>
                <input matInput type="number" formControlName="sessionTimeout" placeholder="30">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Longueur minimale du mot de passe</mat-label>
                <input matInput type="number" formControlName="minPasswordLength" placeholder="8">
              </mat-form-field>
              
              <div class="checkbox-group">
                <mat-checkbox formControlName="requireUppercase">
                  Exiger une lettre majuscule
                </mat-checkbox>
                
                <mat-checkbox formControlName="requireNumber">
                  Exiger un chiffre
                </mat-checkbox>
                
                <mat-checkbox formControlName="requireSpecialChar">
                  Exiger un caractère spécial
                </mat-checkbox>
                
                <mat-checkbox formControlName="enableTwoFactor">
                  Activer l'authentification à deux facteurs
                </mat-checkbox>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Notification Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications</mat-icon>
              Notifications
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="notificationForm" class="settings-form">
              <div class="checkbox-group">
                <mat-checkbox formControlName="emailNotifications">
                  Notifications par email
                </mat-checkbox>
                
                <mat-checkbox formControlName="pushNotifications">
                  Notifications push
                </mat-checkbox>
                
                <mat-checkbox formControlName="smsNotifications">
                  Notifications SMS
                </mat-checkbox>
                
                <mat-checkbox formControlName="newUserNotification">
                  Notifier les nouveaux utilisateurs
                </mat-checkbox>
                
                <mat-checkbox formControlName="orderNotification">
                  Notifier les nouvelles commandes
                </mat-checkbox>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Action Buttons -->
      <div class="settings-actions">
        <button mat-button (click)="resetSettings()">
          <mat-icon>refresh</mat-icon>
          Réinitialiser
        </button>
        <button mat-raised-button color="primary" (click)="saveSettings()">
          <mat-icon>save</mat-icon>
          Sauvegarder
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .settings-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px;
    }
    
    .settings-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .settings-header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .settings-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .settings-card mat-card-header {
      background: #f8f9fa;
      border-radius: 12px 12px 0 0;
      padding: 1rem;
    }
    
    .settings-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #2c3e50;
      font-size: 1.2rem;
    }
    
    .settings-card mat-card-content {
      padding: 1.5rem;
    }
    
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .settings-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .settings-actions button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
    }
    
    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }
      
      .settings-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .settings-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class SettingsComponent {
  generalForm: FormGroup;
  emailForm: FormGroup;
  securityForm: FormGroup;
  notificationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.generalForm = this.fb.group({
      appName: ['Mon Application', Validators.required],
      siteUrl: ['https://example.com', Validators.required],
      defaultLanguage: ['fr', Validators.required],
      timezone: ['Africa/Tunis', Validators.required]
    });

    this.emailForm = this.fb.group({
      smtpServer: ['smtp.gmail.com', Validators.required],
      smtpPort: [587, Validators.required],
      fromEmail: ['noreply@example.com', [Validators.required, Validators.email]],
      fromName: ['Mon Application', Validators.required]
    });

    this.securityForm = this.fb.group({
      sessionTimeout: [30, Validators.required],
      minPasswordLength: [8, Validators.required],
      requireUppercase: [true],
      requireNumber: [true],
      requireSpecialChar: [false],
      enableTwoFactor: [false]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      smsNotifications: [false],
      newUserNotification: [true],
      orderNotification: [true]
    });
  }

  saveSettings() {
    if (this.generalForm.valid && this.emailForm.valid && 
        this.securityForm.valid && this.notificationForm.valid) {
      const settings = {
        general: this.generalForm.value,
        email: this.emailForm.value,
        security: this.securityForm.value,
        notifications: this.notificationForm.value
      };
      
      console.log('Saving settings:', settings);
      // Here you would typically save to your backend
      alert('Paramètres sauvegardés avec succès!');
    }
  }

  resetSettings() {
    this.generalForm.reset({
      appName: 'Mon Application',
      siteUrl: 'https://example.com',
      defaultLanguage: 'fr',
      timezone: 'Africa/Tunis'
    });
    
    this.emailForm.reset({
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      fromEmail: 'noreply@example.com',
      fromName: 'Mon Application'
    });
    
    this.securityForm.reset({
      sessionTimeout: 30,
      minPasswordLength: 8,
      requireUppercase: true,
      requireNumber: true,
      requireSpecialChar: false,
      enableTwoFactor: false
    });
    
    this.notificationForm.reset({
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newUserNotification: true,
      orderNotification: true
    });
  }
} 