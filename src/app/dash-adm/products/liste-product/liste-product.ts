import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../../shared/services/product.service';
import { Category, CategoryService } from '../../../shared/services/category.service';
import { Supplier, SupplierService } from '../../../shared/services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product3D } from '../../../shared/services/product.service';
import { Product3DService } from '../../../shared/services/product3d.service';

type ProductWith3D = Product & { quantity3D?: number };

@Component({
  selector: 'app-liste-product',
  templateUrl: './liste-product.html',
  styleUrls: ['./liste-product.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ListeProductComponent implements OnInit {
  products: ProductWith3D[] = [];
  filteredProducts: ProductWith3D[] = [];
  isLoading = false;
  error: string | null = null;

  // Filter/search state
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedSupplier: string = '';
  categories: Category[] = [];
  suppliers: Supplier[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private router: Router,
    private product3DService: Product3DService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.categories = []
    });
    this.supplierService.getAllSuppliers().subscribe({
      next: (sups) => this.suppliers = sups,
      error: () => this.suppliers = []
    });
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        // Pour chaque produit, on va chercher la quantité 3D
        const productPromises = data.map(async (product) => {
          const prod = product as ProductWith3D;
          try {
            const product3Ds = await this.productService.getAll3DProducts(prod._id || '').toPromise();
            prod.quantity3D = Array.isArray(product3Ds) && product3Ds.length > 0 ? product3Ds.reduce((sum, p3d) => sum + (p3d.quantity || 0), 0) : 0;
          } catch {
            prod.quantity3D = 0;
          }
          return prod;
        });
        Promise.all(productPromises).then((productsWith3D) => {
          this.products = productsWith3D;
          this.applyFilters();
          this.isLoading = false;
        });
      },
      error: (err: any) => {
        this.error = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesName = this.searchTerm.trim() === '' || product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || product.category === this.selectedCategory;
      const matchesSupplier = this.selectedSupplier === '' || product.supplier === this.selectedSupplier;
      return matchesName && matchesCategory && matchesSupplier;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }
  onCategoryChange() {
    this.applyFilters();
  }
  onSupplierChange() {
    this.applyFilters();
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

  goToReviews(productId: string | undefined) {
    if (productId) {
      this.router.navigate(['/dash-adm/reviews', productId]);
    }
  }

  // Helper method to get supplier name by ID
  getSupplierName(supplierId: string | undefined): string {
    if (!supplierId) return '';
    const supplier = this.suppliers.find(s => s._id === supplierId || s.name === supplierId);
    return supplier ? supplier.name : supplierId;
  }
}
