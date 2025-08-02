import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  private dataSubject = new BehaviorSubject<ConfirmationData | null>(null);
  private confirmSubject = new BehaviorSubject<boolean | null>(null);

  visible$: Observable<boolean> = this.visibleSubject.asObservable();
  data$: Observable<ConfirmationData | null> = this.dataSubject.asObservable();
  
  constructor() {}

  /**
   * Open the confirmation dialog
   * @param data The confirmation dialog data
   * @returns Promise that resolves to true if confirmed, false if canceled
   */
  confirm(data: ConfirmationData): Promise<boolean> {

    const confirmationData: ConfirmationData = {
      ...data,
      confirmText: data.confirmText || 'Confirm',
      cancelText: data.cancelText || 'Cancel',
      type: data.type || 'info'
    };

    this.dataSubject.next(confirmationData);
    this.visibleSubject.next(true);
    this.confirmSubject.next(null); 

    return new Promise<boolean>((resolve) => {
      const subscription = this.confirmSubject.subscribe(result => {
        if (result !== null) {
          resolve(result);
          subscription.unsubscribe();
        }
      });
    });
  }

  /**
   * Close the confirmation dialog with a result
   * @param confirmed Whether the action was confirmed
   */
  close(confirmed: boolean): void {
    this.visibleSubject.next(false);
    this.confirmSubject.next(confirmed);
  }
}