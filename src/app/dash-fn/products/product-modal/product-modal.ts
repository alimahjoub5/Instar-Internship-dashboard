import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../../shared/services/product.service';
import { Promotion, PromotionService } from '../../../shared/services/promotion.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.css'],
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  standalone: true
})
export class ProductModal implements OnChanges, AfterViewInit {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() savePromotionEvent = new EventEmitter<Promotion>();

  showModal = false;
  showPromotionForm = false;
  promotionPercentage = 45; // Default value, you can replace this with actual data
  isSaving = false;
  
  promotionData: Partial<Promotion> = {
    discountPercentage: 0,
    newPrice: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month from now
    text: ''
  };

  constructor(
    private promotionService: PromotionService,
    private productService: ProductService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      setTimeout(() => this.showModal = true, 10);
      // Reset form when product changes
      this.resetPromotionForm();
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

  togglePromotionForm() {
    this.showPromotionForm = !this.showPromotionForm;
    if (this.showPromotionForm && this.product) {
      // Initialize form with product data
      this.resetPromotionForm();
    }
  }

  resetPromotionForm() {
    if (this.product) {
      this.promotionData = {
        product: this.product._id,
        discountPercentage: this.promotionPercentage || 0,
        newPrice: this.calculateDiscountedPrice(this.product.price, this.promotionPercentage || 0),
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        image: this.product.image,
        text: ''
      };
      this.calculateNewPrice();
    }
  }

  calculateNewPrice() {
    if (this.product && this.promotionData.discountPercentage !== undefined) {
      this.promotionData.newPrice = this.calculateDiscountedPrice(
        this.product.price, 
        this.promotionData.discountPercentage
      );
    }
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    // Round to 2 decimal places
    return Math.round(discountedPrice * 100) / 100;
  }

  savePromotion() {
    if (this.product && this.promotionData.discountPercentage && this.promotionData.text) {
      this.isSaving = true;
      
      const promotion: Promotion = {
        product: this.product._id || '',
        discountPercentage: this.promotionData.discountPercentage,
        newPrice: this.promotionData.newPrice as number,
        startDate: this.promotionData.startDate as Date,
        endDate: this.promotionData.endDate as Date,
        image: this.product.image,
        text: this.promotionData.text || ''
      };
      
      // 1. Save the promotion using the promotion service
      this.promotionService.createPromotion(promotion).pipe(
        tap((savedPromotion) => {
          console.log('Promotion saved successfully:', savedPromotion);
          
          // 2. Update the product's promotion attribute to true
          if (this.product && this.product._id) {
            this.productService.updateProduct(this.product._id, { promotion: true }).pipe(
              tap((updatedProduct) => {
                console.log('Product updated with promotion flag:', updatedProduct);
                
                // Update the local product object
                if (this.product) {
                  this.product.promotion = true;
                }
                
                // Emit the saved promotion to parent component
                this.savePromotionEvent.emit(savedPromotion);
              }),
              catchError((error) => {
                console.error('Error updating product:', error);
                return of(null);
              })
            ).subscribe();
          }
        }),
        catchError((error) => {
          console.error('Error saving promotion:', error);
          return of(null);
        }),
        finalize(() => {
          this.isSaving = false;
          this.showPromotionForm = false;
        })
      ).subscribe();
    }
  }
}
