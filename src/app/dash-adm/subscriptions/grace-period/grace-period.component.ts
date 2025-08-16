import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../../shared/services/subscription.service';

@Component({
  selector: 'app-grace-period',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grace-period.component.html',
  styleUrls: ['./grace-period.component.css']
})
export class GracePeriodComponent implements OnInit {
  gracePeriodSubscriptions: any[] = [];
  expirationStats: any = null;
  isLoading = false;
  message = '';
  messageType = '';

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadGracePeriodData();
  }

  loadGracePeriodData(): void {
    this.isLoading = true;
    
    // Load grace period subscriptions
    this.subscriptionService.getGracePeriodSubscriptions().subscribe({
      next: (response) => {
        this.gracePeriodSubscriptions = response.subscriptions || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading grace period subscriptions:', error);
        this.showMessage('Error loading grace period data', 'error');
        this.isLoading = false;
      }
    });

    // Load enhanced expiration stats
    this.subscriptionService.getEnhancedExpirationStats().subscribe({
      next: (response) => {
        this.expirationStats = response;
      },
      error: (error) => {
        console.error('Error loading expiration stats:', error);
      }
    });
  }

  runExpirationCheck(): void {
    this.isLoading = true;
    this.showMessage('Running expiration check...', 'info');
    
    this.subscriptionService.checkExpiredSubscriptions().subscribe({
      next: (response) => {
        this.showMessage('Expiration check completed successfully', 'success');
        this.loadGracePeriodData(); // Refresh data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error running expiration check:', error);
        this.showMessage('Error running expiration check', 'error');
        this.isLoading = false;
      }
    });
  }

  getDaysRemaining(gracePeriodEndDate: string): number {
    const endDate = new Date(gracePeriodEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatusClass(daysRemaining: number): string {
    if (daysRemaining <= 0) return 'status-expired';
    if (daysRemaining <= 2) return 'status-critical';
    if (daysRemaining <= 5) return 'status-warning';
    return 'status-normal';
  }

  getStatusText(daysRemaining: number): string {
    if (daysRemaining <= 0) return 'Grace Period Ended';
    if (daysRemaining <= 2) return 'Critical';
    if (daysRemaining <= 5) return 'Warning';
    return 'Normal';
  }

  showMessage(message: string, type: string): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  refreshData(): void {
    this.loadGracePeriodData();
  }
}
