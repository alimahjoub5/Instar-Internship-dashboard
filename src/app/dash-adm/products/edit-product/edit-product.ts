import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.html',
  styleUrls: ['./edit-product.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  productId: string | null = null;
  currentImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      reference: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      supplier: ['', Validators.required],
      materials: ['', Validators.required],
      image: [null],
      promotion: [false],
      sales: [0],
      rate: [0],
      dimensions: this.fb.group({
        height: [null],
        width: [null],
        length: [null],
        radius: [null]
      })
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product: Product) => {
          this.productForm.patchValue({
            ...product,
            dimensions: undefined // prevent patchValue from erroring on unknown property
          });
          if ((product as any).dimensions) {
            this.productForm.get('dimensions')?.patchValue((product as any).dimensions);
          }
          this.currentImage = product.image || null;
          this.error = 'Failed to load product.';
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
    }
  }

  submit() {
    if (this.productForm.invalid || !this.productId) return;
    this.isSubmitting = true;
    this.error = null;
    const formValue = { ...this.productForm.value };
    const imageFile = formValue.image;
    delete formValue.image;
    this.productService.updateProduct(this.productId, formValue).subscribe({
      next: () => {
        if (imageFile) {
          this.productService.uploadProductImage(this.productId!, imageFile).subscribe({
            next: () => this.router.navigate(['/dash-adm/products']),
            error: () => {
              this.error = 'Product updated, but image upload failed.';
              this.isSubmitting = false;
            }
          });
        } else {
          this.router.navigate(['/dash-adm/products']);
        }
      },
      error: () => {
        this.error = 'Failed to update product.';
        this.isSubmitting = false;
      }
    });
  }
}
