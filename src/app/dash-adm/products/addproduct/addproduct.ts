import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
export class AddProductComponent implements OnInit, AfterViewInit, OnDestroy {
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
  private controls!: OrbitControls;
  private model: THREE.Object3D | null = null;
  private animationId: number | null = null;
  isRotating: boolean = true;
  showOriginalForm: boolean = false;
  loading: boolean = false;
  isModelLoaded: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  showProductForm: boolean = false;
  fileInfo: any = null;
  modelStats: any = {
    vertices: 0,
    faces: 0,
    boundingBox: {
      width: 0,
      height: 0,
      depth: 0
    }
  };
  wireframeMode: boolean = false;
  cameraInfo: any = {
    zoom: 1,
    rotation: 0
  };
  lightIntensity: number = 1;
  modelScale: number = 1;
  rotationSpeed: number = 0.01;
  cameraSensitivity: number = 1;
  zoomSpeed: number = 1;
  threeJsAvailable: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required], // Code produit unique
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      supplier: ['', Validators.required],
      weight: [0, [Validators.min(0)]], // Poids en kg
      dimensions: this.fb.group({
        length: [0, [Validators.min(0)]], // Longueur en cm
        width: [0, [Validators.min(0)]],  // Largeur en cm
        height: [0, [Validators.min(0)]]  // Hauteur en cm
      }),
      color: [''], // Couleur du produit
      isActive: [true], // Statut de disponibilité
      tags: [''], // Tags/mots-clés
      model3d: [null, Validators.required]
    });
    this.fetchSuppliers();
    
    // Initialiser le visualiseur 3D après un court délai
    setTimeout(() => {
      this.init3DPreview(null);
    }, 100);
  }

  ngAfterViewInit() {
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      if (this.renderer && this.camera && this.viewerContainer) {
        const container = this.viewerContainer.nativeElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Mettre à jour les contrôles
        if (this.controls) {
          this.controls.update();
        }
      }
    });
  }

  ngOnDestroy() {
    // Nettoyer les ressources Three.js
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.scene) {
      this.scene.clear();
    }
  }

  fetchSuppliers() {
    // Remplace l'URL par celle de ton backend réel
    this.http.get<any[]>('/api/suppliers').subscribe({
      next: (data) => this.suppliers = data,
      error: () => this.suppliers = []
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.handleFileSelection(file);
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  private handleFileSelection(file: File) {
    this.selectedFile = file;
    this.fileInfo = file;
    this.productForm.patchValue({ model3d: file });
    this.productForm.get('model3d')?.updateValueAndValidity();
    this.uploadError = '';
    this.loading = true;
    setTimeout(() => this.init3DPreview(file), 100);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  goToDashboard() {
    // Navigation logic here
    console.log('Returning to dashboard');
  }

  uploadFile() {
    if (!this.selectedFile) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 15;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        this.isUploading = false;
        this.showProductForm = true;
      }
    }, 200);
  }

  private init3DPreview(file: File | null) {
    if (!this.viewerContainer) {
      console.warn('Viewer container not found');
      return;
    }
    
    // Nettoyer l'ancien renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.viewerContainer.nativeElement.innerHTML = '';
    }
    
    // Créer la scène
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    // Créer la caméra avec le bon aspect ratio
    const container = this.viewerContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    
    // Créer le renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Ajouter le canvas au conteneur
    container.appendChild(this.renderer.domElement);
    
    // Créer les contrôles de caméra
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = true;
    
    // Ajouter les lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, this.lightIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Ajouter une lumière d'appoint
    const pointLight = new THREE.PointLight(0x667eea, 0.5, 10);
    pointLight.position.set(-5, 5, 5);
    this.scene.add(pointLight);
    
    // Créer un cube de test si aucun fichier n'est chargé
    if (!file) {
      this.createTestCube();
      return;
    }
    
    // Charger le modèle
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    
    reader.onerror = (e) => {
      this.uploadError = 'Erreur de lecture du fichier.';
      console.error('Erreur FileReader', e);
      this.loading = false;
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
          this.loading = false;
        }
      } catch (err) {
        this.uploadError = 'Erreur lors du chargement du modèle.';
        console.error('Erreur parsing modèle', err);
        this.loading = false;
      }
    };
    
    if (ext === 'obj' || ext === 'stl') {
      reader.readAsArrayBuffer(file);
    } else {
      this.uploadError = 'Format non supporté. Seuls OBJ et STL sont acceptés.';
      this.loading = false;
    }
  }

  private createTestCube() {
    // Créer un cube de test pour démontrer le visualiseur
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x9b59b6,
      transparent: true,
      opacity: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    // Positionner le cube au centre
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
    
    this.scene.add(cube);
    this.model = cube;
    
    // Calculer les statistiques du cube
    this.modelStats = {
      vertices: 24,
      faces: 12,
      boundingBox: {
        width: 2,
        height: 2,
        depth: 2
      }
    };
    
    this.isModelLoaded = true;
    this.loading = false;
    this.animate();
  }

  private displayModel(object: THREE.Object3D) {
    if (!object) {
      this.uploadError = 'Modèle vide ou non reconnu.';
      this.loading = false;
      return;
    }
    
    // Nettoyer l'ancien modèle
    if (this.model) {
      this.scene.remove(this.model);
    }
    
    // Appliquer la couleur mauve à tous les Mesh
    object.traverse?.((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({ 
          color: 0x9b59b6,
          transparent: true,
          opacity: 0.8
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Centrer et ajuster l'échelle
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / (maxDim || 1); // Même échelle que le cube de test
    
    // Appliquer l'échelle
    object.scale.set(scale, scale, scale);
    
    // Recalculer la boîte englobante après l'échelle
    const scaledBox = new THREE.Box3().setFromObject(object);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    
    // Centrer le modèle à l'origine (0,0,0)
    object.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);
    
    // Réinitialiser la rotation
    object.rotation.set(0, 0, 0);
    
    this.scene.add(object);
    this.model = object;
    
    // Calculate model statistics
    this.calculateModelStats(object);
    
    // Réinitialiser la caméra et les contrôles
    this.resetView();
    
    this.isModelLoaded = true;
    this.loading = false;
    this.animate();
  }

  private calculateModelStats(object: THREE.Object3D) {
    let vertices = 0;
    let faces = 0;
    
    object.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        if (child.geometry.attributes.position) {
          vertices += child.geometry.attributes.position.count;
        }
        if (child.geometry.index) {
          faces += child.geometry.index.count / 3;
        } else if (child.geometry.attributes.position) {
          faces += child.geometry.attributes.position.count / 3;
        }
      }
    });
    
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    this.modelStats = {
      vertices: vertices,
      faces: faces,
      boundingBox: {
        width: size.x,
        height: size.y,
        depth: size.z
      }
    };
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Mettre à jour les contrôles
    if (this.controls) {
      this.controls.update();
    }
    
    // Rotation automatique du modèle (si activée)
    if (this.model && this.isRotating) {
      this.model.rotation.y += this.rotationSpeed;
    }
    
    // Mettre à jour les informations de caméra
    if (this.camera) {
      this.cameraInfo.zoom = this.camera.zoom;
      this.cameraInfo.rotation = (this.camera.rotation.y * 180 / Math.PI) % 360;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  toggleRotation() {
    this.isRotating = !this.isRotating;
  }

  resetView() {
    if (this.controls) {
      this.controls.reset();
    }
    if (this.camera) {
      this.camera.position.set(0, 0, 5);
      this.camera.lookAt(0, 0, 0);
    }
    // Ne pas réinitialiser la position du modèle car elle est calculée automatiquement
  }

  toggleWireframe() {
    this.wireframeMode = !this.wireframeMode;
    if (this.model) {
      this.model.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              mat.wireframe = this.wireframeMode;
            });
          } else {
            child.material.wireframe = this.wireframeMode;
          }
        }
      });
    }
  }

  adjustLight(event: any) {
    this.lightIntensity = parseFloat(event.target.value);
    if (this.scene) {
      this.scene.traverse((child: any) => {
        if (child.isLight) {
          child.intensity = this.lightIntensity;
        }
      });
    }
  }

  adjustScale(event: any) {
    this.modelScale = parseFloat(event.target.value);
    if (this.model) {
      this.model.scale.set(this.modelScale, this.modelScale, this.modelScale);
    }
  }

  adjustRotationSpeed(event: any) {
    this.rotationSpeed = parseFloat(event.target.value);
  }

  adjustCameraSensitivity(event: any) {
    this.cameraSensitivity = parseFloat(event.target.value);
    if (this.controls) {
      this.controls.rotateSpeed = this.cameraSensitivity;
      this.controls.panSpeed = this.cameraSensitivity;
    }
  }

  adjustZoomSpeed(event: any) {
    this.zoomSpeed = parseFloat(event.target.value);
    if (this.controls) {
      this.controls.zoomSpeed = this.zoomSpeed;
    }
  }

  toggleFullscreen() {
    const container = this.viewerContainer.nativeElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        // Redimensionner le renderer en plein écran
        if (this.renderer && this.camera) {
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
        }
      });
    } else {
      document.exitFullscreen().then(() => {
        // Restaurer la taille normale
        if (this.renderer && this.camera && this.viewerContainer) {
          const container = this.viewerContainer.nativeElement;
          const width = container.clientWidth;
          const height = container.clientHeight;
          this.renderer.setSize(width, height);
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
        }
      });
    }
  }

  resetForm() {
    this.productForm.reset();
    this.selectedFile = null;
    this.fileInfo = null;
    this.isModelLoaded = false;
    this.showProductForm = false;
    this.uploadError = '';
    
    // Réinitialiser le visualiseur
    if (this.viewerContainer) {
      this.viewerContainer.nativeElement.innerHTML = '';
    }
    this.init3DPreview(null);
  }

  changeMaterial() {
    if (this.model) {
      const colors = [0x9b59b6, 0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      this.model.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({ color: randomColor });
        }
      });
    }
  }

  toggleOriginalForm() {
    this.showOriginalForm = !this.showOriginalForm;
  }

  onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) return;
    this.isSubmitting = true;
    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      if (key !== 'model3d') formData.append(key, value as any);
    });
    formData.append('model3d', this.selectedFile);

    // Remplace l'URL par celle de ton backend réel
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
