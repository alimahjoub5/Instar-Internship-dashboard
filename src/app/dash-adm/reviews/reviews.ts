import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Review, ReviewService } from '../../shared/services/review.service';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews implements OnInit {
  productId: string = '';
  reviews: Review[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    if (this.productId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.isLoading = true;
    this.reviewService.getReviews(this.productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: () => {
        this.reviews = [];
        this.isLoading = false;
      }
    });
  }

  deleteReview(review: Review) {
    if (review._id) {
      this.reviewService.deleteReview(review._id).subscribe(() => this.loadReviews());
    }
  }

  confirmDeleteReview(review: Review) {
    if (confirm('Voulez-vous vraiment supprimer cette review ?')) {
      this.deleteReview(review);
    }
  }
}
