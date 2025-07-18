import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class AddProductComponent {
  productForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
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
      image: [null, Validators.required],
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
    }
  }

  submit() {
    if (this.productForm.invalid) return;
    this.isSubmitting = true;
    this.error = null;
    const formValue = { ...this.productForm.value };
    const imageFile = formValue.image;
    delete formValue.image;
    this.productService.createProduct(formValue).subscribe({
      next: (product) => {
        if (imageFile && product._id) {
          this.productService.uploadProductImage(product._id, imageFile).subscribe({
            next: () => this.router.navigate(['/dash-adm/products']),
            error: () => {
              this.error = 'Product created, but image upload failed.';
              this.isSubmitting = false;
            }
          });
        } else {
          this.router.navigate(['/dash-adm/products']);
        }
      },
      error: () => {
        this.error = 'Failed to create product.';
        this.isSubmitting = false;
      }
    });
  }
}
