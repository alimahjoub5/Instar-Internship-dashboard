import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/services/product.service';

@Component({
  selector: 'app-products-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-carousel.html',
  styleUrls: ['./products-carousel.css']
})
export class ProductsCarousel {
  @Input() products: Product[] = [];
  @Output() productSelected = new EventEmitter<Product>();

  currentIndex = 0;
  isAnimating = false;

  get currentProduct(): Product | null {
    return this.products.length ? this.products[this.currentIndex] : null;
  }

  prev() {
    if (this.products.length) {
      this.triggerAnimation();
      this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
    }
  }

  next() {
    if (this.products.length) {
      this.triggerAnimation();
      this.currentIndex = (this.currentIndex + 1) % this.products.length;
    }
  }

  goToIndex(i: number) {
    if (i !== this.currentIndex) {
      this.triggerAnimation();
      this.currentIndex = i;
    }
  }

  selectProduct(product: Product) {
    this.productSelected.emit(product);
  }

  triggerAnimation() {
    this.isAnimating = true;
  }

  onImageLoad() {
    setTimeout(() => {
      this.isAnimating = false;
    }, 400); // match CSS transition duration
  }
}
