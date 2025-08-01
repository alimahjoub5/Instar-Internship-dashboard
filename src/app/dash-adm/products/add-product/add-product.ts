import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { SupplierService } from '../../../shared/services/supplier.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  categories: any[] = [];
  suppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
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
      dimensions: this.fb.group({
        height: [null],
        width: [null],
        length: [null],
        radius: [null]
      })
    });
  }

  ngOnInit() {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      console.error('User not authenticated. Redirecting to login...');
      this.authService.redirectToLoginIfNotAuthenticated();
      return;
    }

    // Load categories
    this.categoryService.getAllCategories().subscribe({
      next: (cats: any) => {
        if (Array.isArray(cats)) {
          this.categories = cats;
        } else if (cats && cats.data && Array.isArray(cats.data)) {
          this.categories = cats.data;
        } else if (cats && cats.categories && Array.isArray(cats.categories)) {
          this.categories = cats.categories;
        } else if (cats && cats.results && Array.isArray(cats.results)) {
          this.categories = cats.results;
        } else {
          this.categories = [];
        }
      },
      error: () => {
        this.categories = [];
      }
    });

    // Load suppliers
    this.supplierService.getAllSuppliers().subscribe({
      next: (sups: any) => {
        this.suppliers = Array.isArray(sups) ? sups : [];
      },
      error: () => {
        this.suppliers = [];
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
    }
  }

  submit() {
    console.log('Form valid:', this.productForm.valid);
    console.log('Form errors:', this.productForm.errors);
    console.log('Form value:', this.productForm.value);
    
    // Check authentication
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    console.log('Token:', token);
    
    if (this.productForm.invalid) {
      console.log('Form is invalid, returning');
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    const formValue = { ...this.productForm.value };
    
    // Ajouter les valeurs automatiques
    formValue.sales = 0;
    formValue.rate = 0;
    
    console.log('Final form value to send:', formValue);
    
    const imageFile = formValue.image;
    delete formValue.image;
    
    console.log('Sending product data:', formValue);
    console.log('Image file:', imageFile);
    
    this.productService.createProduct(formValue).subscribe({
      next: (product) => {
        console.log('Product created successfully:', product);
        if (imageFile && product._id) {
          console.log('Uploading image for product:', product._id);
          this.productService.uploadProductImage(product._id, imageFile).subscribe({
            next: () => {
              console.log('Image uploaded successfully');
              this.router.navigate(['/dash-adm/products']);
            },
            error: (err) => {
              console.error('Image upload error:', err);
              this.error = 'Product created, but image upload failed.';
              this.isSubmitting = false;
            }
          });
        } else {
          console.log('No image to upload, navigating to products');
          this.router.navigate(['/dash-adm/products']);
        }
      },
      error: (err) => {
        console.error('Product creation error:', err);
        this.error = 'Failed to create product.';
        this.isSubmitting = false;
      }
    });
  }
}
