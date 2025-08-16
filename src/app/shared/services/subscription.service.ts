import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  // Grace period fields
  expired?: boolean;
  gracePeriodEndDate?: Date;
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
  // Additional properties for the stats component
  weeklyStats?: {
    newSubscriptions: number;
    cancelledSubscriptions: number;
    revenue: number;
  };
  monthlyStats?: {
    newSubscriptions: number;
    cancelledSubscriptions: number;
    revenue: number;
  };
  yearlyStats?: {
    newSubscriptions: number;
    cancelledSubscriptions: number;
    revenue: number;
  };
  topSuppliers?: Array<{
    _id: string;
    supplierName: string;
    totalSubscriptions: number;
    totalRevenue: number;
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
    return this.apiService.get(`/subscription-plans/${id}`);
  }

  getSubscriptionPlanByType(type: string): Observable<SubscriptionPlan> {
    return this.apiService.get(`/subscription-plans/type/${type}`);
  }

  createSubscriptionPlan(plan: SubscriptionPlan): Observable<SubscriptionPlan> {
    return this.apiService.post('/subscription-plans', plan);
  }

  updateSubscriptionPlan(id: string, plan: Partial<SubscriptionPlan>): Observable<SubscriptionPlan> {
    return this.apiService.put(`/subscription-plans/${id}`, plan);
  }

  deleteSubscriptionPlan(id: string): Observable<any> {
    return this.apiService.delete(`/subscription-plans/${id}`);
  }

  // Subscription Methods
  createSubscription(subscription: {
    supplierId: string;
    planType: string;
    paymentMethod: string;
    autoRenew?: boolean;
  }): Observable<Subscription> {
    return this.apiService.post('/subscriptions', subscription);
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.apiService.get('/subscriptions').pipe(
      map((response: any) => response.subscriptions || response)
    );
  }

  getSubscriptionById(id: string): Observable<Subscription> {
    return this.apiService.get(`/subscriptions/${id}`);
  }

  getSubscriptionsBySupplier(supplierId: string): Observable<Subscription[]> {
    return this.apiService.get(`/subscriptions/supplier/${supplierId}`).pipe(
      map((response: any) => response.subscriptions || response)
    );
  }

  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.apiService.put(`/subscriptions/${id}`, subscription);
  }

  cancelSubscription(id: string, reason?: string): Observable<Subscription> {
    return this.apiService.put(`/subscriptions/${id}/cancel`, { reason });
  }

  renewSubscription(id: string): Observable<Subscription> {
    return this.apiService.put(`/subscriptions/${id}/renew`, {});
  }

  updatePaymentStatus(id: string, paymentStatus: string): Observable<Subscription> {
    return this.apiService.put(`/subscriptions/${id}/payment-status`, { paymentStatus });
  }

  getSubscriptionStats(): Observable<SubscriptionStats> {
    return this.apiService.get('/subscriptions/stats');
  }

  // Automatic expiration methods
  manualExpirationCheck(): Observable<any> {
    return this.apiService.post('/subscriptions/expire-check', {});
  }

  getExpirationStats(): Observable<any> {
    return this.apiService.get('/subscriptions/expiration-stats');
  }

  getUpcomingExpirations(): Observable<any> {
    return this.apiService.get('/subscriptions/upcoming-expirations');
  }

  // Grace Period Methods
  checkExpiredSubscriptions(): Observable<any> {
    return this.apiService.post('/subscriptions/check-expired', {});
  }

  getGracePeriodSubscriptions(): Observable<any> {
    return this.apiService.get('/subscriptions/grace-period');
  }

  getEnhancedExpirationStats(): Observable<any> {
    return this.apiService.get('/subscriptions/enhanced-expiration-stats');
  }

  checkSupplierProductStatus(supplierId: string): Observable<any> {
    return this.apiService.get(`/subscriptions/supplier/${supplierId}/product-status`);
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

  // Grace Period Helper Methods
  isInGracePeriod(subscription: Subscription): boolean {
    return subscription.status === 'expired' && 
           subscription.expired === true && 
           subscription.gracePeriodEndDate !== undefined;
  }

  getGracePeriodDaysRemaining(subscription: Subscription): number {
    if (!this.isInGracePeriod(subscription) || !subscription.gracePeriodEndDate) {
      return 0;
    }
    const now = new Date();
    const gracePeriodEnd = new Date(subscription.gracePeriodEndDate);
    const diffTime = gracePeriodEnd.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  shouldDisableProducts(subscription: Subscription): boolean {
    return subscription.status === 'expired' && 
           subscription.expired === false && 
           !subscription.gracePeriodEndDate;
  }

  getGracePeriodStatus(subscription: Subscription): 'active' | 'grace-period' | 'expired' | 'disabled' {
    if (subscription.status === 'active') return 'active';
    if (this.isInGracePeriod(subscription)) return 'grace-period';
    if (this.shouldDisableProducts(subscription)) return 'disabled';
    return 'expired';
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