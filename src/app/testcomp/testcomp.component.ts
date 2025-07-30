import { Component } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
@Component({
  selector: 'app-testcomp',
  imports: [],
  templateUrl: './testcomp.component.html',
  styleUrl: './testcomp.component.css'
})
export class TestcompComponent {
  products: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('Component initialized');
    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.products = products;
      console.log('Products fetched:', this.products);
    });
  }

}
