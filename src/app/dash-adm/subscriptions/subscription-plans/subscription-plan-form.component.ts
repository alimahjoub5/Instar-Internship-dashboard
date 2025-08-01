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
  planForm: FormGroup;
  isEditMode = false;
  planId: string | null = null;
  isLoading = false;
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
  }

  ngOnInit() {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.planId = this.route.snapshot.paramMap.get('id');
    if (this.planId) {
      this.isEditMode = true;
      this.loadPlan();
    }
  }

  loadPlan() {
    this.isLoading = true;
    this.subscriptionService.getSubscriptionPlanById(this.planId!).subscribe({
      next: (plan) => {
        this.planForm.patchValue({
          name: plan.name,
          type: plan.type,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
          isActive: plan.isActive,
          features: {
            maxProducts: plan.features.maxProducts,
            maxImages: plan.features.maxImages,
            analytics: plan.features.analytics,
            prioritySupport: plan.features.prioritySupport,
            customBranding: plan.features.customBranding,
            apiAccess: plan.features.apiAccess,
            advancedReporting: plan.features.advancedReporting,
            bulkOperations: plan.features.bulkOperations,
            whiteLabel: plan.features.whiteLabel
          }
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading plan:', error);
        this.error = 'Failed to load subscription plan';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
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