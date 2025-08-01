import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SubscriptionPlan {
  _id?: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  duration: number;
  description: string;
  features: {
    maxProducts: number;
    maxImages: number;
    analytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    advancedReporting: boolean;
    bulkOperations: boolean;
    whiteLabel: boolean;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Subscription {
  _id?: string;
  supplierId: string;
  planType: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'paypal';
  autoRenew: boolean;
  features: {
    maxProducts: number;
    maxImages: number;
    analytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    apiAccess: boolean;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  supplier?: {
    _id: string;
    name: string;
    email?: string;
    phone: string;
  };
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  pendingSubscriptions: number;
  cancelledSubscriptions: number;
  planStats: Array<{
    _id: string;
    count: number;
    totalRevenue: number;
    activeCount: number;
    expiredCount: number;
    pendingCount: number;
  }>;
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
    revenue: number;
    activeCount: number;
  }>;
  weeklyTrends: Array<{
    _id: {
      year: number;
      week: number;
    };
    count: number;
    revenue: number;
    activeCount: number;
  }>;
  supplierStats: Array<{
    _id: string;
    supplierName: string;
    supplierEmail: string;
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalRevenue: number;
    currentPlan: string;
    lastSubscriptionDate: string;
  }>;
  paymentMethodStats: Array<{
    _id: string;
    count: number;
    totalRevenue: number;
  }>;
  totalRevenue: number;
  averageRevenuePerSubscription: number;
  recentActivity: Array<{
    _id: string;
    newSubscriptions: number;
    revenue: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private apiService: ApiService) { }

  // Subscription Plan Methods
  getAllSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.apiService.get('/subscription-plans');
  }

  getSubscriptionPlanById(id: string): Observable<SubscriptionPlan> {
    return this.apiService.get(`/subscription-plan/${id}`);
  }

  getSubscriptionPlanByType(type: string): Observable<SubscriptionPlan> {
    return this.apiService.get(`/subscription-plan/type/${type}`);
  }

  createSubscriptionPlan(plan: SubscriptionPlan): Observable<SubscriptionPlan> {
    return this.apiService.post('/subscription-plan', plan);
  }

  updateSubscriptionPlan(id: string, plan: Partial<SubscriptionPlan>): Observable<SubscriptionPlan> {
    return this.apiService.put(`/subscription-plan/${id}`, plan);
  }

  deleteSubscriptionPlan(id: string): Observable<any> {
    return this.apiService.delete(`/subscription-plan/${id}`);
  }

  // Subscription Methods
  createSubscription(subscription: {
    supplierId: string;
    planType: string;
    paymentMethod: string;
    autoRenew?: boolean;
  }): Observable<Subscription> {
    return this.apiService.post('/subscription', subscription);
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.apiService.get('/subscriptions');
  }

  getSubscriptionById(id: string): Observable<Subscription> {
    return this.apiService.get(`/subscription/${id}`);
  }

  getSubscriptionsBySupplier(supplierId: string): Observable<Subscription[]> {
    return this.apiService.get(`/subscriptions/supplier/${supplierId}`);
  }

  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.apiService.put(`/subscription/${id}`, subscription);
  }

  cancelSubscription(id: string, reason?: string): Observable<Subscription> {
    return this.apiService.put(`/subscription/${id}/cancel`, { reason });
  }

  renewSubscription(id: string): Observable<Subscription> {
    return this.apiService.put(`/subscription/${id}/renew`, {});
  }

  updatePaymentStatus(id: string, paymentStatus: string): Observable<Subscription> {
    return this.apiService.put(`/subscription/${id}/payment-status`, { paymentStatus });
  }

  getSubscriptionStats(): Observable<SubscriptionStats> {
    return this.apiService.get('/subscription/stats');
  }

  // Helper Methods
  isSubscriptionActive(subscription: Subscription): boolean {
    if (subscription.status !== 'active') return false;
    const now = new Date();
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    return now >= startDate && now <= endDate;
  }

  isSubscriptionExpired(subscription: Subscription): boolean {
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return now > endDate;
  }

  getDaysRemaining(subscription: Subscription): number {
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSubscriptionStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'expired':
        return 'status-expired';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  getPaymentStatusClass(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'failed':
        return 'payment-failed';
      case 'refunded':
        return 'payment-refunded';
      default:
        return 'payment-default';
    }
  }
} 