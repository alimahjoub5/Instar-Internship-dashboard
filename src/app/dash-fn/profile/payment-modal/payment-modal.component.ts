import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionPlan } from '../../../shared/services/subscription.service';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface PaymentData {
  planId: string;
  supplierId: string;
  planType: string;
  paymentMethod: string;
  autoRenew: boolean;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.css'
})
export class PaymentModalComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedPlan: SubscriptionPlan | null = null;
  @Input() supplierId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmPayment = new EventEmitter<PaymentData>();

  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: 'credit_card',
      description: 'Pay securely with your credit or debit card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'account_balance_wallet',
      description: 'Pay with your PayPal account'
    }
  ];

  selectedPaymentMethod: string = 'credit-card';
  autoRenew: boolean = true;
  isProcessing: boolean = false;

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirm(): void {
    if (!this.selectedPlan || !this.supplierId) {
      return;
    }

    this.isProcessing = true;

    const paymentData: PaymentData = {
      planId: this.selectedPlan._id || '',
      supplierId: this.supplierId,
      planType: this.selectedPlan.type,
      paymentMethod: this.selectedPaymentMethod,
      autoRenew: this.autoRenew
    };

    this.confirmPayment.emit(paymentData);
  }

  resetProcessing(): void {
    this.isProcessing = false;
  }

  getSelectedPaymentMethodName(): string {
    const method = this.paymentMethods.find(m => m.id === this.selectedPaymentMethod);
    return method ? method.name : '';
  }
}