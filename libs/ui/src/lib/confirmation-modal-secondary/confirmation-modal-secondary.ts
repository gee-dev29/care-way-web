import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-confirmation-modal-secondary',
  imports: [IonModal, IonImg],
  templateUrl: './confirmation-modal-secondary.html',
  styleUrl: './confirmation-modal-secondary.css',
})
export class ConfirmationModalSecondary {
  @ViewChild('modal') modalRef!: IonModal;
  @Input() confirmationMessage: string;
  @Input() background: string;
  @Input() open: boolean;
  @Input() loading: boolean;
  @Output() no = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<boolean>();
  pendingAction: 'next' | 'no' | null = null;

  onConfirmClick() {
    if (this.loading) {
      return;
    }
    this.pendingAction = 'next';
    this.next.emit();
  }

  onCancelClick() {
    if (this.loading) {
      return;
    }
    this.pendingAction = 'no';
    this.modalRef.dismiss();
  }

  onDidDismiss() {
    if (this.pendingAction === 'no') {
      this.no.emit();
    } else if (this.pendingAction === null) {
      this.dismiss.emit(false);
    }
    this.pendingAction = null;
  }
}
