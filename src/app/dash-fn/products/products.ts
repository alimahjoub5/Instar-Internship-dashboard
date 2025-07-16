import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../shared/services/product.service';
import { ProductCard } from './product-card/product-card';
import { Sidebar } from '../sidebar/sidebar';
import { SidebarProducts } from './sidebar/sidebar';
import { ProductModal } from './product-modal/product-modal';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCard, Sidebar, SidebarProducts, ProductModal],
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
      stock: 25,
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
    }
  ];

  selectedProduct: Product | null = null;

  openProductModal(product: Product) {
    this.selectedProduct = product;
  }

  closeProductModal() {
    this.selectedProduct = null;
  }
}
