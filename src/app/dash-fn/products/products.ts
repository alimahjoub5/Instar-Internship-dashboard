import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/services/product.service';
import { ProductCard } from './product-card/product-card';
import { Sidebar } from '../sidebar/sidebar';
import { SidebarProducts } from './sidebar/sidebar';
import { ProductModal } from './product-modal/product-modal';
import { FnFooter } from '../fn-footer/fn-footer';
import { ProductsCarousel } from './products-carousel/products-carousel';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard, Sidebar, SidebarProducts, ProductModal, FnFooter, ProductsCarousel],
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
  products: Product[] = [
    {
      name: 'Apple iPhone 15 Pro',
      description: 'The latest iPhone with A17 Bionic chip, ProMotion display, and advanced camera system.',
      price: 1199.99,
      category: 'Electronics',
      subCategory: 'Smartphones',
      images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692923778669'],
      stock: 0,
      sales: 120,
      rating: 4.8,
      reference: 'IP15P-2023',
      supplier: 'Apple',
      promotion: true
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise canceling headphones with up to 30 hours battery life.',
      price: 349.99,
      category: 'Electronics',
      subCategory: 'Headphones',
      images: ['https://m.media-amazon.com/images/I/61v5ZpFVQwL._AC_SL1500_.jpg'],
      stock: 40,
      sales: 200,
      rating: 4.7,
      reference: 'SONY-WH1000XM5',
      supplier: 'Sony',
      promotion: false
    },
    {
      name: 'Samsung Galaxy S23 Ultra',
      description: 'Flagship Android phone with 200MP camera, S Pen, and stunning display.',
      price: 1399.99,
      category: 'Electronics',
      subCategory: 'Smartphones',
      images: ['https://images.samsung.com/is/image/samsung/p6pim/levant/2302/gallery/levant-galaxy-s23-ultra-s918-sm-s918bzkgmea-thumb-534678237'],
      stock: 15,
      sales: 80,
      rating: 4.6,
      reference: 'SGS23U',
      supplier: 'Samsung',
      promotion: true
    },
    {
      name: 'Nike Air Max 270',
      description: 'Comfortable and stylish sneakers with a large Air unit for all-day cushioning.',
      price: 159.99,
      category: 'Fashion',
      subCategory: 'Shoes',
      images: ['https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/6b0b1e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-mens-shoes-KkLcGR.png'],
      stock: 60,
      sales: 300,
      rating: 4.9,
      reference: 'NIKE-AM270',
      supplier: 'Nike',
      promotion: false
    },
    {
      name: 'Canon EOS R6 Mark II',
      description: 'Professional mirrorless camera with 24MP sensor, 4K video, and fast autofocus.',
      price: 2499.99,
      category: 'Electronics',
      subCategory: 'Cameras',
      images: ['https://www.canon-europe.com/media/eos-r6-mark-ii-front_tcm13-2172732.png'],
      stock: 8,
      sales: 35,
      rating: 4.7,
      reference: 'CANON-R6M2',
      supplier: 'Canon',
      promotion: true
    },
    {
      name: 'Dell XPS 13',
      description: 'Ultra-portable laptop with InfinityEdge display and 11th Gen Intel processors.',
      price: 999.99,
      category: 'Electronics',
      subCategory: 'Laptops',
      images: ['https://i.dell.com/sites/csimages/Video_Imagery/all/xps-13-9300-laptop.jpg'],
      stock: 20,
      sales: 150,
      rating: 4.5,
      reference: 'DELL-XPS13',
      supplier: 'Dell',
      promotion: false
    },
    {
      name: 'GoPro HERO11',
      description: 'Waterproof action camera with 5.3K video and advanced stabilization.',
      price: 429.99,
      category: 'Electronics',
      subCategory: 'Cameras',
      images: ['https://gopro.com/content/dam/gopro/en/en/products/hero11-black/gallery/hero11-black-gallery-1.jpg'],
      stock: 30,
      sales: 90,
      rating: 4.6,
      reference: 'GOPRO-HERO11',
      supplier: 'GoPro',
      promotion: true
    },
    {
      name: 'Adidas Ultraboost 22',
      description: 'High-performance running shoes with responsive cushioning.',
      price: 180.00,
      category: 'Fashion',
      subCategory: 'Shoes',
      images: ['https://assets.adidas.com/images/w_600,f_auto,q_auto/7e7e8e8e8e8e4e8e8e8e8e8e8e8e8e8e_9366/Ultraboost_22_Shoes_White_GX5462_01_standard.jpg'],
      stock: 50,
      sales: 220,
      rating: 4.8,
      reference: 'ADIDAS-UB22',
      supplier: 'Adidas',
      promotion: false
    },
    {
      name: 'Apple Watch Series 8',
      description: 'Smartwatch with advanced health features and always-on display.',
      price: 399.99,
      category: 'Electronics',
      subCategory: 'Wearables',
      images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MNJT3_VW_34FR+watch-44-alum-silver-nc-8s_VW_34FR_WF_CO_GEO_EMEA?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1660778402706'],
      stock: 35,
      sales: 180,
      rating: 4.7,
      reference: 'APPLE-WATCH8',
      supplier: 'Apple',
      promotion: true
    },
    {
      name: 'Bose QuietComfort Earbuds II',
      description: 'Noise-cancelling earbuds with personalized sound and long battery life.',
      price: 299.99,
      category: 'Electronics',
      subCategory: 'Earbuds',
      images: ['https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/quietcomfort_earbuds_ii/product_silo_images/qc_earbuds_ii_triple_black_EC_hero.psd/jcr:content/renditions/cq5dam.web.320.320.png'],
      stock: 45,
      sales: 160,
      rating: 4.6,
      reference: 'BOSE-QCEB2',
      supplier: 'Bose',
      promotion: false
    },
    {
      name: 'Fitbit Charge 5',
      description: 'Fitness tracker with built-in GPS, heart rate monitoring, and sleep tracking.',
      price: 149.95,
      category: 'Electronics',
      subCategory: 'Wearables',
      images: ['https://static.wixstatic.com/media/8bb438_2e2e2e2e2e2e4e2e8e2e2e2e2e2e2e2e~mv2.jpg/v1/fill/w_640,h_640,al_c,q_85,usm_0.66_1.00_0.01/8bb438_2e2e2e2e2e2e4e2e8e2e2e2e2e2e2e2e~mv2.jpg'],
      stock: 55,
      sales: 140,
      rating: 4.5,
      reference: 'FITBIT-CHARGE5',
      supplier: 'Fitbit',
      promotion: true
    },
    {
      name: 'Sony PlayStation 5',
      description: 'Next-gen gaming console with ultra-fast SSD and immersive graphics.',
      price: 499.99,
      category: 'Electronics',
      subCategory: 'Gaming Consoles',
      images: ['https://m.media-amazon.com/images/I/619BkvKW35L._AC_SL1500_.jpg'],
      stock: 10,
      sales: 500,
      rating: 4.9,
      reference: 'SONY-PS5',
      supplier: 'Sony',
      promotion: false
    },
    {
      name: 'Microsoft Surface Pro 9',
      description: 'Versatile 2-in-1 laptop with touchscreen and detachable keyboard.',
      price: 1299.99,
      category: 'Electronics',
      subCategory: 'Laptops',
      images: ['https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Surface-Pro-9-Platinum-Laptop-01-1?wid=1200&hei=1200&fit=constrain'],
      stock: 18,
      sales: 110,
      rating: 4.6,
      reference: 'MS-SURFACEPRO9',
      supplier: 'Microsoft',
      promotion: true
    }
  ];

  sortParam: string = 'price-asc';

  selectedProduct: Product | null = null;

  // Pagination properties
  pageSize = 9;
  currentPage = 1;

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
