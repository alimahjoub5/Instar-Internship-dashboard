import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductService } from '../../shared/services/product.service';
import { curveCardinal } from 'd3-shape';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatIconModule],
  templateUrl: './dashboard-content.html',
  styleUrl: './dashboard-content.css'
})
export class DashboardContent implements OnInit {
  products: Product[] = [];

  // Enhanced Statistics
  totalProducts = 0;
  totalSales = 0;
  avgRating = '0.00';
  avgPrice = 0;
  minPrice = 0;
  maxPrice = 0;
  promotionPercentage = 0;
  promotedProducts = 0;
  totalSuppliers = 0;
  topSupplier = '';
  newProductsThisMonth = 0;
  salesGrowth = 0;
  totalReviews = 0;

  // Chart Data
  salesData: any[] = [];
  categoryData: any[] = [];
  ratingData: any[] = [];
  priceRangeData: any[] = [];
  supplierData: any[] = [];
  salesTrendData: any[] = [];
  promotionImpactData: any[] = [];
  inventoryData: any[] = [];

  // Chart Configuration
  curve = curveCardinal;
  colorScheme: any = {
    domain: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
  };
  ratingColorScheme: any = {
    domain: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#451a03']
  };
  priceColorScheme: any = {
    domain: ['#10b981', '#059669', '#047857', '#065f46']
  };
  supplierColorScheme: any = {
    domain: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a']
  };
  trendColorScheme: any = {
    domain: ['#8b5cf6', '#7c3aed']
  };
  promotionColorScheme: any = {
    domain: ['#ef4444', '#dc2626']
  };
  inventoryColorScheme: any = {
    domain: ['#06b6d4', '#0891b2', '#0e7490', '#155e75']
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.calculateStatistics();
      this.generateChartData();
    });
  }

  private calculateStatistics() {
    this.totalProducts = this.products.length;
    this.totalSales = this.products.reduce((sum, p) => sum + (p.sales || 0), 0);
    
    const ratings = this.products.map(p => p.rate || 0).filter(r => r > 0);
    this.avgRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : '0.0';
    this.totalReviews = ratings.length;

    const prices = this.products.map(p => p.price || 0).filter(p => p > 0);
    this.avgPrice = prices.length
      ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
      : 0;
    this.minPrice = prices.length ? Math.min(...prices) : 0;
    this.maxPrice = prices.length ? Math.max(...prices) : 0;

    const promotedProducts = this.products.filter(p => p.promotion);
    this.promotedProducts = promotedProducts.length;
    this.promotionPercentage = this.totalProducts
      ? Math.round((promotedProducts.length / this.totalProducts) * 100)
      : 0;

    const suppliers = [...new Set(this.products.map(p => p.supplier).filter(s => s))];
    this.totalSuppliers = suppliers.length;
    
    // Find top supplier by product count
    const supplierCounts = this.products.reduce((acc, p) => {
      if (p.supplier) {
        acc[p.supplier] = (acc[p.supplier] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    this.topSupplier = Object.entries(supplierCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Mock data for demonstration
    this.newProductsThisMonth = Math.floor(this.totalProducts * 0.1);
    this.salesGrowth = Math.floor(Math.random() * 20) + 5;
  }

  private generateChartData() {
    // Sales by Product (top 10)
    this.salesData = this.products
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 10)
      .map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        value: p.sales || 0
      }));

    // Products by Category
    this.categoryData = Object.values(
      this.products.reduce((acc, p) => {
        const category = p.category || 'Uncategorized';
        acc[category] = acc[category] || { name: category, value: 0 };
        acc[category].value += 1;
        return acc;
      }, {} as Record<string, { name: string; value: number }>)
    );

    // Rating Distribution
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
      name: `${rating} Star${rating > 1 ? 's' : ''}`,
      value: this.products.filter(p => Math.floor(p.rate || 0) === rating).length
    }));
    this.ratingData = ratingCounts.filter(r => r.value > 0);

    // Price Range Distribution
    const priceRanges = [
      { name: '$0-25', min: 0, max: 25 },
      { name: '$26-50', min: 26, max: 50 },
      { name: '$51-100', min: 51, max: 100 },
      { name: '$101+', min: 101, max: Infinity }
    ];
    
    // Area chart requires series format
    this.priceRangeData = [{
      name: 'Products',
      series: priceRanges.map(range => ({
        name: range.name,
        value: this.products.filter(p => 
          (p.price || 0) >= range.min && (p.price || 0) <= range.max
        ).length
      })).filter(r => r.value > 0)
    }];

    // Supplier Performance (top 5)
    const supplierStats = Object.entries(
      this.products.reduce((acc, p) => {
        if (p.supplier) {
          acc[p.supplier] = acc[p.supplier] || { products: 0, sales: 0 };
          acc[p.supplier].products += 1;
          acc[p.supplier].sales += p.sales || 0;
        }
        return acc;
      }, {} as Record<string, { products: number; sales: number }>)
    ).slice(0, 5);

    this.supplierData = supplierStats.map(([supplier, stats]) => ({
      name: supplier.length > 10 ? supplier.substring(0, 10) + '...' : supplier,
      series: [
        { name: 'Products', value: stats.products },
        { name: 'Sales', value: stats.sales }
      ]
    }));

    // Mock Sales Trend Data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    this.salesTrendData = [{
      name: 'Sales',
      series: months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 100) + 50
      }))
    }];

    // Promotion Impact
    this.promotionImpactData = [
      { name: 'Promoted Products', value: this.promotedProducts },
      { name: 'Regular Products', value: this.totalProducts - this.promotedProducts }
    ];

    // Inventory Status by Category
    this.inventoryData = this.categoryData.map(cat => ({
      name: cat.name,
      value: cat.value * 10 // Mock inventory multiplier
    }));
  }
}