import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../shared/services/subscription.service';

@Component({
  selector: 'app-grace-period-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grace-period-stats.component.html',
  styleUrls: ['./grace-period-stats.component.css']
})
export class GracePeriodStatsComponent implements OnInit {
  stats: any = null;
  isLoading = false;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.subscriptionService.getEnhancedExpirationStats().subscribe({
      next: (response) => {
        this.stats = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading grace period stats:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(value: number): string {
    if (value === 0) return 'status-normal';
    if (value <= 2) return 'status-warning';
    if (value <= 5) return 'status-critical';
    return 'status-danger';
  }
}
