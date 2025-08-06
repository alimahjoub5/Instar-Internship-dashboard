import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Product, ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard-content.html',
  styleUrl: './dashboard-content.css'
})
export class DashboardContent implements OnInit {
  products: Product[] = [];

  totalProducts = 0;
  totalSales = 0;
  avgRating = '0.00';
  salesData: any[] = [];
  categoryData: any[] = [];

  view: [number, number] = [400, 200];
  colorScheme = 'vivid';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;

      this.totalProducts = this.products.length;
      this.totalSales = this.products.reduce((sum, p) => sum + (p.sales || 0), 0);
      this.avgRating = this.products.length
        ? (this.products.reduce((sum, p) => sum + (p.rating || 0), 0) / this.products.length).toFixed(2)
        : '0.00';

      this.salesData = this.products.map(p => ({
        name: p.name,
        value: p.sales || 0
      }));

      this.categoryData = Object.values(
        this.products.reduce((acc, p) => {
          acc[p.category] = acc[p.category] || { name: p.category, value: 0 };
          acc[p.category].value += 1;
          return acc;
        }, {} as Record<string, { name: string; value: number }>)
      );
    });
  }
}