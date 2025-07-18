import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-liste-product',
  templateUrl: './liste-product.html',
  styleUrls: ['./liste-product.css'],
  imports: [CommonModule, RouterModule]
})
export class ListeProductComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.fetchProducts(),
        error: () => alert('Failed to delete product.')
      });
    }
  }

  viewProduct(id: string | undefined) {
    if (id) {
      this.router.navigate(['/dash-adm/products/consult-product', id]);
    }
  }

  editProduct(id: string | undefined) {
    if (id) {
      this.router.navigate(['/dash-adm/products/edit-product', id]);
    }
  }

  addProduct() {
    this.router.navigate(['/dash-adm/products/add-product']);
  }
}
