import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SubCategory {
  _id?: string;
  name: string;
  description?: string;
  category: string; // Reference to parent category
  image?: string;
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
    return this.apiService.post('/subcategories', subCategoryData);
  }

  getAllSubCategories(): Observable<SubCategory[]> {
    return this.apiService.get('/subcategories');
  }

  getSubCategoryById(id: string): Observable<SubCategory> {
    return this.apiService.get(`/subcategories/${id}`);
  }

  updateSubCategory(id: string, subCategoryData: Partial<SubCategory>): Observable<SubCategory> {
    return this.apiService.put(`/subcategories/${id}`, subCategoryData);
  }

  deleteSubCategory(id: string): Observable<any> {
    return this.apiService.delete(`/subcategories/${id}`);
  }

  // Get subcategories by category
  getSubCategoriesByCategory(categoryId: string): Observable<SubCategory[]> {
    return this.apiService.get(`/subcategories/category/${categoryId}`);
  }
} 