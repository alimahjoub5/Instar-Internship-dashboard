import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Review {
  _id?: string;
  user: string;
  product: string;
  comment: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private apiService: ApiService) {}

  addReview(productId: string, review: Partial<Review>): Observable<Review> {
    return this.apiService.post(`/products/${productId}/reviews`, review);
  }

  getReviews(productId: string): Observable<Review[]> {
    return this.apiService.get(`/products/${productId}/reviews`);
  }

  updateReview(reviewId: string, review: Partial<Review>): Observable<Review> {
    return this.apiService.put(`/reviews/${reviewId}`, review);
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.apiService.delete(`/reviews/${reviewId}`);
  }

  updateReviewImage(reviewId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', reviewId);
    formData.append('image', file);
    return this.apiService.put('/updateReviewimage', formData);
  }
} 