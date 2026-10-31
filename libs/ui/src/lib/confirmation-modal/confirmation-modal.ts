import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonModal, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-confirmation-modal',
  imports: [IonModal, IonImg],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModal {
  @Input() heading: string;
  @Input() loading=false;
  @Input() background: string;
  @Input() open: boolean;
  @Input() normal= false;
  @Output() no = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<boolean>();
}
