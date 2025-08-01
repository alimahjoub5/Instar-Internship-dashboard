import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Product3DService {
  private apiUrl = 'http://localhost:9002/api'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  upload3DFile(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);
    return this.http.put(`${this.apiUrl}/uploadcolorfile`, formData);
  }

  uploadColorImage(id: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('image', image);
    return this.http.put(`${this.apiUrl}/uploadcolorimage`, formData);
  }

  create3DProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/3Dproducts/upload`, formData);
  }

  create3DProductWithProgress(formData: FormData) {
    return this.http.post<HttpEvent<any>>(`${this.apiUrl}/3Dproducts/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
} 