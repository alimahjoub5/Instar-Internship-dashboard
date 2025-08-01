import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../../shared/services/subscription.service';

@Component({
  selector: 'app-subscription-expiration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-expiration.component.html',
  styleUrls: ['./subscription-expiration.component.css']
})
export class SubscriptionExpirationComponent implements OnInit {
  expirationStats: any = null;
  upcomingExpirations: any[] = [];
  isLoading = false;
  message = '';
  messageType = '';

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadExpirationStats();
    this.loadUpcomingExpirations();
  }

  loadExpirationStats(): void {
    this.isLoading = true;
    this.subscriptionService.getExpirationStats().subscribe({
      next: (stats) => {
        this.expirationStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expiration stats:', error);
        this.showMessage('Error loading expiration statistics', 'error');
        this.isLoading = false;
      }
    });
  }

  loadUpcomingExpirations(): void {
    this.subscriptionService.getUpcomingExpirations().subscribe({
      next: (response) => {
        this.upcomingExpirations = response.subscriptions || [];
      },
      error: (error) => {
        console.error('Error loading upcoming expirations:', error);
        this.showMessage('Error loading upcoming expirations', 'error');
      }
    });
  }

  runManualExpirationCheck(): void {
    this.isLoading = true;
    this.showMessage('Running manual expiration check...', 'info');
    
    this.subscriptionService.manualExpirationCheck().subscribe({
      next: (response) => {
        this.showMessage('Manual expiration check completed successfully', 'success');
        this.loadExpirationStats(); // Refresh stats
        this.loadUpcomingExpirations(); // Refresh upcoming expirations
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error running manual expiration check:', error);
        this.showMessage('Error running manual expiration check', 'error');
        this.isLoading = false;
      }
    });
  }

  getDaysUntilExpiration(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getExpirationStatusClass(days: number): string {
    if (days <= 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    return 'normal';
  }

  showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  refreshData(): void {
    this.loadExpirationStats();
    this.loadUpcomingExpirations();
  }
} 