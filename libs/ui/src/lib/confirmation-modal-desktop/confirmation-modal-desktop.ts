/* eslint-disable @angular-eslint/no-output-native */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DesktopButton } from '../desktop-button/desktop-button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'ui-confirmation-modal-desktop',
  imports: [DesktopButton, DialogModule],
  templateUrl: './confirmation-modal-desktop.html',
  styleUrl: './confirmation-modal-desktop.css',
})
export class ConfirmationModalDesktop {
  @Input() visibility = false;
  @Output() proceed = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() message: string;
  @Input() selectedWidth: string;
  @Input() loading: boolean;
  @Output() visibilityChange = new EventEmitter();

  continue() {
    this.proceed.emit();
    this.visibility = false;
  }

  close() {
    this.visibility = false;
    this.visibilityChange.emit(this.visibility);
  }
}
