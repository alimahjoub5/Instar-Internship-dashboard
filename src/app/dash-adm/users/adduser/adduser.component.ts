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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.isEdit = true;
      this.userService.getUserById(this.userId).subscribe(user => {
        this.userForm.patchValue(user);
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const user: User = this.userForm.value;
    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, user).subscribe(() => this.router.navigate(['/users']));
    } else {
      this.userService.addUser(user).subscribe(() => this.router.navigate(['/users']));
    }
  }

  goBack() {
    this.router.navigate(['/users']);
  }
} 