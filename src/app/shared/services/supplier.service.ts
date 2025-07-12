import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
  description?: string;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private apiService: ApiService) { }

  // Basic CRUD Operations
  createSupplier(supplierData: Supplier): Observable<Supplier> {
    return this.apiService.post('/suppliers', supplierData);
  }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.apiService.get('/suppliers');
  }

  getSupplierById(id: string): Observable<Supplier> {
    return this.apiService.get(`/suppliers/${id}`);
  }

  updateSupplier(id: string, supplierData: Partial<Supplier>): Observable<Supplier> {
    return this.apiService.put(`/suppliers/${id}`, supplierData);
  }

  deleteSupplier(id: string): Observable<any> {
    return this.apiService.delete(`/suppliers/${id}`);
  }

  // Get active suppliers only
  getActiveSuppliers(): Observable<Supplier[]> {
    return this.apiService.get('/suppliers', { status: 'active' });
  }
} 