import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SubscriptionService, SubscriptionPlan } from '../../../shared/services/subscription.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-subscription-plans-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './subscription-plans-list.component.html',
  styleUrls: ['./subscription-plans-list.component.css']
})
export class SubscriptionPlansListComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (!this.userService.isAuthenticated()) {
      return;
    }
    this.loadSubscriptionPlans();
  }

  loadSubscriptionPlans() {
    this.isLoading = true;
    this.subscriptionService.getAllSubscriptionPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subscription plans:', error);
        this.error = 'Failed to load subscription plans';
        this.isLoading = false;
      }
    });
  }

  getPlanColor(type: string): string {
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

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  formatDuration(duration: number): string {
    if (duration === 1) {
      return '1 month';
    } else if (duration === 12) {
      return '1 year';
    } else {
      return `${duration} days`;
    }
  }

  getFeatureIcon(feature: string): string {
    switch (feature) {
      case 'analytics':
        return 'analytics';
      case 'prioritySupport':
        return 'support_agent';
      case 'customBranding':
        return 'palette';
      case 'apiAccess':
        return 'api';
      case 'advancedReporting':
        return 'assessment';
      case 'bulkOperations':
        return 'batch_prediction';
      case 'whiteLabel':
        return 'branding_watermark';
      default:
        return 'check';
    }
  }

  getFeatureLabel(feature: string): string {
    switch (feature) {
      case 'analytics':
        return 'Analytics';
      case 'prioritySupport':
        return 'Priority Support';
      case 'customBranding':
        return 'Custom Branding';
      case 'apiAccess':
        return 'API Access';
      case 'advancedReporting':
        return 'Advanced Reporting';
      case 'bulkOperations':
        return 'Bulk Operations';
      case 'whiteLabel':
        return 'White Label';
      default:
        return feature;
    }
  }

  getActiveFeatures(plan: SubscriptionPlan): string[] {
    const features: string[] = [];
    if (plan.features.analytics) features.push('analytics');
    if (plan.features.prioritySupport) features.push('prioritySupport');
    if (plan.features.customBranding) features.push('customBranding');
    if (plan.features.apiAccess) features.push('apiAccess');
    if (plan.features.advancedReporting) features.push('advancedReporting');
    if (plan.features.bulkOperations) features.push('bulkOperations');
    if (plan.features.whiteLabel) features.push('whiteLabel');
    return features;
  }

  deletePlan(planId: string) {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      this.subscriptionService.deleteSubscriptionPlan(planId).subscribe({
        next: () => {
          this.loadSubscriptionPlans();
        },
        error: (error) => {
          console.error('Error deleting subscription plan:', error);
          this.error = 'Failed to delete subscription plan';
        }
      });
    }
  }
} 