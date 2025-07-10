import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { Observable, of } from 'rxjs';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [
    { id: generateId(), name: 'Laptop', description: 'High performance laptop', price: 1200, quantity: 10, category: 'Electronics', imageUrl: '' },
    { id: generateId(), name: 'Phone', description: 'Latest smartphone', price: 800, quantity: 25, category: 'Electronics', imageUrl: '' }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  addProduct(product: Product): Observable<void> {
    product.id = generateId();
    this.products.push(product);
    return of();
  }

  updateProduct(id: string, product: Product): Observable<void> {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx > -1) this.products[idx] = { ...product, id };
    return of();
  }

  deleteProduct(id: string): Observable<void> {
    this.products = this.products.filter(p => p.id !== id);
    return of();
  }
} 