import { Component } from '@angular/core';
import { FnFooter } from '../fn-footer/fn-footer';
import { Sidebar } from '../sidebar/sidebar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FnFooter, Sidebar, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // Mock product data
  products = [
    { name: 'Laptop', sales: 120, category: 'Electronics', rating: 4.5 },
    { name: 'Book', sales: 80, category: 'Books', rating: 4.0 },
    { name: 'Phone', sales: 150, category: 'Electronics', rating: 4.7 },
    { name: 'Shoes', sales: 60, category: 'Fashion', rating: 4.2 },
    { name: 'Watch', sales: 40, category: 'Fashion', rating: 4.1 },
  ];

  // Statistics
  totalProducts = this.products.length;
  totalSales = this.products.reduce((sum, p) => sum + p.sales, 0);
  avgRating = (this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length).toFixed(2);

  // Chart data
  salesData = this.products.map(p => ({ name: p.name, value: p.sales }));
  categoryData = Object.values(
    this.products.reduce((acc, p) => {
      acc[p.category] = acc[p.category] || { name: p.category, value: 0 };
      acc[p.category].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  view: [number, number] = [400, 200];
  colorScheme = 'vivid';
}
