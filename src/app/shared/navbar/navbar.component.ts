import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  showUserMenu: boolean = false;
  showNotifications: boolean = false;
  isDarkMode: boolean = false;
  notificationCount: number = 0;
  notifications: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadNotifications();
  }

  loadUserInfo() {
    const userId = localStorage.getItem('userId');
    if (userId && userId !== 'undefined' && userId !== 'null') {
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
    } else {
      // Set default values if no user ID is available
      this.userName = 'User';
      this.userEmail = '';
    }
  }

  logout() {
    this.userService.removeToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  // New methods for enhanced navbar functionality
  getCurrentPageTitle(): string {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/dashboard')) return 'Dashboard';
    if (currentUrl.includes('/users')) return 'Utilisateurs';
    if (currentUrl.includes('/products')) return 'Produits';
    if (currentUrl.includes('/categories')) return 'Catégories';
    if (currentUrl.includes('/subcategories')) return 'Sous-catégories';
    if (currentUrl.includes('/suppliers')) return 'Fournisseurs';
    if (currentUrl.includes('/subscriptions')) return 'Abonnements';
    if (currentUrl.includes('/settings')) return 'Paramètres';
    if (currentUrl.includes('/profile-admin')) return 'Mon Profil';
    return 'Dashboard';
  }

  getUserInitials(): string {
    if (!this.userName) return 'U';
    const names = this.userName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.userName[0]?.toUpperCase() || 'U';
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false;
    }
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    // Add theme switching logic here
    document.body.classList.toggle('dark-theme');
  }

  // Load sample notifications (replace with real data)
  loadNotifications(): void {
    this.notifications = [
      {
        icon: '📊',
        title: 'Nouveau rapport disponible',
        message: 'Le rapport mensuel est maintenant disponible',
        time: 'Il y a 5 minutes'
      },
      {
        icon: '🔔',
        title: 'Système mis à jour',
        message: 'Le système a été mis à jour avec succès',
        time: 'Il y a 1 heure'
      }
    ];
    this.notificationCount = this.notifications.length;
  }
} 