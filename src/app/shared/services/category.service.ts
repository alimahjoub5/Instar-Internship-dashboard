import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) { }

  // Basic CRUD Operations
  createCategory(categoryData: Category): Observable<Category> {
    return this.apiService.post('/categories', categoryData);
  }

  getAllCategories(): Observable<Category[]> {
    return this.apiService.get('/categories');
  }

  getCategoryById(id: string): Observable<Category> {
    return this.apiService.get(`/categories/${id}`);
  }

  updateCategory(id: string, categoryData: Partial<Category>): Observable<Category> {
    return this.apiService.put(`/categories/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<any> {
    return this.apiService.delete(`/categories/${id}`);
  }
} 