import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SubscriptionService, SubscriptionPlan } from '../../../shared/services/subscription.service';
import { SupplierService, Supplier } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-create-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.css']
})
export class CreateSubscriptionComponent implements OnInit {
  subscriptionForm: FormGroup;
  suppliers: Supplier[] = [];
  subscriptionPlans: SubscriptionPlan[] = [];
  isLoading = false;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private supplierService: SupplierService,
    private router: Router
  ) {
    this.subscriptionForm = this.fb.group({
      supplierId: ['', Validators.required],
      planType: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      autoRenew: [false]
    });
  }

  ngOnInit() {
    this.loadSuppliers();
    this.loadSubscriptionPlans();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        console.log('📋 Loaded suppliers:', suppliers);
        this.suppliers = suppliers;
        // Check which suppliers already have active subscriptions
        this.checkSuppliersWithActiveSubscriptions();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.errorMessage = 'Error loading suppliers';
      }
    });
  }

  checkSuppliersWithActiveSubscriptions() {
    this.suppliers.forEach(supplier => {
      this.subscriptionService.getSubscriptionsBySupplier(supplier._id!).subscribe({
        next: (subscriptions) => {
          const activeSubscription = subscriptions.find(sub => 
            sub.status === 'active' || sub.status === 'pending'
          );
          const cancelledSubscription = subscriptions.find(sub => 
            sub.status === 'cancelled'
          );
          
          if (activeSubscription) {
            console.log(`⚠️ Supplier ${supplier.name} already has active subscription`);
            supplier.hasActiveSubscription = true;
          } else if (cancelledSubscription) {
            console.log(`✅ Supplier ${supplier.name} has cancelled subscription - can create new one`);
            supplier.hasCancelledSubscription = true;
          }
        },
        error: (error) => {
          console.error('Error checking supplier subscriptions:', error);
        }
      });
    });
  }

  loadSubscriptionPlans() {
    this.subscriptionService.getAllSubscriptionPlans().subscribe({
      next: (plans) => {
        console.log('📋 Loaded subscription plans:', plans);
        this.subscriptionPlans = plans;
      },
      error: (error) => {
        console.error('Error loading subscription plans:', error);
        this.errorMessage = 'Error loading subscription plans';
      }
    });
  }

  getSelectedPlan(): SubscriptionPlan | undefined {
    const planType = this.subscriptionForm.get('planType')?.value;
    return this.subscriptionPlans.find(plan => plan.type === planType);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.subscriptionForm.valid) {
      this.isLoading = true;
      const subscriptionData = this.subscriptionForm.value;
      console.log('📝 Sending subscription data:', subscriptionData);

      this.subscriptionService.createSubscription(subscriptionData).subscribe({
        next: (subscription) => {
          this.successMessage = 'Subscription created successfully!';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/dash-adm/subscriptions']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating subscription:', error);
          if (error.error?.message === 'Supplier already has an active subscription') {
            this.errorMessage = 'This supplier already has an active subscription. Please cancel the existing subscription first or choose a different supplier.';
          } else if (error.error?.details) {
            this.errorMessage = `${error.error.message}: ${JSON.stringify(error.error.details)}`;
          } else {
            this.errorMessage = error.error?.message || 'Error creating subscription';
          }
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dash-adm/subscriptions']);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getPlanDescription(planType: string): string {
    const plan = this.subscriptionPlans.find(p => p.type === planType);
    return plan?.description || '';
  }

  getPlanFeatures(planType: string): any {
    const plan = this.subscriptionPlans.find(p => p.type === planType);
    return plan?.features || {};
  }

  checkExistingSubscription(supplierId: string) {
    this.subscriptionService.getSubscriptionsBySupplier(supplierId).subscribe({
      next: (subscriptions) => {
        const activeSubscription = subscriptions.find(sub => 
          sub.status === 'active' || sub.status === 'pending'
        );
        const cancelledSubscription = subscriptions.find(sub => 
          sub.status === 'cancelled'
        );
        
        if (activeSubscription) {
          this.errorMessage = `Warning: This supplier already has an active subscription (${activeSubscription.planType} plan).`;
        } else if (cancelledSubscription) {
          this.errorMessage = `Info: This supplier had a cancelled subscription. You can create a new subscription.`;
        } else {
          this.errorMessage = '';
        }
      },
      error: (error) => {
        console.error('Error checking existing subscriptions:', error);
      }
    });
  }
} 