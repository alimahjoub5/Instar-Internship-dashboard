import { Component } from '@angular/core';
import { FnFooter } from '../fn-footer/fn-footer';
import { Sidebar } from '../sidebar/sidebar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Product, ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FnFooter, Sidebar, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
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

      console.log('Processed dashboard data:', {
        totalProducts: this.totalProducts,
        totalSales: this.totalSales,
        avgRating: this.avgRating,
        salesData: this.salesData,
        categoryData: this.categoryData,
      });
    });
  }
}
