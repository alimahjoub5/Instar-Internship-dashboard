import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-reset',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css'
})
export class Reset {
  constructor(private router: Router, private userService: UserService) {}

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
    this.userService.forgetPassword({ email: this.email, destination: this.email }).subscribe({
      next: () => {
        this.currentStep = 2;
        this.isLoading = false;
        this.successMessage = 'Verification code sent successfully!';
        this.startResendCooldown();
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to send verification code.';
      }
    });
  }

  verifyCode(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.verifyOTP({ email: this.email, otp: this.verificationCode }).subscribe({
      next: () => {
        this.currentStep = 3;
        this.isLoading = false;
        this.successMessage = '';
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Invalid or expired verification code.';
      }
    });
  }

  resetPassword(): void {
    if (this.passwordsMismatch) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.resetPassword({ email: this.email, password: this.newPassword }).subscribe({
      next: () => {
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
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to reset password.';
      }
    });
  }

  resendCode(): void {
    if (this.resendCooldown > 0) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.forgetPassword({ email: this.email, destination: this.email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Verification code resent successfully!';
        this.startResendCooldown();
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to resend verification code.';
      }
    });
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
