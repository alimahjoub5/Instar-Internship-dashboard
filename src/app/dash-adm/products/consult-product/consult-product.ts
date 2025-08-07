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
  has3DModel: boolean = false;
  showUpload3D = false;
  
  // 3D Models navigation
  all3DModels: any[] = [];
  current3DModelIndex: number = 0;

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
          console.log('Product ID for 3D models:', this.product3DId);
          // Check if a 3D model exists for this product
          this.productService.getAll3DProducts(this.product3DId).subscribe({
            next: (models) => {
              console.log('3D Models found:', models);
              if (Array.isArray(models) && models.length > 0) {
                this.has3DModel = true;
                this.all3DModels = models;
                this.current3DModelIndex = 0;
                this.loadCurrent3DModel();
              } else {
                this.has3DModel = false;
                this.model3DUrl = '';
                this.all3DModels = [];
                this.current3DModelIndex = 0;
                console.log('No 3D models found for product');
              }
            },
            error: (err) => {
              console.error('Error loading 3D models:', err);
              this.has3DModel = false;
              this.model3DUrl = '';
              this.all3DModels = [];
              this.current3DModelIndex = 0;
            }
          });
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

  // 3D Model Navigation Methods
  loadCurrent3DModel() {
    if (this.all3DModels.length > 0 && this.current3DModelIndex >= 0 && this.current3DModelIndex < this.all3DModels.length) {
      const currentModel = this.all3DModels[this.current3DModelIndex];
      const file = currentModel?.image3D || '';
      if (file && file.trim() !== '') {
        this.model3DUrl = file.startsWith('http') ? file : `http://localhost:9002/api/uploads/${file}`;
      } else {
        this.model3DUrl = '';
      }
    }
  }

  next3DModel() {
    if (this.all3DModels.length > 0) {
      this.current3DModelIndex = (this.current3DModelIndex + 1) % this.all3DModels.length;
      this.loadCurrent3DModel();
    }
  }

  previous3DModel() {
    if (this.all3DModels.length > 0) {
      this.current3DModelIndex = this.current3DModelIndex === 0 
        ? this.all3DModels.length - 1 
        : this.current3DModelIndex - 1;
      this.loadCurrent3DModel();
    }
  }

  goTo3DModel(index: number) {
    if (index >= 0 && index < this.all3DModels.length) {
      this.current3DModelIndex = index;
      this.loadCurrent3DModel();
    }
  }

  onUpload3DClose() {
    this.showUpload3D = false;
    // Recharge les données du produit (et donc le modèle 3D)
    const id = this.product?._id || this.product3DId;
    if (id) {
      this.isLoading = true;
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.product3DId = product._id || '';
          // Recharge la liste des modèles 3D
          this.productService.getAll3DProducts(this.product3DId).subscribe({
            next: (models) => {
              if (Array.isArray(models) && models.length > 0) {
                this.has3DModel = true;
                this.all3DModels = models;
                this.current3DModelIndex = 0;
                this.loadCurrent3DModel();
              } else {
                this.has3DModel = false;
                this.model3DUrl = '';
                this.all3DModels = [];
                this.current3DModelIndex = 0;
              }
            },
            error: () => {
              this.has3DModel = false;
              this.model3DUrl = '';
              this.all3DModels = [];
              this.current3DModelIndex = 0;
            }
          });
          this.isLoading = false;
          this.loadReviews(id);
        },
        error: (err) => {
          this.error = 'Failed to load product.';
          this.isLoading = false;
        }
      });
    }
  }
}
