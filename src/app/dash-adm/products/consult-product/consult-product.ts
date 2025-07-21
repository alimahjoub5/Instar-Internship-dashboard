import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Upload3DComponent } from './upload-3d.component';
import { ThreeViewerComponent } from './three-viewer.component';
import { Product, ProductService } from '../../../shared/services/product.service';
import { Supplier, SupplierService } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-consult-product',
  imports: [
    CommonModule,
    Upload3DComponent,
    ThreeViewerComponent,
    RouterModule
  ],
  templateUrl: './consult-product.html',
  styleUrl: './consult-product.css'
})
export class ConsultProductComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;
  error: string | null = null;
  product3DId: string = '';
  model3DUrl: string = '';
  suppliers: Supplier[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.supplierService.getAllSuppliers().subscribe({
      next: (sups) => this.suppliers = sups,
      error: () => this.suppliers = []
    });
    if (id) {
      this.isLoading = true;
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.product3DId = product._id || '';
          this.model3DUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No product ID provided.';
    }
  }

  getSupplierName(supplierId: string | undefined): string {
    if (!supplierId) return '';
    const supplier = this.suppliers.find(s => s._id === supplierId || s.name === supplierId);
    return supplier ? supplier.name : supplierId;
  }

  goBack() {
    // For now, just log. In a real app, use router navigation.
    console.log('Back to list');
  }
}
