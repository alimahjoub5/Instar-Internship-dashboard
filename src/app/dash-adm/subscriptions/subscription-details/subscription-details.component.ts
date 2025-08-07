import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SubscriptionService, Subscription } from '../../../shared/services/subscription.service';
import { SupplierService, Supplier } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent implements OnInit {
  subscription: Subscription | null = null;
  supplier: Supplier | null = null;
  isLoading = true;
  error: string | null = null;
  subscriptionId: string | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptionId = this.route.snapshot.paramMap.get('id');
    if (this.subscriptionId) {
      this.loadSubscriptionDetails();
    } else {
      this.error = 'Subscription ID not provided';
      this.isLoading = false;
    }
  }

  loadSubscriptionDetails() {
    this.isLoading = true;
    this.subscriptionService.getSubscriptionById(this.subscriptionId!).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        console.log('Subscription data:', subscription); // Debug log
        
        // Check if supplier data is already included in the subscription
        if (subscription.supplier && typeof subscription.supplier === 'object') {
          this.supplier = subscription.supplier as any;
          this.isLoading = false;
        } else if (subscription.supplierId) {
          // Extract supplier ID properly
          const supplierId = typeof subscription.supplierId === 'string' 
            ? subscription.supplierId 
            : (subscription.supplierId as any)?._id || subscription.supplierId;
          
          if (supplierId && typeof supplierId === 'string') {
            this.loadSupplierDetails(supplierId);
          } else {
            console.warn('Invalid supplier ID:', subscription.supplierId);
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading subscription details:', error);
        this.error = 'Failed to load subscription details';
        this.isLoading = false;
      }
    });
  }

  loadSupplierDetails(supplierId: string) {
    console.log('Loading supplier with ID:', supplierId); // Debug log
    this.supplierService.getSupplierById(supplierId).subscribe({
      next: (supplier) => {
        this.supplier = supplier;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading supplier details:', error);
        // Don't show error for supplier loading failure, just continue without supplier data
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

  getDaysRemaining(): number {
    if (!this.subscription) return 0;
    return this.subscriptionService.getDaysRemaining(this.subscription);
  }

  getProgressPercentage(): number {
    if (!this.subscription) return 0;
    const now = new Date();
    const startDate = new Date(this.subscription.startDate);
    const endDate = new Date(this.subscription.endDate);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  }

  isSubscriptionActive(): boolean {
    if (!this.subscription) return false;
    return this.subscriptionService.isSubscriptionActive(this.subscription);
  }

  isSubscriptionExpired(): boolean {
    if (!this.subscription) return false;
    return this.subscriptionService.isSubscriptionExpired(this.subscription);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0.00';
    }
    return `$${price.toFixed(2)}`;
  }

  formatDuration(startDate: Date | string, endDate: Date | string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  }

  cancelSubscription() {
    if (!this.subscription || !confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    this.subscriptionService.cancelSubscription(this.subscription._id!).subscribe({
      next: () => {
        this.loadSubscriptionDetails();
      },
      error: (error) => {
        console.error('Error cancelling subscription:', error);
      }
    });
  }

  renewSubscription() {
    if (!this.subscription || !confirm('Are you sure you want to renew this subscription?')) {
      return;
    }

    this.subscriptionService.renewSubscription(this.subscription._id!).subscribe({
      next: () => {
        this.loadSubscriptionDetails();
      },
      error: (error) => {
        console.error('Error renewing subscription:', error);
      }
    });
  }

  updatePaymentStatus(paymentStatus: string) {
    if (!this.subscription) return;

    this.subscriptionService.updatePaymentStatus(this.subscription._id!, paymentStatus).subscribe({
      next: () => {
        this.loadSubscriptionDetails();
      },
      error: (error) => {
        console.error('Error updating payment status:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dash-adm/subscriptions']);
  }

  editSubscription() {
    if (this.subscription) {
      this.router.navigate(['/dash-adm/subscriptions/edit', this.subscription._id]);
    }
  }
} 