import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product3DService } from '../../../shared/services/product3d.service';
import { FormsModule } from '@angular/forms';

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
    // Log the data being sent
    console.log('Données envoyées au backend :', {
      prodId: this.product3DId,
      image3D: this.image3D,
      imageCouleurs: this.imageCouleurs,
      quantity: this.quantity
    });
    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('prodId', this.product3DId);
    formData.append('image3D', this.image3D);
    formData.append('imageCouleurs', this.imageCouleurs);
    formData.append('quantity', this.quantity.toString());
    this.product3DService.create3DProduct(formData).subscribe({
      next: () => {
        this.uploadResult = 'Modèle 3D ajouté avec succès !';
        this.isSubmitting = false;
      },
      error: () => {
        this.uploadResult = 'Erreur lors de l\'ajout du modèle 3D.';
        this.isSubmitting = false;
      }
    });
  }
} 