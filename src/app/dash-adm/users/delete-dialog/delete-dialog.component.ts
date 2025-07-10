import { Component } from '@angular/core';
import { MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent
],
  templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required]
    });
  }

  confirm() {
    if (this.form.value.password === '1234') {
      this.dialogRef.close('confirmed');
    } else {
      this.dialogRef.close('cancelled');
    }
  }
} 