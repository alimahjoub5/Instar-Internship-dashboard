import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { SubscriptionService, SubscriptionPlan } from '../../../shared/services/subscription.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './subscription-plan-form.component.html',
  styleUrls: ['./subscription-plan-form.component.css']
})
export class SubscriptionPlanFormComponent implements OnInit {
  planForm!: FormGroup;
  isEditMode = false;
  planId: string | null = null;
  isLoading = false;
  isFormReady = false;
  error: string | null = null;

  planTypes = [
    { value: 'basic', label: 'Basic' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Form will be initialized in ngOnInit
  }

  ngOnInit() {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Ensure form is properly initialized
    this.initializeForm();

    this.planId = this.route.snapshot.paramMap.get('id');
    if (this.planId) {
      this.isEditMode = true;
      this.loadPlan();
    }
  }

  private initializeForm() {
    console.log('Initializing subscription plan form...');
    this.planForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      isActive: [true],
      features: this.fb.group({
        maxProducts: [10, [Validators.required, Validators.min(1)]],
        maxImages: [5, [Validators.required, Validators.min(1)]],
        analytics: [false],
        prioritySupport: [false],
        customBranding: [false],
        apiAccess: [false],
        advancedReporting: [false],
        bulkOperations: [false],
        whiteLabel: [false]
      })
    });
    console.log('Form initialized:', this.planForm);
    console.log('Features group:', this.planForm.get('features'));
    this.isFormReady = true;
  }

  loadPlan() {
    this.isLoading = true;
    console.log('Loading subscription plan with ID:', this.planId);
    this.subscriptionService.getSubscriptionPlanById(this.planId!).subscribe({
      next: (plan) => {
        console.log('Plan loaded successfully:', plan);
        this.planForm.patchValue({
          name: plan.name,
          type: plan.type,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
          isActive: plan.isActive,
          features: {
            maxProducts: plan.features?.maxProducts || 10,
            maxImages: plan.features?.maxImages || 5,
            analytics: plan.features?.analytics || false,
            prioritySupport: plan.features?.prioritySupport || false,
            customBranding: plan.features?.customBranding || false,
            apiAccess: plan.features?.apiAccess || false,
            advancedReporting: plan.features?.advancedReporting || false,
            bulkOperations: plan.features?.bulkOperations || false,
            whiteLabel: plan.features?.whiteLabel || false
          }
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading plan:', error);
        let errorMessage = 'Failed to load subscription plan';
        
        if (error.status === 404) {
          errorMessage = 'Subscription plan not found';
        } else if (error.status === 401) {
          errorMessage = 'Authentication required';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred';
        }
        
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (!this.planForm) {
      console.error('Form not initialized');
      return;
    }
    
    if (this.planForm.valid) {
      this.isLoading = true;
      const planData = this.planForm.value;

      if (this.isEditMode) {
        this.subscriptionService.updateSubscriptionPlan(this.planId!, planData).subscribe({
          next: () => {
            this.router.navigate(['/dash-adm/subscriptions/plans']);
          },
          error: (error) => {
            console.error('Error updating plan:', error);
            this.error = 'Failed to update subscription plan';
            this.isLoading = false;
          }
        });
      } else {
        this.subscriptionService.createSubscriptionPlan(planData).subscribe({
          next: () => {
            this.router.navigate(['/dash-adm/subscriptions/plans']);
          },
          error: (error) => {
            console.error('Error creating plan:', error);
            this.error = 'Failed to create subscription plan';
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dash-adm/subscriptions/plans']);
  }

  getPlanTypeColor(type: string): string {
    switch (type) {
      case 'basic':
        return 'primary';
      case 'premium':
        return 'warn';
      case 'enterprise':
        return 'accent';
      default:
        return 'primary';
    }
  }

  getFieldError(fieldName: string): string {
    if (!this.planForm) {
      return '';
    }
    
    const field = this.planForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }
} 