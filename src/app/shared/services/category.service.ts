import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Category {
  _id?: string;
  title: string;
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
    console.log(`Fetching category with ID: ${id}`);
    console.log(`Full URL: ${environment.apiUrl}/categories/${id}`);
    return this.apiService.get<Category>(`/categories/${id}`).pipe(
      tap((response: Category) => console.log('Category response:', response)),
      catchError((error: any) => {
        console.error('Category fetch error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        return throwError(() => error);
      })
    );
  }

  updateCategory(id: string, categoryData: Partial<Category>): Observable<Category> {
    return this.apiService.put(`/categories/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<any> {
    return this.apiService.delete(`/categories/${id}`);
  }
}