import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  images?: string[];
  stock: number;
  sales?: number;
  rating?: number;
  rate?: number;
  reviews?: any[];
  specifications?: any;
  reference?: string;
  supplier?: string;
  promotion?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product3D {
  _id?: string;
  prodId: string;
  modelUrl: string;
  textureUrl?: string;
  scale?: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) { }

  // Basic CRUD Operations
  createProduct(productData: Product): Observable<Product> {
    return this.apiService.post('/products', productData);
  }

  getAllProducts(): Observable<Product[]> {
    return this.apiService.get('/products');
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get(`/products/${id}`);
  }

  updateProduct(id: string, productData: Partial<Product>): Observable<Product> {
    return this.apiService.put(`/products/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.apiService.delete(`/products/${id}`);
  }

  // Advanced Product Features
  getSortedProducts(): Observable<Product[]> {
    return this.apiService.get('/products/sorted');
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.apiService.get(`/products/category/${category}`);
  }

  getProductsByCategoryAndSubcategory(category: string, subCategory: string): Observable<Product[]> {
    return this.apiService.get(`/products/${category}/${subCategory}`);
  }

  // 3D Product Operations
  create3DProduct(product3DData: Product3D): Observable<Product3D> {
    return this.apiService.post('/products/3d', product3DData);
  }

  get3DProductById(id: string): Observable<Product3D> {
    return this.apiService.get(`/products/3d/${id}`);
  }

  getAll3DProducts(productId: string): Observable<Product3D[]> {
    return this.apiService.get(`/products/3d/all/${productId}`);
  }

  // Search and Filter Methods
  searchProducts(query: string): Observable<Product[]> {
    return this.apiService.get('/products', { search: query });
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    return this.apiService.get('/products', { minPrice, maxPrice });
  }

  getProductsByStock(stock: number): Observable<Product[]> {
    return this.apiService.get('/products', { stock });
  }

  // Utility Methods
  getCategories(): Observable<string[]> {
    return this.apiService.get('/products/categories');
  }

  getSubCategories(category: string): Observable<string[]> {
    return this.apiService.get(`/products/subcategories/${category}`);
  }

  // Product Statistics
  getProductStats(): Observable<any> {
    return this.apiService.get('/products/stats');
  }

  getTopSellingProducts(limit: number = 10): Observable<Product[]> {
    return this.apiService.get('/products/top-selling', { limit });
  }

  getLowStockProducts(threshold: number = 10): Observable<Product[]> {
    return this.apiService.get('/products/low-stock', { threshold });
  }
} 