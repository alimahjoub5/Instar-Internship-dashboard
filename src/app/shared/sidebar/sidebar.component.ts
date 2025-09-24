import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService, QuickStats } from '../services/dashboard.service';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/dash-adm/dashboard' },
    { label: 'Users', route: '/dash-adm/users' },
    { label: 'Products', route: '/dash-adm/products' },
    { label: 'Catégories', route: '/dash-adm/categories' },
    { label: 'Sous-catégories', route: '/dash-adm/subcategories' },
    { label: 'Suppliers', route: '/dash-adm/suppliers' },
    { label: 'Subscriptions', route: '/dash-adm/subscriptions' },
    { label: 'Subscription Plans', route: '/dash-adm/subscriptions/plans' },
    { label: 'Grace Period', route: '/dash-adm/subscriptions/grace-period' },
    { label: 'Settings', route: '/dash-adm/settings' },
    { label: 'Logout', route: '/login' }
  ];
  @Input() currentView: string = 'dashboard';

  quickStats: QuickStats | null = null;

  constructor(private router: Router, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadQuickStats();
  }

  loadQuickStats(): void {
    this.dashboardService.getQuickStats().subscribe({
      next: (stats) => {
        this.quickStats = stats;
      },
      error: (error) => {
        console.error('Error loading quick stats:', error);
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  getItemIcon(label: string): string {
    const iconMap: { [key: string]: string } = {
      'Dashboard': '📊',
      'Users': '👥',
      'Products': '📦',
      'Catégories': '📁',
      'Sous-catégories': '📂',
      'Suppliers': '🏭',
      'Subscriptions': '💳',
      'Subscription Plans': '📋',
      'Grace Period': '⏳',
      'Expiration Management': '⏰',
      'Settings': '⚙️',
      'Logout': '🚪'
    };
    return iconMap[label] || '📄';
  }
} 