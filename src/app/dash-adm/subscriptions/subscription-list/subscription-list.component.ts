import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SubscriptionService, Subscription } from '../../../shared/services/subscription.service';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  isLoading = true;
  displayedColumns: string[] = [
    'supplier',
    'planType',
    'status',
    'paymentStatus',
    'startDate',
    'endDate',
    'price',
    'actions'
  ];

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.isLoading = true;
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return this.subscriptionService.getSubscriptionStatusClass(status);
  }

  getPaymentStatusClass(paymentStatus: string): string {
    return this.subscriptionService.getPaymentStatusClass(paymentStatus);
  }

  getDaysRemaining(subscription: Subscription): number {
    return this.subscriptionService.getDaysRemaining(subscription);
  }

  isSubscriptionActive(subscription: Subscription): boolean {
    return this.subscriptionService.isSubscriptionActive(subscription);
  }

  isSubscriptionExpired(subscription: Subscription): boolean {
    return this.subscriptionService.isSubscriptionExpired(subscription);
  }

  cancelSubscription(id: string) {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      this.subscriptionService.cancelSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (error) => {
          console.error('Error cancelling subscription:', error);
        }
      });
    }
  }

  renewSubscription(id: string) {
    if (confirm('Are you sure you want to renew this subscription?')) {
      this.subscriptionService.renewSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (error) => {
          console.error('Error renewing subscription:', error);
        }
      });
    }
  }

  updatePaymentStatus(id: string, paymentStatus: string) {
    this.subscriptionService.updatePaymentStatus(id, paymentStatus).subscribe({
      next: () => {
        this.loadSubscriptions();
      },
      error: (error) => {
        console.error('Error updating payment status:', error);
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0.00';
    }
    return `$${price.toFixed(2)}`;
  }
} 