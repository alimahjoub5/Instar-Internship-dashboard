import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product3DService } from '../../../shared/services/product3d.service';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-3d',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-3d.component.html',
  styleUrls: ['./upload-3d.component.css'],
  providers: [Product3DService]
})
export class Upload3DComponent {
  @Input() product3DId!: string;
  uploadResult: string = '';
  isSubmitting = false;
  quantity: number = 1;
  image3D: File | null = null;
  imageCouleurs: File | null = null;
  uploadProgress: number = 0;
  @Output() close = new EventEmitter<void>();

  private product3DService = inject(Product3DService);

  on3DFileSelected(event: any) {
    this.image3D = event.target.files[0] || null;
  }

  onColorImageSelected(event: any) {
    this.imageCouleurs = event.target.files[0] || null;
  }

  onSubmit() {
    if (!this.product3DId || !this.image3D || !this.imageCouleurs || !this.quantity) {
      this.uploadResult = 'Veuillez remplir tous les champs.';
      return;
    }
    this.isSubmitting = true;
    this.uploadProgress = 0;
    // Prépare le formData pour create3DProduct
    const formData = new FormData();
    formData.append('prodId', this.product3DId);
    formData.append('image3D', this.image3D);
    formData.append('imageCouleurs', this.imageCouleurs);
    formData.append('quantity', this.quantity.toString());
    this.product3DService.create3DProductWithProgress(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadResult = 'Upload avec succès !';
          this.isSubmitting = false;
          this.uploadProgress = 0;
          this.close.emit();
        }
      },
      error: () => {
        this.uploadResult = 'Erreur lors de l\'upload.';
        this.isSubmitting = false;
        this.uploadProgress = 0;
      }
    });
  }
} 