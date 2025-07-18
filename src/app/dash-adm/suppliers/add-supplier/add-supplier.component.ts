import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SupplierService, Supplier } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  supplierForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  isEditMode = false;
  supplierId: string | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: [''],
      contactPerson: [''],
      website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      description: [''],
      status: ['active', Validators.required]
    });
  }

  ngOnInit() {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.isEditMode = true;
      this.loadSupplier();
    }
  }

  loadSupplier() {
    if (!this.supplierId) return;
    
    this.isLoading = true;
    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue(supplier);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading supplier:', error);
        this.errorMessage = 'Error loading supplier details';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.supplierForm.valid) {
      this.isLoading = true;
      const supplierData: Supplier = this.supplierForm.value;

      if (this.isEditMode && this.supplierId) {
        this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
          next: () => {
            this.successMessage = 'Supplier updated successfully!';
            this.isLoading = false;
            setTimeout(() => {
              this.router.navigate(['/dash-adm/suppliers']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error updating supplier:', error);
            this.errorMessage = 'Error updating supplier';
            this.isLoading = false;
          }
        });
      } else {
        this.supplierService.createSupplier(supplierData).subscribe({
          next: () => {
            this.successMessage = 'Supplier created successfully!';
            this.isLoading = false;
            setTimeout(() => {
              this.router.navigate(['/dash-adm/suppliers']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error creating supplier:', error);
            this.errorMessage = 'Error creating supplier';
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dash-adm/suppliers']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'Please enter a valid phone number';
      }
      if (fieldName === 'website') {
        return 'Please enter a valid URL (starting with http:// or https://)';
      }
    }
    return '';
  }
} 