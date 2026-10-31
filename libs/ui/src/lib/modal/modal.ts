import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'ui-modal',
  imports: [CommonModule, DialogModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() visibility: boolean;
  @Input() header: string;
  @Input() selectedWidth: string;
  @Output() visibilityChange = new EventEmitter();

  close() {
    this.visibilityChange.emit(this.visibility);
  }
}
