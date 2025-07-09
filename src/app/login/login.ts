import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  showPassword: boolean = false;

  login() {
    // Basic login logic
    if (this.username === 'admin' && this.password === 'admin') {
      // redirect to admin
    } else if (this.username === 'fournisseur' && this.password === 'fournisseur') {
      // redirect to fournisseur
    } else {
      this.error = 'Invalid username or password';
    }
  }
} 