import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Rating {
  _id?: string;
  user: string; // User ID
  product: string; // Product ID
  rating: number; // 1-5 stars
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RatingStats {
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
  simpleReviews: Rating[];
  number: number;
  avg: number;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private apiService: ApiService) { }

  // Basic CRUD Operations
  createRating(ratingData: Rating): Observable<any> {
    return this.apiService.post('/ratings', ratingData);
  }

  getAllRatingsForProduct(productId: string): Observable<RatingStats> {
    return this.apiService.get(`/ratings/${productId}`);
  }

  getRatingById(id: string): Observable<Rating> {
    return this.apiService.get(`/ratings/review/${id}`);
  }

  updateRating(id: string, ratingData: Partial<Rating>): Observable<Rating> {
    return this.apiService.put(`/ratings/${id}`, ratingData);
  }

  deleteRating(id: string): Observable<any> {
    return this.apiService.delete(`/ratings/${id}`);
  }

  // Get average rating for a product
  getAverageRating(productId: string): Observable<string> {
    return this.apiService.get(`/ratings/average/${productId}`);
  }

  // Get user's rating for a specific product
  getUserRatingForProduct(userId: string, productId: string): Observable<Rating> {
    return this.apiService.get(`/ratings/user/${userId}/product/${productId}`);
  }
} 