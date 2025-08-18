import { Component, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SupplierService, Supplier } from '../../shared/services/supplier.service';
import { SubscriptionService, Subscription, SubscriptionPlan } from '../../shared/services/subscription.service';
import { UploadService } from '../../shared/services/upload.service';
import { AuthService } from '../../shared/services/auth.service';
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
  hasPendingSubscription: boolean = false;
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

  // Image upload properties
  isImageUploading: boolean = false;
  selectedFile: File | null = null;
  imageError: string | null = null;

  // Country dropdown properties
  showCountryDropdown: boolean = false;
  countries = [
    { name: 'Tunisia', code: '+216', flag: '🇹🇳', placeholder: 'Enter phone number' },
    { name: 'Nigeria', code: '+234', flag: '🇳🇬', placeholder: 'Enter phone number' },
    { name: 'France', code: '+33', flag: '🇫🇷', placeholder: 'Enter phone number' },
    { name: 'United States', code: '+1', flag: '🇺🇸', placeholder: 'Enter phone number' }
  ];
  selectedCountry = this.countries[0]; // Default to Tunisia

  constructor(
    private supplierService: SupplierService,
    private subscriptionService: SubscriptionService,
    private uploadService: UploadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSupplierProfile();
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
        // Load subscription data after supplier profile is loaded
        this.loadSubscriptionData();
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
    const supplierId = this.getSupplierId();
    console.log('Loading subscription data for supplier:', supplierId);
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
        console.log('Loaded subscriptions:', subscriptions);
        console.log('Number of subscriptions found:', subscriptions.length);

        this.userSubscriptions = subscriptions;
        this.hasActiveSubscription = subscriptions.some(sub => 
          this.subscriptionService.isSubscriptionActive(sub)
        );
        
        // Check if there's a pending subscription
        this.hasPendingSubscription = subscriptions.some(sub => sub.status === 'pending');
        
        console.log('Has active subscription:', this.hasActiveSubscription);
        console.log('Has pending subscription:', this.hasPendingSubscription);
        
        // Log each subscription status for debugging
        subscriptions.forEach((sub, index) => {
          console.log(`Subscription ${index + 1}:`, {
            id: sub._id,
            status: sub.status,
            planType: sub.planType,
            supplierId: sub.supplierId
          });
        });
        
        // If no active subscription and no pending subscription, load available plans
        if (!this.hasActiveSubscription && !this.hasPendingSubscription) {
          console.log('Loading available plans since no active or pending subscription found');
          this.loadAvailablePlans();
        } else {
          console.log('Not loading plans - has active or pending subscription');
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
        console.log('Available subscription plans loaded successfully:', plans);
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
    // Use the supplier's _id from the loaded supplier profile
    return this.supplier?._id || '';
  }
  
  onPaymentConfirm(paymentData: any): void {
    console.log('🔄 Payment confirmation started with data:', paymentData);
    this.subscriptionLoading = true;
    this.subscriptionError = null;
    
    // Get supplierId from the loaded supplier profile first, then fallback to localStorage
    const supplierId = paymentData.supplierId || this.getSupplierId() || localStorage.getItem('uid');
    console.log('👤 Supplier ID retrieved:', supplierId);
    
    if (!supplierId) {
      console.error('❌ No supplier ID found in localStorage or paymentData');
      this.subscriptionError = 'Supplier ID not found. Please try logging in again.';
      this.subscriptionLoading = false;
      return;
    }
    
    // Map payment method from frontend to backend format
    let mappedPaymentMethod = paymentData.paymentMethod;
    if (paymentData.paymentMethod === 'credit-card') {
      mappedPaymentMethod = 'card';
    }
    
    const subscriptionData = {
      supplierId: supplierId,
      planType: paymentData.planType,
      paymentMethod: mappedPaymentMethod,
      autoRenew: paymentData.autoRenew
    };
    
    console.log('📦 Subscription data to be sent:', subscriptionData);
    
    this.subscriptionService.createSubscription(subscriptionData)
      .pipe(
        catchError(error => {
          console.error('❌ Error creating subscription:', error);
          console.error('❌ Error details:', error.error);
          console.error('❌ Error status:', error.status);
          this.subscriptionError = error.error?.message || 'Failed to create subscription. Please try again.';
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
          console.log('✅ Subscription created successfully:', response);
          this.subscriptionLoading = false;
          this.closePaymentModal();
          // Refresh subscription data
          this.loadSubscriptionData();
        } else {
          console.warn('⚠️ Subscription creation returned null response');
          this.subscriptionLoading = false;
        }
      });
  }
  
  saveProfileChanges() {
    const supplierId = this.getSupplierId();
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

  // Photo upload methods
  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Please select a valid image file.';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = 'File size must be less than 5MB.';
        return;
      }

      // Clear any previous errors
      this.imageError = null;
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.supplier.image = e.target.result;
      };
      reader.readAsDataURL(file);

      // Start upload process
      this.uploadImage();
    }
  }

  private uploadImage(): void {
    if (!this.selectedFile) {
      return;
    }

    // Disable the form during upload
    this.isImageUploading = true;
    this.loading = true;
    this.error = null;

    console.log('Starting image upload...');

    // Upload the file using UploadService
    this.uploadService.uploadFile(this.selectedFile, 'images')
      .pipe(
        catchError(error => {
          console.error('Error uploading image:', error);
          this.imageError = 'Failed to upload image. Please try again.';
          this.isImageUploading = false;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(uploadResponse => {
        if (uploadResponse) {
          console.log('Image uploaded successfully:', uploadResponse);
          
          // Update supplier entity with new image URL
          const supplierId = this.getSupplierId();
          if (supplierId) {
            this.updateSupplierImage(supplierId, uploadResponse.fileUrl);
          } else {
            this.imageError = 'Supplier ID not found. Please try logging in again.';
            this.isImageUploading = false;
            this.loading = false;
          }
        }
      });
  }

  private updateSupplierImage(supplierId: string, imageUrl: string): void {
    const updateData = { image: imageUrl };
    
    console.log('Updating supplier with new image URL:', imageUrl);
    
    this.supplierService.updateSupplier(supplierId, updateData)
      .pipe(
        catchError(error => {
          console.error('Error updating supplier:', error);
          this.error = 'Failed to update profile image. Please try again.';
          this.isImageUploading = false;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(updatedSupplier => {
        if (updatedSupplier) {
          console.log('Supplier updated successfully:', updatedSupplier);
          
          // Update local supplier data
          this.supplier.image = imageUrl;
          
          // Update sessionStorage to reflect changes in sidebar
          sessionStorage.setItem('supplierImage', imageUrl);
          
          // Reset upload state
          this.isImageUploading = false;
          this.loading = false;
          this.selectedFile = null;
          this.imageError = null;
          
          console.log('Profile image updated successfully!');
        }
      });
  }



  getInitials(name: string): string {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  // Country dropdown methods
  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  selectCountry(country: any): void {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-select')) {
      this.showCountryDropdown = false;
    }
  }
}
