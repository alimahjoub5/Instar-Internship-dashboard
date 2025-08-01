import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardStats {
  users: {
    total: number;
    growth: string;
    recent: any[];
  };
  products: {
    total: number;
    growth: string;
    recent: any[];
  };
  sales: {
    total: number;
    orders: number;
    growth: string;
    recent: any[];
  };
  subscriptions: {
    active: number;
  };
  suppliers: {
    total: number;
  };
  categories: {
    total: number;
    subCategories: number;
  };
  trends: any[];
}

export interface ActivityFeed {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface QuickStats {
  users: number;
  products: number;
  subscriptions: number;
  suppliers: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) { }

  // Get comprehensive dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.get('/dashboard/stats');
  }

  // Get activity feed
  getActivityFeed(): Observable<ActivityFeed[]> {
    return this.apiService.get('/dashboard/activity-feed');
  }

  // Get quick stats for sidebar
  getQuickStats(): Observable<QuickStats> {
    return this.apiService.get('/dashboard/quick-stats');
  }
} 