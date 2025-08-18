import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-sidebarfn',
  standalone: true,
  imports: [
    MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule,
    MatListModule, MatFormFieldModule, MatInputModule, MatMenuModule,
    RouterModule, CommonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  showFiller = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // No need to subscribe to AuthService for vendor users
    // Data will be retrieved from sessionStorage
  }



  getUserName(): string {
    // Get supplier name from sessionStorage
    const supplierName = sessionStorage.getItem('supplierName');
    return supplierName || 'User';
  }

  getUserAvatar(): string {
    // Get supplier image from sessionStorage
    const supplierImage = sessionStorage.getItem('supplierImage');
    return supplierImage || 'assets/logo.png';
  }

  logout() {
    // Clear supplier data from sessionStorage
    sessionStorage.removeItem('supplierName');
    sessionStorage.removeItem('supplierImage');
    this.authService.logout();
  }
}
