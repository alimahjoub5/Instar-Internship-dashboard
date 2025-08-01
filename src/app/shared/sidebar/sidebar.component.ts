import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
export class SidebarComponent {
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/dash-adm/dashboard' },
    { label: 'Users', route: '/dash-adm/users' },
    { label: 'Products', route: '/dash-adm/products' },
    { label: 'Catégories', route: '/dash-adm/categories' },
    { label: 'Sous-catégories', route: '/dash-adm/subcategories' },
    { label: 'Suppliers', route: '/dash-adm/suppliers' },
    { label: 'Subscriptions', route: '/dash-adm/subscriptions' },
    { label: 'Settings', route: '/dash-adm/settings' },
    { label: 'Logout', route: '/login' }
  ];
  @Input() currentView: string = 'dashboard';

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
} 