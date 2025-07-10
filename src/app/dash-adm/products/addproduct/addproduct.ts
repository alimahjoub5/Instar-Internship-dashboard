import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule
  ],
  templateUrl: './addproduct.html',
  styleUrls: ['./addproduct.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  suppliers: any[] = [];
  isSubmitting = false;
  uploadError: string = '';
  @ViewChild('viewerContainer') viewerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Object3D | null = null;
  private animationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      supplier: ['', Validators.required],
      model3d: [null, Validators.required]
    });
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    // Remplace l’URL par celle de ton backend réel
    this.http.get<any[]>('/api/suppliers').subscribe({
      next: (data) => this.suppliers = data,
      error: () => this.suppliers = []
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    this.productForm.patchValue({ model3d: file });
    this.productForm.get('model3d')?.updateValueAndValidity();
    this.uploadError = '';
    setTimeout(() => this.init3DPreview(file), 100); // Laisse le DOM s’installer
  }

  private init3DPreview(file: File) {
    if (!this.viewerContainer) return;
    // Nettoyer l’ancien renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.viewerContainer.nativeElement.innerHTML = '';
    }
    // Créer la scène
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 2.5);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(350, 350);
    this.viewerContainer.nativeElement.appendChild(this.renderer.domElement);

    // Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    this.scene.add(light);

    // Charger le modèle
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onerror = (e) => {
      this.uploadError = 'Erreur de lecture du fichier.';
      console.error('Erreur FileReader', e);
    };
    reader.onload = (e: any) => {
      try {
        if (ext === 'obj') {
          const loader = new OBJLoader();
          const text = new TextDecoder().decode(e.target.result);
          const obj = loader.parse(text);
          this.displayModel(obj);
        } else if (ext === 'stl') {
          const loader = new STLLoader();
          const geometry = loader.parse(e.target.result);
          const material = new THREE.MeshPhongMaterial({ color: 0x9b59b6 });
          const mesh = new THREE.Mesh(geometry, material);
          this.displayModel(mesh);
        } else {
          this.uploadError = 'Format non supporté. Seuls OBJ et STL sont acceptés.';
        }
      } catch (err) {
        this.uploadError = 'Erreur lors du chargement du modèle.';
        console.error('Erreur parsing modèle', err);
      }
    };
    if (ext === 'obj' || ext === 'stl') {
      reader.readAsArrayBuffer(file);
    } else {
      this.uploadError = 'Format non supporté. Seuls OBJ et STL sont acceptés.';
    }
  }

  private displayModel(object: THREE.Object3D) {
    if (!object) {
      this.uploadError = 'Modèle vide ou non reconnu.';
      return;
    }
    // Appliquer la couleur mauve à tous les Mesh
    object.traverse?.((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({ color: 0x9b59b6 });
      }
    });
    // Centrer et ajuster l’échelle
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.5 / (maxDim || 1);
    object.scale.set(scale, scale, scale);
    const center = box.getCenter(new THREE.Vector3());
    object.position.set(-center.x, -center.y, -center.z);
    this.scene.add(object);
    this.model = object;
    this.animate();
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.model) this.model.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) return;
    this.isSubmitting = true;
    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      if (key !== 'model3d') formData.append(key, value as any);
    });
    formData.append('model3d', this.selectedFile);

    // Remplace l’URL par celle de ton backend réel
    this.http.post('/api/products', formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.productForm.reset();
        this.selectedFile = null;
        this.viewerContainer.nativeElement.innerHTML = '';
        alert('Product added!');
      },
      error: () => {
        this.isSubmitting = false;
        this.uploadError = 'Error uploading product. Try again.';
      }
    });
  }
}
