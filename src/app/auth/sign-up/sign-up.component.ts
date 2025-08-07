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
import { Router } from '@angular/router';
import { FnFooter } from '../../dash-fn/fn-footer/fn-footer';

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: [''],
      birthDate: [''],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = {
        ...this.signupForm.value,
        role: 'supplier', // Set role to supplier as specified
        birthDate: this.signupForm.value.birthDate ? 
          this.signupForm.value.birthDate.toISOString().split('T')[0] : ''
      };
      
      // Remove acceptTerms from the data to be sent
      delete formData.acceptTerms;
      
      console.log('Supplier signup data:', formData);
      
      // Here you would typically call your authentication service
      // this.authService.registerSupplier(formData).subscribe(...);
      
      // For now, just log the data and potentially navigate
      alert('Supplier account created successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
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
  }
}
