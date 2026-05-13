import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  title = 'Confirm Action';
  message = 'Are you sure you want to proceed?';
  confirmText = 'Confirm';
  cancelText = 'Cancel';
  isVisible = false;

  private resolvePromise?: (value: boolean) => void;

  open(
    options: {
      title?: string;
      message?: string;
      confirmText?: string;
      cancelText?: string;
    } = {},
  ): Promise<boolean> {
    this.title = options.title || 'Confirm Action';
    this.message = options.message || 'Are you sure you want to proceed?';
    this.confirmText = options.confirmText || 'Confirm';
    this.cancelText = options.cancelText || 'Cancel';
    this.isVisible = true;

    return new Promise((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  confirm() {
    this.isVisible = false;
    if (this.resolvePromise) {
      this.resolvePromise(true);
    }
  }

  cancel() {
    this.isVisible = false;
    if (this.resolvePromise) {
      this.resolvePromise(false);
    }
  }
}
