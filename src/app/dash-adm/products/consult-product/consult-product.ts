import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Upload3DComponent } from './upload-3d.component';
import { ThreeViewerComponent } from './three-viewer.component';
import { Product, ProductService } from '../../../shared/services/product.service';
import { Supplier, SupplierService } from '../../../shared/services/supplier.service';
import { FormsModule } from '@angular/forms';
import { Review, ReviewService } from '../../../shared/services/review.service';

@Component({
  selector: 'app-consult-product',
  imports: [
    CommonModule,
    Upload3DComponent,
    ThreeViewerComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './consult-product.html',
  styleUrl: './consult-product.css'
})
export class ConsultProductComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;
  error: string | null = null;
  product3DId: string = '';
  model3DUrl: string = '';
  suppliers: Supplier[] = [];
  reviews: Review[] = [];
  newReview: Partial<Review> = { comment: '' };
  reviewImageFile: File | null = null;
  isReviewLoading = false;
  isReviewSubmitting = false;
  editingReview: Review | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private supplierService: SupplierService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.supplierService.getAllSuppliers().subscribe({
      next: (sups) => this.suppliers = sups,
      error: () => this.suppliers = []
    });
    if (id) {
      this.isLoading = true;
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.product3DId = product._id || '';
          this.model3DUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
          this.isLoading = false;
          this.loadReviews(id);
        },
        error: (err) => {
          this.error = 'Failed to load product.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No product ID provided.';
    }
  }

  loadReviews(productId: string) {
    this.isReviewLoading = true;
    this.reviewService.getReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isReviewLoading = false;
      },
      error: () => {
        this.reviews = [];
        this.isReviewLoading = false;
      }
    });
  }

  submitReview() {
    if (!this.product?._id || !this.newReview.comment) return;
    this.isReviewSubmitting = true;
    const obs = this.editingReview
      ? this.reviewService.updateReview(this.editingReview._id!, { comment: this.newReview.comment })
      : this.reviewService.addReview(this.product._id, { comment: this.newReview.comment });
    obs.subscribe({
      next: (review) => {
        if (this.reviewImageFile) {
          this.reviewService.updateReviewImage(review._id!, this.reviewImageFile).subscribe({
            next: () => this.loadReviews(this.product!._id!),
            complete: () => this.resetReviewForm()
          });
        } else {
          this.loadReviews(this.product!._id!);
          this.resetReviewForm();
        }
      },
      error: () => this.isReviewSubmitting = false,
      complete: () => this.isReviewSubmitting = false
    });
  }

  onReviewImageChange(event: any) {
    const file = event.target.files[0];
    if (file) this.reviewImageFile = file;
  }

  onReviewImageUpload(event: any, review: Review) {
    const file = event.target.files[0];
    if (file && review._id) {
      this.reviewService.updateReviewImage(review._id, file).subscribe(() => {
        if (this.product?._id) this.loadReviews(this.product._id);
      });
    }
  }

  editReview(review: Review) {
    this.editingReview = review;
    this.newReview.comment = review.comment;
  }

  deleteReview(review: Review) {
    if (review._id && this.product?._id) {
      this.reviewService.deleteReview(review._id).subscribe(() => this.loadReviews(this.product!._id!));
    }
  }

  resetReviewForm() {
    this.newReview = { comment: '' };
    this.reviewImageFile = null;
    this.editingReview = null;
    this.isReviewSubmitting = false;
  }

  getSupplierName(supplierId: string | undefined): string {
    if (!supplierId) return '';
    const supplier = this.suppliers.find(s => s._id === supplierId || s.name === supplierId);
    return supplier ? supplier.name : supplierId;
  }

  goBack() {
    // For now, just log. In a real app, use router navigation.
    console.log('Back to list');
  }
}
