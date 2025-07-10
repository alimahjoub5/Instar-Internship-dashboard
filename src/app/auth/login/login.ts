import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  showPassword: boolean = false;

  private router = inject(Router);

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['/dash-adm']);
    } else if (this.username === 'fournisseur' && this.password === 'fournisseur') {
      this.router.navigate(['/dash-fn']);
    } else {
      this.error = 'Invalid username or password';
    }
  }
} 