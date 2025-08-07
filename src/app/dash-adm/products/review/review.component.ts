import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review, ReviewService } from '../../../shared/services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class ReviewComponent implements OnInit {
  @Input() productId!: string;

  reviews: Review[] = [];
  newReview: Partial<Review> = { comment: '' };
  reviewImageFile: File | null = null;
  isReviewLoading = false;
  isReviewSubmitting = false;
  editingReview: Review | null = null;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    if (this.productId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.isReviewLoading = true;
    this.reviewService.getReviews(this.productId).subscribe({
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
    if (!this.productId || !this.newReview.comment) return;
    this.isReviewSubmitting = true;
    const obs = this.editingReview
      ? this.reviewService.updateReview(this.editingReview._id!, { comment: this.newReview.comment })
      : this.reviewService.addReview(this.productId, { comment: this.newReview.comment });
    obs.subscribe({
      next: (review) => {
        if (this.reviewImageFile) {
          this.reviewService.updateReviewImage(review._id!, this.reviewImageFile).subscribe({
            next: () => this.loadReviews(),
            complete: () => this.resetReviewForm()
          });
        } else {
          this.loadReviews();
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
        this.loadReviews();
      });
    }
  }

  editReview(review: Review) {
    this.editingReview = review;
    this.newReview.comment = review.comment;
  }

  deleteReview(review: Review) {
    if (review._id) {
      this.reviewService.deleteReview(review._id).subscribe(() => this.loadReviews());
    }
  }

  resetReviewForm() {
    this.newReview = { comment: '' };
    this.reviewImageFile = null;
    this.editingReview = null;
    this.isReviewSubmitting = false;
  }
} 