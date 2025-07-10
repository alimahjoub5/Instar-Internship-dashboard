import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css'
})
export class Reset {
  constructor(private router: Router) {}

  currentStep: number = 1;
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  resendCooldown: number = 0;

  get passwordsMismatch(): boolean {
    return this.newPassword !== '' && this.confirmPassword !== '' && 
           this.newPassword !== this.confirmPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  sendCode(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.currentStep = 2;
      this.isLoading = false;
      this.successMessage = 'Verification code sent successfully!';
      this.startResendCooldown();
    }, 2000);
  }

  verifyCode(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      if (this.verificationCode === '' || this.verificationCode.length < 4) {
        this.errorMessage = 'Invalid verification code';
        this.isLoading = false;
        return;
      }
      this.currentStep = 3;
      this.isLoading = false;
      this.successMessage = '';
    }, 1500);
  }

  resetPassword(): void {
    if (this.passwordsMismatch) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.successMessage = 'Your password has been reset successfully! Redirecting to login...';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      this.email = '';
      this.verificationCode = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.currentStep = 1;
    }, 2000);
  }

  resendCode(): void {
    if (this.resendCooldown > 0) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Verification code resent successfully!';
      this.startResendCooldown();
    }, 1500);
  }

  private startResendCooldown(): void {
    this.resendCooldown = 60;
    const interval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
}
