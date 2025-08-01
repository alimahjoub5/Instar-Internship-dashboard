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
    const file = event.target.files[0];
    if (file) {
      // Vérifier l'extension du fichier
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.glb', '.gltf'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        this.uploadResult = 'Erreur: Seuls les fichiers GLTF (.gltf) et GLB (.glb) sont acceptés.';
        event.target.value = ''; // Réinitialiser l'input
        this.image3D = null;
        return;
      }
      
      // Vérifier la taille du fichier (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        this.uploadResult = 'Erreur: Le fichier est trop volumineux. Taille maximum: 50MB.';
        event.target.value = '';
        this.image3D = null;
        return;
      }
      
      this.image3D = file;
      this.uploadResult = ''; // Effacer les messages d'erreur précédents
      console.log('✅ Fichier 3D sélectionné:', file.name, 'Taille:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    } else {
      this.image3D = null;
    }
  }

  onColorImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        this.uploadResult = 'Erreur: Veuillez sélectionner un fichier image valide.';
        event.target.value = '';
        this.imageCouleurs = null;
        return;
      }
      
      // Vérifier la taille du fichier (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.uploadResult = 'Erreur: L\'image est trop volumineuse. Taille maximum: 10MB.';
        event.target.value = '';
        this.imageCouleurs = null;
        return;
      }
      
      this.imageCouleurs = file;
      this.uploadResult = ''; // Effacer les messages d'erreur précédents
      console.log('✅ Image couleur sélectionnée:', file.name, 'Taille:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    } else {
      this.imageCouleurs = null;
    }
  }

  onSubmit() {
    if (!this.product3DId || !this.image3D || !this.imageCouleurs || !this.quantity) {
      this.uploadResult = 'Veuillez remplir tous les champs.';
      return;
    }
    
    console.log('🚀 Début upload 3D...');
    console.log('📋 Product3D ID:', this.product3DId);
    console.log('📁 Image 3D:', this.image3D);
    console.log('🎨 Image Couleurs:', this.imageCouleurs);
    console.log('📊 Quantity:', this.quantity);
    
    this.isSubmitting = true;
    this.uploadProgress = 0;
    
    // Prépare le formData pour create3DProduct
    const formData = new FormData();
    formData.append('prodId', this.product3DId);
    formData.append('image3D', this.image3D);
    formData.append('imageCouleurs', this.imageCouleurs);
    formData.append('quantity', this.quantity.toString());
    
    console.log('📦 FormData créé:', formData);
    this.product3DService.create3DProductWithProgress(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        console.log('📡 Événement HTTP:', event);
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
          console.log('📊 Progression:', this.uploadProgress + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log('✅ Upload réussi:', event.body);
          this.uploadResult = 'Upload avec succès !';
          this.isSubmitting = false;
          this.uploadProgress = 0;
          this.close.emit();
        }
      },
      error: (error) => {
        console.error('❌ Erreur upload:', error);
        console.error('📋 Détails erreur:', error.error);
        this.uploadResult = 'Erreur lors de l\'upload: ' + (error.error?.error || error.message || 'Erreur inconnue');
        this.isSubmitting = false;
        this.uploadProgress = 0;
      }
    });
  }
} 