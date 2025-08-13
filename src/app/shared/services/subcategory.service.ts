import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface SubCategory {
  _id?: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  constructor(private apiService: ApiService) { }

  // Basic CRUD Operations
  createSubCategory(subCategoryData: SubCategory): Observable<SubCategory> {
    return this.apiService.post('/subcategory/add', subCategoryData);
  }

  getAllSubCategories(): Observable<SubCategory[]> {
    return this.apiService.get('/subcategory');
  }

  getSubCategoryById(id: string): Observable<SubCategory> {
    console.log(`Fetching subcategory with ID: ${id}`);
    console.log(`Full URL: ${environment.apiUrl}/subcategory/${id}`);
    return this.apiService.get<SubCategory>(`/subcategory/${id}`).pipe(
      tap((response: SubCategory) => console.log('Subcategory response:', response)),
      catchError((error: any) => {
        console.error('Subcategory fetch error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        return throwError(() => error);
      })
    );
  }

  updateSubCategory(id: string, subCategoryData: Partial<SubCategory>): Observable<SubCategory> {
    return this.apiService.put(`/subcategory/${id}`, subCategoryData);
  }

  deleteSubCategory(id: string): Observable<any> {
    return this.apiService.delete(`/subcategory/${id}`);
  }

  // Get subcategories by category
  getSubCategoriesByCategory(categoryId: string): Observable<SubCategory[]> {
    return this.apiService.get(`/subcategory/category/${categoryId}`);
  }
}