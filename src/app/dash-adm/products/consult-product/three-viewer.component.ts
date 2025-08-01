import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-three-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three-viewer.component.html',
  styleUrls: ['./three-viewer.component.css']
})
export class ThreeViewerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @Input() modelUrl!: string;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationId: any;
  private initialCameraPosition = new THREE.Vector3(0, 1, 3);
  isLoading = true;

  ngOnInit() {
    if (this.modelUrl) {
      this.initThree();
      this.animate();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelUrl'] && !changes['modelUrl'].firstChange) {
      // Détruire l'ancienne scène si besoin
      if (this.renderer) {
        this.renderer.dispose();
        this.rendererContainer.nativeElement.innerHTML = '';
      }
      this.initThree();
      this.animate();
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }

  private initThree() {
    const width = this.rendererContainer.nativeElement.clientWidth || 700;
    const height = 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.copy(this.initialCameraPosition);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 20;

    // Loader
    this.isLoading = true;
    // Charger le modèle 3D
    if (this.modelUrl && this.modelUrl.trim() !== '') {
      const loader = new GLTFLoader();
      
      loader.load(this.modelUrl, (gltf: { scene: THREE.Object3D<THREE.Object3DEventMap>; }) => {
        console.log('✅ Modèle 3D chargé avec succès');
        this.scene.add(gltf.scene);
        this.frameObject(gltf.scene);
        this.isLoading = false;
      }, (progress: { loaded: number; total: number }) => {
        // Progress callback - could be used to show loading progress
        console.log('📊 Progression chargement:', (progress.loaded / progress.total * 100) + '%');
      }, (error: any) => {
        console.error('❌ Erreur chargement modèle 3D:', error);
        console.error('📋 URL du modèle:', this.modelUrl);
        this.isLoading = false;
        
        // Vérifier si c'est un problème de format de fichier
        if (error.message && error.message.includes('Unexpected token')) {
          console.error('⚠️  Le fichier ne semble pas être un fichier GLTF/GLB valide');
          this.showErrorState('Format de fichier invalide. Seuls les fichiers GLTF (.gltf) et GLB (.glb) sont supportés.');
        } else {
          this.showErrorState('Erreur lors du chargement du modèle 3D.');
        }
      });
    } else {
      this.isLoading = false;
      this.showErrorState();
    }
  }

  private showErrorState(message: string = 'Le modèle 3D n\'a pas pu être chargé.') {
    // Clear the renderer container and show error message
    if (this.rendererContainer && this.rendererContainer.nativeElement) {
      this.rendererContainer.nativeElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #fff; text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
          <div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin-bottom: 16px; opacity: 0.7;">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ffffff" stroke-width="2"/>
            </svg>
            <h3 style="margin: 0 0 8px 0; font-size: 1.2rem; color: #ffffff;">Modèle 3D Indisponible</h3>
            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9; color: #ffffff;">${message}</p>
          </div>
        </div>
      `;
    }
  }

  // Centre et ajuste la caméra pour voir tout le modèle
  private frameObject(object: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5; // marge de sécurité

    this.camera.position.set(center.x, center.y, cameraZ + center.z);
    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  goFullscreen() {
    const elem = this.renderer.domElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }

  resetCamera() {
    this.camera.position.copy(this.initialCameraPosition);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }
} 