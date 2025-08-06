import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UserService, User } from '../../shared/services/user.service';
import { OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { Sidebar } from '../sidebar/sidebar';
import { FnFooter } from '../fn-footer/fn-footer';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  recoveryEmail: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Sidebar,
    MatCardModule, 
    MatDividerModule, 
    MatIconModule, 
    CommonModule, 
    SharedModule, 
    FnFooter,
    RouterModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    imageUrl: '',
    gender: '',
    recoveryEmail: ''
  };
  is2FAEnabled: boolean = false;
  activeTab: string = 'profile';
  loading: boolean = false;
  error: string | null = null;
  
  // Password form data
  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    recoveryEmail: ''
  };
  
  // Password visibility toggles
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    if (!this.userService.isAuthenticated()) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }

    this.userService.getUserProfile().subscribe({
      next: (user: User) => {
        this.user = { ...this.user, ...user };
        this.loading = false;
        console.log('User profile loaded successfully:', this.user);
      },
      error: (error) => {
        this.error = 'Failed to load user profile. Please try again.';
        this.loading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  activate2FA() {
    this.is2FAEnabled = true;
  }

  deactivate2FA() {
    this.is2FAEnabled = false;
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Reset password form when switching away from password tab
    if (tab !== 'password') {
      this.resetPasswordForm();
    }
  }
  
  saveProfileChanges() {
    if (!this.userService.isAuthenticated()) {
      this.error = 'User not authenticated';
      return;
    }

    const userId = this.userService.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }

    this.loading = true;
    this.error = null;

    const updateData = { ...this.user, id: userId };
    
    this.userService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Profile updated successfully:', response);
        // You can add a success message here
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to update profile. Please try again.';
        console.error('Error updating profile:', error);
      }
    });
  }
  
  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (!this.userService.isAuthenticated()) {
      this.error = 'User not authenticated';
      return;
    }

    const userId = this.userService.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.userService.updatePassword(
      userId,
      this.passwordData.currentPassword,
      this.passwordData.newPassword,
      this.passwordData.recoveryEmail
    ).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Password changed successfully:', response);
        this.resetPasswordForm();
        // You can add a success message here
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to change password. Please try again.';
        console.error('Error changing password:', error);
      }
    });
  }

  refreshProfile(): void {
    this.loadUserProfile();
  }
  
  resetPasswordForm() {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      recoveryEmail: ''
    };
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
  
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
}
