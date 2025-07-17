import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Product } from '../../../shared/services/product.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.css'],
  imports: [CommonModule, CurrencyPipe, DatePipe]
})
export class ProductModal implements OnChanges, AfterViewInit {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  showModal = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      setTimeout(() => this.showModal = true, 10);
    }
  }

  ngAfterViewInit() {
    if (this.product) {
      setTimeout(() => this.showModal = true, 10);
    }
  }

  onClose() {
    this.showModal = false;
    setTimeout(() => this.close.emit(), 350); // match transition duration
  }
}
