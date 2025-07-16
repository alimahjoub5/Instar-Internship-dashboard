import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Product } from '../../../shared/services/product.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.css'],
  imports: [CommonModule, CurrencyPipe, DatePipe]
})
export class ProductModal implements OnChanges {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      console.log('Product passed to modal:', this.product);
    }
  }

  onClose() {
    this.close.emit();
  }
}
