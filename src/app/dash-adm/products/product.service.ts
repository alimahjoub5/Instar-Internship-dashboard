import { Injectable } from '@angular/core';
import { Product, Product3D } from './product.model';
import { Observable, of } from 'rxjs';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [
    { 
      _id: generateId(), 
      name: 'Laptop Gaming', 
      reference: 'LAP-001',
      description: 'High performance gaming laptop with latest graphics', 
      price: 1200, 
      category: 'Electronics',
      dimensions: { height: 2.5, width: 35, length: 25 },
      subCategory: 'Computers',
      image: 'assets/images/laptop.jpg',
      supplier: 'TechCorp',
      materials: 'Aluminum, Plastic',
      promotion: false,
      sales: 0,
      rate: 0
    },
    { 
      _id: generateId(), 
      name: 'Smartphone Pro', 
      reference: 'PHN-001',
      description: 'Latest smartphone with advanced camera system', 
      price: 800, 
      category: 'Electronics',
      dimensions: { height: 15, width: 7.5, length: 0.8 },
      subCategory: 'Mobile Phones',
      image: 'assets/images/phone.jpg',
      supplier: 'MobileTech',
      materials: 'Glass, Metal',
      promotion: true,
      sales: 0,
      rate: 0
    }
  ];

  private products3D: Product3D[] = [];

  // Regular Products
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p._id === id));
  }

  addProduct(product: Product): Observable<void> {
    product._id = generateId();
    product.createdAt = new Date();
    product.updatedAt = new Date();
    this.products.push(product);
    return of();
  }

  updateProduct(id: string, product: Product): Observable<void> {
    const idx = this.products.findIndex(p => p._id === id);
    if (idx > -1) {
      this.products[idx] = { ...product, _id: id, updatedAt: new Date() };
    }
    return of();
  }

  deleteProduct(id: string): Observable<void> {
    this.products = this.products.filter(p => p._id !== id);
    return of();
  }

  // 3D Products
  getProducts3D(): Observable<Product3D[]> {
    return of(this.products3D);
  }

  getProduct3DById(id: string): Observable<Product3D | undefined> {
    return of(this.products3D.find(p => p._id === id));
  }

  addProduct3D(product3D: Product3D): Observable<void> {
    product3D._id = generateId();
    this.products3D.push(product3D);
    return of();
  }

  updateProduct3D(id: string, product3D: Product3D): Observable<void> {
    const idx = this.products3D.findIndex(p => p._id === id);
    if (idx > -1) {
      this.products3D[idx] = { ...product3D, _id: id };
    }
    return of();
  }

  deleteProduct3D(id: string): Observable<void> {
    this.products3D = this.products3D.filter(p => p._id !== id);
    return of();
  }

  // Get 3D products by product ID
  getProducts3DByProductId(prodId: string): Observable<Product3D[]> {
    return of(this.products3D.filter(p => p.prodId === prodId));
  }
} 