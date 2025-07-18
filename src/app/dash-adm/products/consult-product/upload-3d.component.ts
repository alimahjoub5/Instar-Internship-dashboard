import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product3DService } from '../../../shared/services/product3d.service';

@Component({
  selector: 'app-upload-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-3d.component.html',
  providers: [Product3DService]
})
export class Upload3DComponent {
  @Input() product3DId!: string;
  uploadResult: string = '';

  private product3DService = inject(Product3DService);

  on3DFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.product3DId) {
      this.product3DService.upload3DFile(this.product3DId, file).subscribe({
        next: (res: any) => this.uploadResult = 'Fichier 3D uploadé !',
        error: () => this.uploadResult = 'Erreur upload fichier 3D'
      });
    }
  }

  onColorImageSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.product3DId) {
      this.product3DService.uploadColorImage(this.product3DId, file).subscribe({
        next: (res: any) => this.uploadResult = 'Image couleur uploadée !',
        error: () => this.uploadResult = 'Erreur upload image couleur'
      });
    }
  }
} 