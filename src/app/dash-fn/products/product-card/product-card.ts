import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { SubCategoryService } from '../../../shared/services/subcategory.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard implements OnInit, OnChanges {
  @Input() product!: Product;
  @Output() cardClick = new EventEmitter<void>();
  
  categoryName: string = '';
  subCategoryName: string = '';
  
  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService
  ) {}
  
  ngOnInit() {
    this.fetchCategoryNames();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.fetchCategoryNames();
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
      this.categoryService.getCategoryById(this.product.category)
        .pipe(
          catchError(error => {
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
            this.subCategoryName = this.product?.subCategory || '';
            return of(null);
          })
        )
        .subscribe(subCategory => {
          this.subCategoryName = subCategory?.title || this.product?.subCategory || '';
        });
    }
  }
}
