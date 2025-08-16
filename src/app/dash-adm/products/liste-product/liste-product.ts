import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../../shared/services/product.service';
import { Category, CategoryService } from '../../../shared/services/category.service';
import { Supplier, SupplierService } from '../../../shared/services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product3D } from '../../../shared/services/product.service';
import { Product3DService } from '../../../shared/services/product3d.service';
import { ApiService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';

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
    private product3DService: Product3DService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      console.error('User not authenticated. Redirecting to login...');
      this.authService.redirectToLoginIfNotAuthenticated();
      return;
    }

    this.fetchProducts();
    this.categoryService.getAllCategories().subscribe({
      next: (cats: any) => {
        if (Array.isArray(cats)) {
          this.categories = cats;
        } else if (cats && cats.data && Array.isArray(cats.data)) {
          this.categories = cats.data;
        } else if (cats && cats.categories && Array.isArray(cats.categories)) {
          this.categories = cats.categories;
        } else if (cats && cats.results && Array.isArray(cats.results)) {
          this.categories = cats.results;
        } else {
          this.categories = [];
        }
      },
      error: (err) => {
        this.categories = [];
      }
    });
    this.supplierService.getAllSuppliers().subscribe({
      next: (sups: any) => {
        this.suppliers = Array.isArray(sups) ? sups : [];
      },
      error: (err) => {
        this.suppliers = [];
      }
    });
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        // Check if data is an array, if not, set empty array
        const productsArray = Array.isArray(data) ? data : [];
        
        // Pour chaque produit, on va chercher la quantité 3D
        const productPromises = productsArray.map(async (product) => {
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
        this.products = [];
        this.filteredProducts = [];
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
    console.log('Attempting to delete product with ID:', id);
    if (!id) {
      console.log('No ID provided, returning');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('User confirmed deletion, calling API');
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          console.log('Product deleted successfully:', response);
          this.fetchProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product.');
        }
      });
    } else {
      console.log('User cancelled deletion');
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

  // Helper method to get category name by ID
  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const category = this.categories.find(c => c._id === categoryId || c.title === categoryId);
    return category ? category.title : categoryId;
  }

  // Helper method to get product ID safely
  getProductId(id: string | undefined): string {
    if (!id) return 'N/A';
    return id.slice(-8);
  }

  // Helper method to get quantity safely
  getQuantity(quantity: number | undefined): number {
    return quantity ?? 0;
  }
}
