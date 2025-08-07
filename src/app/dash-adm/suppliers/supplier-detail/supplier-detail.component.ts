import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { SupplierService, Supplier } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.css']
})
export class SupplierDetailComponent implements OnInit {
  supplier: Supplier | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const supplierId = this.route.snapshot.paramMap.get('id');
    if (supplierId) {
      this.loadSupplier(supplierId);
    } else {
      this.errorMessage = 'Supplier ID not provided';
      this.isLoading = false;
    }
  }

  loadSupplier(id: string) {
    this.isLoading = true;
    this.supplierService.getSupplierById(id).subscribe({
      next: (supplier) => {
        this.supplier = supplier;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading supplier:', error);
        this.errorMessage = 'Error loading supplier details';
        this.isLoading = false;
      }
    });
  }

  onEdit() {
    if (this.supplier?._id) {
      this.router.navigate(['/dash-adm/suppliers/edit', this.supplier._id]);
    }
  }

  onDelete() {
    if (this.supplier?._id && confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(this.supplier._id).subscribe({
        next: () => {
          this.router.navigate(['/dash-adm/suppliers']);
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
          this.errorMessage = 'Error deleting supplier';
        }
      });
    }
  }

  onBack() {
    this.router.navigate(['/dash-adm/suppliers']);
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }
} 