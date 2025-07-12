import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Promotion {
  _id?: string;
  product: string; // Product ID
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  constructor(private apiService: ApiService) { }

  // Basic CRUD Operations
  createPromotion(promotionData: Promotion): Observable<Promotion> {
    return this.apiService.post('/promotions', promotionData);
  }

  getAllPromotions(): Observable<Promotion[]> {
    return this.apiService.get('/promotions');
  }

  getPromotionById(id: string): Observable<Promotion> {
    return this.apiService.get(`/promotions/${id}`);
  }

  updatePromotion(id: string, promotionData: Partial<Promotion>): Observable<Promotion> {
    return this.apiService.put(`/promotions/${id}`, promotionData);
  }

  deletePromotion(id: string): Observable<any> {
    return this.apiService.delete(`/promotions/${id}`);
  }

  // Get active promotions
  getActivePromotions(): Observable<Promotion[]> {
    return this.apiService.get('/promotions', { isActive: true });
  }

  // Get promotions for a specific product
  getPromotionsForProduct(productId: string): Observable<Promotion[]> {
    return this.apiService.get(`/promotions/product/${productId}`);
  }

  // Get current promotions (between start and end date)
  getCurrentPromotions(): Observable<Promotion[]> {
    const now = new Date().toISOString();
    return this.apiService.get('/promotions', { 
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
  }
} 