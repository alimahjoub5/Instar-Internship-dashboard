import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consult-product',
  templateUrl: './consult-product.html',
  styleUrls: ['./consult-product.css'],
  imports: [CommonModule, RouterModule]
})
export class ConsultProductComponent implements OnInit {
  product: Product | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to load product.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No product ID provided.';
    }
  }

  goBack() {
    this.router.navigate(['/dash-adm/products']);
  }
}
