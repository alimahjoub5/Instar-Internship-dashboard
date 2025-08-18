import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../../shared/services/product.service';
import { Promotion, PromotionService } from '../../../shared/services/promotion.service';
import { Category, CategoryService } from '../../../shared/services/category.service';
import { SubCategoryService } from '../../../shared/services/subcategory.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmationComponent } from "../../confirmation/confirmation.component";
import { ConfirmationService } from '../../../shared/services/confirmation.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.css'],
  imports: [CommonModule, CurrencyPipe, FormsModule, ConfirmationComponent],
  standalone: true
})
export class ProductModal implements OnChanges, AfterViewInit, OnInit {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() savePromotionEvent = new EventEmitter<Promotion>();

  showModal = false;
  showPromotionForm = false;
  promotionPercentage = 20; // Default value, you can replace this with actual data
  isSaving = false;
  currentPromotion: Promotion | null = null;
  categoryName: string = '';
  subCategoryName: string = '';
  
  promotionData: Partial<Omit<Promotion, 'startDate' | 'endDate'>> & {
    startDate: string;
    endDate: string;
  } = {
    discountPercentage: 0,
    newPrice: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Default to 1 month from now
    text: ''
  };

  constructor(
    private promotionService: PromotionService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchPromotionData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      setTimeout(() => this.showModal = true, 10);
      // Reset form when product changes
      this.fetchPromotionData();
      this.fetchCategoryNames();
      
     
    }
  }

  ngAfterViewInit() {
    if (this.product) {
      setTimeout(() => this.showModal = true, 10);
    }
  }

  fetchPromotionData() {
    if (this.product && this.product._id && this.product.promotion) {
      this.promotionService.getPromotionsForProduct(this.product._id).pipe(
        tap((promotion) => {
           if (promotion) {
            this.currentPromotion = promotion;
            console.log(this.currentPromotion);
            
            // Update the promotionPercentage for display
            this.promotionPercentage = this.currentPromotion.discountPercentage;
            
            // Format dates as yyyy-MM-dd for HTML date inputs
            const startDate = new Date(this.currentPromotion.startDate);
            const endDate = new Date(this.currentPromotion.endDate);
            
            const formattedStartDate = startDate.toISOString().split('T')[0]; // Gets yyyy-MM-dd
            const formattedEndDate = endDate.toISOString().split('T')[0]; // Gets yyyy-MM-dd
            
            // Pre-fill the form with current promotion data
            this.promotionData = {
              _id: this.currentPromotion._id,
              product: this.product?._id,
              discountPercentage: this.currentPromotion.discountPercentage,
              newPrice: this.currentPromotion.newPrice,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              image: this.currentPromotion.image,
              text: this.currentPromotion.text
            };
          } else {
            // No promotions found despite product.promotion being true
            console.warn('No promotions found for this product despite promotion flag');
            this.resetPromotionForm();
          }
        }),
        catchError((error) => {
          console.error('Error fetching promotions for product:', error);
          this.resetPromotionForm();
          return of(null);
        })
      ).subscribe();
    } else {
      // No promotion, just reset the form
      this.resetPromotionForm();
    }
  }

  fetchCategoryNames() {
    if (!this.product) {
      return;
    }

    // Reset category names
    this.categoryName = '';
    this.subCategoryName = '';

    // Fetch main category name
    if (this.product.category) {
      console.log(`Fetching category for ID: ${this.product.category}`);
      this.categoryService.getCategoryById(this.product.category)
        .pipe(
          catchError(error => {
            console.warn('Category not found, using fallback:', this.product?.category);
            this.categoryName = this.product?.category || '';
            return of(null);
          })
        )
        .subscribe(category => {
          this.categoryName = category?.title || this.product?.category || '';
        });
    }

    // Fetch subcategory name if exists
    if (this.product.subCategory) {
      this.subCategoryService.getSubCategoryById(this.product.subCategory)
        .pipe(
          catchError(error => {
            console.warn('Subcategory not found, using fallback:', this.product?.subCategory);
            this.subCategoryName = this.product?.subCategory || '';
            return of(null);
          })
        )
        .subscribe(subCategory => {
          console.log('Subcategory fetched:', subCategory?.title);
          this.subCategoryName = subCategory?.title || this.product?.subCategory || '';
        });
    }
  }

  onClose() {
    this.showModal = false;
    setTimeout(() => this.close.emit(), 350); // match transition duration
  }

  togglePromotionForm() {
    this.showPromotionForm = !this.showPromotionForm;
    
  }

  resetPromotionForm() {
    if (this.product) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      // Format dates as yyyy-MM-dd
      const formattedStartDate = today.toISOString().split('T')[0];
      const formattedEndDate = nextMonth.toISOString().split('T')[0];
      
      this.promotionData = {
        product: this.product._id,
        discountPercentage: this.promotionPercentage || 0,
        newPrice: this.calculateDiscountedPrice(this.product.price, this.promotionPercentage || 0),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
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
      // Convert string dates back to Date objects
      const startDate = new Date(this.promotionData.startDate as string);
      const endDate = new Date(this.promotionData.endDate as string);
      
      const promotion: Promotion = {
        product: this.product._id || '',
        discountPercentage: this.promotionData.discountPercentage,
        newPrice: this.promotionData.newPrice as number,
        startDate: startDate,
        endDate: endDate,
        image: this.product.image,
        text: this.promotionData.text || ''
      };
      
      // If we have an existing promotion, show confirmation before updating
      if (this.currentPromotion && this.currentPromotion._id) {
        promotion._id = this.currentPromotion._id;
        
        this.confirmationService.confirm({
          title: 'Update Promotion',
          message: 'Are you sure you want to update this promotion?',
          confirmText: 'Update',
          cancelText: 'Cancel',
          type: 'warning'
        }).then(result => {
          if (result) {
            this.isSaving = true;
            this.updatePromotion(promotion);
          }
        });
      } else {
        // Create a new promotion - no confirmation needed
        this.isSaving = true;
        this.createPromotion(promotion);
      }
    }
  }
   private updatePromotion(promotion: Promotion) {
    this.promotionService.updatePromotion(promotion._id!, promotion).pipe(
      tap((updatedPromotion) => {
        console.log('Promotion updated successfully:', updatedPromotion);
        this.currentPromotion = updatedPromotion;
        
        // Emit the updated promotion to parent component
        this.savePromotionEvent.emit(updatedPromotion);
      }),
      catchError((error) => {
        console.error('Error updating promotion:', error);
        return of(null);
      }),
      finalize(() => {
        this.isSaving = false;
        this.showPromotionForm = false;
      })
    ).subscribe();
  }
  private createPromotion(promotion: Promotion) {
    this.promotionService.createPromotion(promotion).pipe(
      tap((savedPromotion) => {
        console.log('Promotion saved successfully:', savedPromotion);
        this.currentPromotion = savedPromotion;
        
        // Update the product's promotion attribute to true
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
  
    deletePromotion() {
    this.confirmationService.confirm({
      title: 'Delete Promotion',
      message: 'Are you sure you want to delete this promotion? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }).then(result => {
      if (result) {
        this.performDeletePromotion();
      }
    });
  }
  
  // Extract the delete logic to a separate method
  private performDeletePromotion() {
    if (this.product && this.product._id && this.currentPromotion && this.currentPromotion._id) {
      this.isSaving = true;
      
      // Delete the promotion
      this.promotionService.deletePromotion(this.currentPromotion._id).pipe(
        tap(() => {
          console.log('Promotion deleted successfully');
          
          // Update the product's promotion attribute to false
          this.productService.updateProduct(this.product!._id!, { promotion: false }).pipe(
            tap((updatedProduct) => {
              console.log('Product updated after promotion deletion:', updatedProduct);
              
              // Update the local product object
              if (this.product) {
                this.product.promotion = false;
              }
              
              // Reset promotion data
              this.currentPromotion = null;
              this.resetPromotionForm();
              
              // Close the promotion form
              this.showPromotionForm = false;
            }),
            catchError((error) => {
              console.error('Error updating product after promotion deletion:', error);
              return of(null);
            })
          ).subscribe();
        }),
        catchError((error) => {
          console.error('Error deleting promotion:', error);
          return of(null);
        }),
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe();
    } else if (this.product && this.product._id) {
      // No current promotion found, just update the product flag
      this.productService.updateProduct(this.product._id, { promotion: false }).pipe(
        tap((updatedProduct) => {
          console.log('Product updated (no promotions found):', updatedProduct);
          
          // Update the local product object
          if (this.product) {
            this.product.promotion = false;
          }
          
          // Close the promotion form
          this.showPromotionForm = false;
        }),
        catchError((error) => {
          console.error('Error updating product (no promotions found):', error);
          return of(null);
        }),
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe();
    }
  }

  getProductImages(): string[] {
    if (!this.product) {
      return [];
    }
    
    // If product has images array, use it; otherwise use the main image
    if (this.product.images && this.product.images.length > 0) {
      return this.product.images;
    }
    
    // Fallback to main product image
    return [this.product.image];
  }

  getSupplierName(): string {
    return sessionStorage.getItem('supplierName') || '';
  }
}
