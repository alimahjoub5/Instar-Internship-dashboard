import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Upload3DComponent } from './upload-3d.component';

@Component({
  selector: 'app-consult-product',
  imports: [
    CommonModule,
    Upload3DComponent
  ],
  templateUrl: './consult-product.html',
  styleUrl: './consult-product.css'
})
export class ConsultProductComponent {
  product = {
    name: 'Sample Product',
    reference: 'REF123',
    description: 'A sample product for demonstration.',
    price: 99.99,
    category: 'Electronics',
    subCategory: 'Gadgets',
    supplier: 'Supplier Inc.',
    promotion: true,
    sales: 150,
    rate: 4.5,
    dimensions: {
      height: 10,
      width: 20,
      length: 30,
      radius: null
    },
    image: 'https://via.placeholder.com/300'
  };
  isLoading = false;
  error: string | null = null;
  product3DId = 'mocked-3d-id'; // Remplace par l'id réel du produit 3D si besoin

  goBack() {
    // For now, just log. In a real app, use router navigation.
    console.log('Back to list');
  }
}
