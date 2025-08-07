import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardStats, ActivityFeed } from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.css']
})
export class DashboardHomeComponent implements OnInit {
  dashboardStats: DashboardStats | null = null;
  activityFeed: ActivityFeed[] = [];
  isLoading = true;
  error: string | null = null;
  selectedPeriod = 'month';
  revenueStats: any[] = [];
  topProducts: any[] = [];
  topSuppliers: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRevenueStats();
    this.loadTopProducts();
    this.loadTopSuppliers();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    // Load dashboard stats
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });

    // Load activity feed
    this.dashboardService.getActivityFeed().subscribe({
      next: (activities) => {
        this.activityFeed = activities;
      },
      error: (error) => {
        console.error('Error loading activity feed:', error);
      }
    });
  }

  loadRevenueStats(): void {
    this.dashboardService.getRevenueStats(this.selectedPeriod).subscribe({
      next: (stats) => {
        this.revenueStats = stats;
      },
      error: (error) => {
        console.error('Error loading revenue stats:', error);
      }
    });
  }

  loadTopProducts(): void {
    this.dashboardService.getTopProducts().subscribe({
      next: (products) => {
        this.topProducts = products;
      },
      error: (error) => {
        console.error('Error loading top products:', error);
      }
    });
  }

  loadTopSuppliers(): void {
    this.dashboardService.getTopSuppliers().subscribe({
      next: (suppliers) => {
        this.topSuppliers = suppliers;
      },
      error: (error) => {
        console.error('Error loading top suppliers:', error);
      }
    });
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.loadRevenueStats();
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      user: '👤',
      product: '📦',
      sale: '💰',
      review: '⭐',
      subscription: '📋'
    };
    return icons[type] || '📄';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      active: 'green',
      pending: 'orange',
      expired: 'red',
      cancelled: 'gray'
    };
    return colors[status] || 'blue';
  }

  getMaxRevenue(): number {
    if (!this.revenueStats || this.revenueStats.length === 0) {
      return 1;
    }
    return Math.max(...this.revenueStats.map(stat => stat.total));
  }

  refreshData(): void {
    this.loadDashboardData();
    this.loadRevenueStats();
    this.loadTopProducts();
    this.loadTopSuppliers();
  }
} 