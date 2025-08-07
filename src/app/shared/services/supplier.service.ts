import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Supplier {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  marque: string;
  rib: string;
  image?: string | null;
  email?: string | null;
  password: string;
  webSite?: string | null;
  userId?: string | null;
  hasActiveSubscription?: boolean; // Added for subscription management
  hasCancelledSubscription?: boolean; // Added for subscription management
  // contactPerson?: string; // Not in backend
  // website?: string; // Use webSite instead
  // description?: string; // Not in backend
  // status?: 'active' | 'inactive'; // Not in backend
  // createdAt?: Date; // Not in backend
  // updatedAt?: Date; // Not in backend
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

  // Update supplier image
  updateSupplierImage(id: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('image', imageFile);
    return this.apiService.put('/updatesupplierimage', formData);
  }
} 