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
  sales?: number;
  rate?: number;
  reviews?: any[];
  specifications?: any;
  reference?: string;
  supplier?: string;
  promotion?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
  dimensions?: {
    height?: number;
    width?: number;
    length?: number;
    radius?: number;
  };
}

export interface Product3D {
  _id?: string;
  prodId: string;
  image3D: string;
  imageCouleurs: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) { }

  // Product CRUD
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

  getSortedProducts(): Observable<Product[]> {
    return this.apiService.get('/products/sorted');
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.apiService.get(`/products/category/${category}`);
  }

  getProductsByCategoryAndSubcategory(category: string, subCategory: string): Observable<Product[]> {
    return this.apiService.get(`/products/category/${category}/subcategory/${subCategory}`);
  }

  // 3D Product CRUD
  create3DProduct(product3DData: Product3D): Observable<Product3D> {
    return this.apiService.post('/3Dproducts', product3DData);
  }

  get3DProductById(id: string): Observable<Product3D> {
    return this.apiService.get(`/3Dproducts/${id}`);
  }

  getAll3DProducts(productId: string): Observable<Product3D[]> {
    return this.apiService.get(`/3Dproducts/all/${productId}`);
  }

  // Upload product image
  uploadProductImage(productId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', productId);
    formData.append('image', file);
    return this.apiService.put('/uploadproductsimage', formData);
  }

  // Upload 3D color image
  upload3DColorImage(product3DId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', product3DId);
    formData.append('image', file);
    return this.apiService.put('/uploadcolorimage', formData);
  }

  // Upload 3D file
  upload3DFile(product3DId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', product3DId);
    formData.append('file', file);
    return this.apiService.put('/uploadcolorfile', formData);
  }
} 