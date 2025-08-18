import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../shared/services/product.service';
import { ProductCard } from './product-card/product-card';
import { Sidebar } from '../sidebar/sidebar';
import { SidebarProducts } from './sidebar/sidebar';
import { ProductModal } from './product-modal/product-modal';
import { FnFooter } from '../fn-footer/fn-footer';

import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard,
    ProductModal,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
// export class Products implements OnInit {
//   products: Product[] = [];

//   constructor(private productService: ProductService) {}

//   ngOnInit() {
//     this.productService.getAllProducts().subscribe((products) => {
//       this.products = products;
//     });
//   }
export class Products implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];


  sortParam: string = 'price-asc';

  selectedProduct: Product | null = null;

  // Pagination properties
  pageSize = 8;
  currentPage = 1;

  // Filter properties
  filters = {
    priceMin: null as number | null,
    priceMax: null as number | null,
    stock: null as number | null,
    rating: null as number | null,
    promotion: false
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('Component initialized');
    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.products = products;
      this.filteredProducts = [...products]; // Initialize filtered products
      
      console.log('Products fetched:', this.products);
    });
  }
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openProductModal(product: Product) {
    this.selectedProduct = product;
  }

  closeProductModal() {
    this.selectedProduct = null;
  }

  onSortChange() {
    switch (this.sortParam) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    this.currentPage = 1; // Reset to first page after sorting
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Price range filter
      if (this.filters.priceMin !== null && product.price < this.filters.priceMin) {
        return false;
      }
      if (this.filters.priceMax !== null && product.price > this.filters.priceMax) {
        return false;
      }
      
      // Stock filter
      if (this.filters.stock !== null && product.stock < this.filters.stock) {
        return false;
      }
      
      // Rating filter
      if (this.filters.rating !== null && product.rating < this.filters.rating) {
        return false;
      }
      
      // Promotion filter
      if (this.filters.promotion && !product.promotion) {
        return false;
      }
      
      return true;
    });
    
    // Apply current sorting to filtered results
    this.onSortChange();
    
    // Reset to first page
    this.currentPage = 1;
  }

  resetFilters() {
    this.filters = {
      priceMin: null,
      priceMax: null,
      stock: null,
      rating: null,
      promotion: false
    };
    this.filteredProducts = [...this.products];
    this.onSortChange();
    this.currentPage = 1;
  }
}
