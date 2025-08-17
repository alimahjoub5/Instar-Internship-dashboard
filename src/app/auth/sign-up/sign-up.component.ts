import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FnFooter } from '../../dash-fn/fn-footer/fn-footer';
import { SupplierService } from '../../shared/services/supplier.service';
import { UploadService } from '../../shared/services/upload.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    FnFooter
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  selectedFileName = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  imageError = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private supplierService: SupplierService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      marque: ['', [Validators.required]],
      rib: ['', [Validators.required]],
      email: ['', [Validators.email]],
      webSite: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  onSubmit(): void {
    // Validate image selection
    if (!this.selectedFile) {
      this.imageError = 'Company logo is required';
      return;
    }
    
    this.imageError = '';
    
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.uploadLogoAndCreateSupplier();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }

  private uploadLogoAndCreateSupplier(): void {
    if (!this.selectedFile) {
      this.isLoading = false;
      return;
    }

    console.log('Uploading logo...');
    this.uploadService.uploadFile(this.selectedFile, 'images')
      .pipe(
        switchMap(uploadResponse => {
          console.log('Logo uploaded successfully:', uploadResponse);
          return this.createSupplierWithImageUrl(uploadResponse.fileUrl);
        }),
        catchError(error => {
          console.error('Error uploading logo:', error);
          alert('Error uploading logo. Please try again.');
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          console.log('Supplier created successfully:', response);
          alert('Supplier account created successfully!');
          this.router.navigate(['/auth/login']);
        }
      });
  }

  private createSupplierWithImageUrl(imageUrl: string): any {
    const supplierData = {
      name: this.signupForm.value.name,
      address: this.signupForm.value.address,
      phone: this.signupForm.value.phone,
      marque: this.signupForm.value.marque,
      rib: this.signupForm.value.rib,
      email: this.signupForm.value.email || null,
      webSite: this.signupForm.value.webSite || null,
      password: this.signupForm.value.password,
      image: imageUrl,
      userId: null 
    };
    
    console.log('Supplier signup data with uploaded image:', supplierData);
    
    return this.supplierService.registerSupplier(supplierData)
      .pipe(
        catchError(error => {
          console.error('Error creating supplier:', error);
          alert('Error creating supplier account. Please try again.');
          return of(null);
        })
      );
  }

  navigateToSignIn(): void {
    // Navigate to sign in page
    this.router.navigate(['/auth/login']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.imageError = ''; // Clear any previous error
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreview = null;
    this.imageError = 'Company logo is required';
  }
}
