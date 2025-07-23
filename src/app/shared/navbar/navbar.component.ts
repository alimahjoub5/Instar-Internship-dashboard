import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user: any) => {
          this.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
          this.userEmail = user.email || '';
        },
        error: (error: any) => {
          console.error('Error loading user info:', error);
          this.userName = 'User';
          this.userEmail = '';
        }
      });
    }
  }

  logout() {
    this.userService.removeToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
} 