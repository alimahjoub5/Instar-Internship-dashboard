import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

import { SubscriptionService, SubscriptionStats } from '../../../shared/services/subscription.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-subscription-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './subscription-stats.component.html',
  styleUrls: ['./subscription-stats.component.css']
})
export class SubscriptionStatsComponent implements OnInit {
  stats: SubscriptionStats | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.subscriptionService.getSubscriptionStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subscription stats:', error);
        if (error.status === 401) {
          this.errorMessage = 'Authentication required. Please log in again.';
          this.userService.removeToken();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Error loading subscription statistics';
        }
        this.isLoading = false;
      }
    });
  }

  getActivePercentage(): number {
    if (!this.stats?.totalSubscriptions) return 0;
    return (this.stats.activeSubscriptions / this.stats.totalSubscriptions) * 100;
  }

  getExpiredPercentage(): number {
    if (!this.stats?.totalSubscriptions) return 0;
    return (this.stats.expiredSubscriptions / this.stats.totalSubscriptions) * 100;
  }

  getPendingPercentage(): number {
    if (!this.stats?.totalSubscriptions) return 0;
    return (this.stats.pendingSubscriptions / this.stats.totalSubscriptions) * 100;
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatMonth(year: number, month: number): string {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  formatPaymentMethod(method: string): string {
    switch (method) {
      case 'card':
        return 'Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ');
    }
  }

  getPlanColor(planType: string): string {
    switch (planType) {
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
} 