import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  message: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, folderName: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<UploadResponse>(`${this.apiUrl}/uploads/${folderName}`, formData);
  }

  uploadLogo(file: File): Observable<UploadResponse> {
    return this.uploadFile(file, 'logos');
  }
}