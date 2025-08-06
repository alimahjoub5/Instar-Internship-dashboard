import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../shared/services/product.service';
import { ProductCard } from './product-card/product-card';
import { Sidebar } from '../sidebar/sidebar';
import { SidebarProducts } from './sidebar/sidebar';
import { ProductModal } from './product-modal/product-modal';
import { FnFooter } from '../fn-footer/fn-footer';
import { ProductsCarousel } from './products-carousel/products-carousel';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard,
    Sidebar,
    ProductModal,
    FnFooter,
    ProductsCarousel,
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
export class Products {
  products: any[] = [];

  sortParam: string = 'price-asc';

  selectedProduct: Product | null = null;

  // Pagination properties
  pageSize = 8;
  currentPage = 1;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('Component initialized');
    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.products = products;
      console.log('Products fetched:', this.products);
    });
  }
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.products.length / this.pageSize);
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
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.products.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }
}
