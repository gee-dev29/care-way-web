import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DesktopButton } from '../desktop-button/desktop-button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'ui-delete-modal',
  imports: [CommonModule, DesktopButton, DialogModule],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css',
})
export class DeleteModal {
  @Input() visibility = false;
  @Output() proceed = new EventEmitter();
  @Input() message: string;
  @Input() color: string;
  @Input() selectedWidth: string;
  @Input() selectedHeight: string;

  cancel() {
    this.visibility = false;
  }

  continue() {
    this.proceed.emit();
    this.visibility = false;
  }

  openModal() {
    this.visibility = !this.visibility;
  }
}
