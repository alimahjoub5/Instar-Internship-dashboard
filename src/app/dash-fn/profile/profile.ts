import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SupplierService, Supplier } from '../../shared/services/supplier.service';
import { SubscriptionService, Subscription, SubscriptionPlan } from '../../shared/services/subscription.service';
import { OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { Sidebar } from '../sidebar/sidebar';
import { FnFooter } from '../fn-footer/fn-footer';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';

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
    MatCardModule, 
    MatDividerModule, 
    MatIconModule, 
    CommonModule, 
    SharedModule, 
    RouterModule,
    FormsModule,
    PaymentModalComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  supplier: Supplier = {
    name: '',
    address: '',
    phone: '',
    marque: '',
    rib: '',
    image: '',
    email: '',
    password: '',
    webSite: ''
  };
  is2FAEnabled: boolean = false;
  activeTab: string = 'profile';
  
  // Subscription properties
  userSubscriptions: Subscription[] = [];
  availablePlans: SubscriptionPlan[] = [];
  hasActiveSubscription: boolean = false;
  subscriptionLoading: boolean = false;
  subscriptionError: string | null = null;
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
  
  // Payment modal properties
  showPaymentModal: boolean = false;
  selectedPlanForPayment: SubscriptionPlan | null = null;

  constructor(
    private supplierService: SupplierService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.loadSupplierProfile();
    this.loadSubscriptionData();
  }

  private loadSupplierProfile(): void {
    this.loading = true;
    this.error = null;

    // Get supplier ID from localStorage or authentication service
    const supplierId = localStorage.getItem('uid') 
    if (!supplierId) {
      this.error = 'Supplier not authenticated';
      this.loading = false;
      return;
    }

    this.supplierService.getSupplierByUserId(supplierId).subscribe({
      next: (supplier: Supplier) => {
        this.supplier = { ...this.supplier, ...supplier };
        this.loading = false;
        console.log('Supplier profile loaded successfully:', this.supplier);
      },
      error: (error) => {
        this.error = 'Failed to load supplier profile. Please try again.';
        this.loading = false;
        console.error('Error loading supplier profile:', error);
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
    if (tab === 'verification') {
      // Load verification data when tab is activated
      console.log('Loading verification data...');
      this.loadSubscriptionData();
    }
    // Reset password form when switching away from password tab
    if (tab !== 'password') {
      this.resetPasswordForm();
    }
  }

  loadSubscriptionData(): void {
    const supplierId = localStorage.getItem('supplierId') || localStorage.getItem('userId');
    if (!supplierId) {
      return;
    }

    this.subscriptionLoading = true;
    this.subscriptionError = null;
    
    // Check if supplier has subscriptions
    this.subscriptionService.getSubscriptionsBySupplier(supplierId)
      .pipe(
        catchError(error => {
          console.error('Error loading supplier subscriptions:', error);
          this.subscriptionError = 'Failed to load subscription data';
          return of([]);
        })
      )
      .subscribe(subscriptions => {
        this.userSubscriptions = subscriptions;
        this.hasActiveSubscription = subscriptions.some(sub => 
          this.subscriptionService.isSubscriptionActive(sub)
        );
        
        // If no active subscription, load available plans
        if (!this.hasActiveSubscription) {
          this.loadAvailablePlans();
        }
        
        this.subscriptionLoading = false;
      });
  }

  private loadAvailablePlans(): void {
    this.subscriptionService.getAllSubscriptionPlans()
      .pipe(
        catchError(error => {
          console.error('Error loading subscription plans:', error);
          this.subscriptionError = 'Failed to load subscription plans';
          return of([]);
        })
      )
      .subscribe(plans => {
        this.availablePlans = plans.filter(plan => plan.isActive);
      });
  }

  getSubscriptionStatusClass(subscription: Subscription): string {
    return this.subscriptionService.getSubscriptionStatusClass(subscription.status);
  }

  getSubscriptionStatus(subscription: Subscription): string {
    return this.subscriptionService.getGracePeriodStatus(subscription);
  }

  getDaysRemaining(subscription: Subscription): number {
    return this.subscriptionService.getDaysRemaining(subscription);
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.selectedPlanForPayment = plan;
    this.showPaymentModal = true;
    console.log('Selected plan:', plan);
  }
  
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPlanForPayment = null;
  }
  
  getSupplierId(): string {
    return localStorage.getItem('supplierId') || localStorage.getItem('userId') || '';
  }
  
  onPaymentConfirm(paymentData: any): void {
    this.subscriptionLoading = true;
    this.subscriptionError = null;
    
    // Get supplierId from localStorage as fallback
    const supplierId = paymentData.supplierId || localStorage.getItem('supplierId') || localStorage.getItem('userId');
    
    if (!supplierId) {
      this.subscriptionError = 'Supplier ID not found. Please try logging in again.';
      this.subscriptionLoading = false;
      return;
    }
    
    const subscriptionData = {
      supplierId: supplierId,
      planType: paymentData.planType,
      paymentMethod: paymentData.paymentMethod,
      autoRenew: paymentData.autoRenew
    };
    
    this.subscriptionService.createSubscription(subscriptionData)
      .pipe(
        catchError(error => {
          console.error('Error creating subscription:', error);
          this.subscriptionError = 'Failed to create subscription. Please try again.';
          this.subscriptionLoading = false;
          // Reset modal processing state
          if (this.selectedPlanForPayment) {
            // Access the modal component and reset processing state if needed
          }
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Subscription created successfully:', response);
          this.subscriptionLoading = false;
          this.closePaymentModal();
          // Refresh subscription data
          this.loadSubscriptionData();
        }
      });
  }
  
  saveProfileChanges() {
    const supplierId = localStorage.getItem('supplierId') || localStorage.getItem('userId');
    if (!supplierId) {
      this.error = 'Supplier not authenticated';
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.supplierService.updateSupplier(supplierId, this.supplier).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Supplier profile updated successfully:', response);
        // You can add a success message here
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to update supplier profile. Please try again.';
        console.error('Error updating supplier profile:', error);
      }
    });
  }
  
  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const supplierId = localStorage.getItem('supplierId') || localStorage.getItem('userId');
    if (!supplierId) {
      this.error = 'Supplier not authenticated';
      return;
    }

    this.loading = true;
    this.error = null;
    
    // Update supplier password by updating the supplier object
    const updatedSupplier = { ...this.supplier, password: this.passwordData.newPassword };
    
    this.supplierService.updateSupplier(supplierId, updatedSupplier).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Password changed successfully:', response);
        this.supplier = updatedSupplier;
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
    this.loadSupplierProfile();
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
