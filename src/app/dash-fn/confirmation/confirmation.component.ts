import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationData } from '../../shared/services/confirmation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  visible = false;
  data: ConfirmationData | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    // Subscribe to visibility changes
    this.subscriptions.push(
      this.confirmationService.visible$.subscribe(visible => {
        this.visible = visible;
        // Add a small delay for animation when showing
        if (visible) {
          setTimeout(() => document.querySelector('.confirmation-dialog')?.classList.add('show'), 10);
        }
      })
    );

    // Subscribe to data changes
    this.subscriptions.push(
      this.confirmationService.data$.subscribe(data => {
        this.data = data;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Confirm the action
   */
  confirm(): void {
    if (this.visible) {
      this.hideDialog();
      setTimeout(() => this.confirmationService.close(true), 300); // Match transition duration
    }
  }

  /**
   * Cancel the action
   */
  cancel(): void {
    if (this.visible) {
      this.hideDialog();
      setTimeout(() => this.confirmationService.close(false), 300); // Match transition duration
    }
  }

  /**
   * Hide the dialog with animation
   */
  private hideDialog(): void {
    const dialog = document.querySelector('.confirmation-dialog');
    dialog?.classList.remove('show');
  }

  /**
   * Prevent clicks inside the dialog from closing it
   */
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}