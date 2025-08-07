import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../user.model";
import { UserService } from "../user.service";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  isEdit = false;
  userId: string | null = null;

  // Removed roles array

  genders = [
    { value: '', label: 'Not specified' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      recoveryEmail: ['', []], // Enlever Validators.email ici
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      address: [''],
      gender: [''],
      birthDate: [''],
      role: ['user'],
      imageUrl: [''],
      ban: [false]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.isEdit = true;
      this.userService.getUserById(this.userId).subscribe(user => {
        // Remove password from form when editing
        const { password, ...userWithoutPassword } = user;
        this.userForm.patchValue(userWithoutPassword);
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      });
    }
    // Ajout d'un validateur conditionnel pour recoveryEmail
    this.userForm.get('recoveryEmail')?.valueChanges.subscribe(value => {
      const control = this.userForm.get('recoveryEmail');
      if (value) {
        control?.setValidators([Validators.email]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    
    const formValue = this.userForm.value;
    const user: User = {
      ...formValue,
      cart: [],
      wishlist: []
    };

    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, user).subscribe(() => this.router.navigate(['/dash-adm/users']));
    } else {
      this.userService.addUser(user).subscribe(() => this.router.navigate(['/dash-adm/users']));
    }
  }

  goBack() {
    this.router.navigate(['/dash-adm/users']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Invalid email address';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.getError('minlength').requiredLength;
      return `Minimum ${requiredLength} characters`;
    }
    return '';
  }
} 