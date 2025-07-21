import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class ThreeViewerComponent implements OnInit, OnDestroy {
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
    this.initThree();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }

  private initThree() {
    const width = this.rendererContainer.nativeElement.clientWidth || 600;
    const height = 220;

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
    if (this.modelUrl) {
      const loader = new GLTFLoader();
      loader.load(this.modelUrl, (gltf: { scene: THREE.Object3D<THREE.Object3DEventMap>; }) => {
        this.scene.add(gltf.scene);
        this.isLoading = false;
      }, undefined, (error: any) => {
        console.error('Erreur chargement modèle 3D:', error);
        this.isLoading = false;
      });
    }
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