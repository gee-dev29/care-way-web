import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal, IonImg } from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-otp-confirmation-page',
  imports: [IonModal, IonImg, ButtonComponent],
  templateUrl: './otp-confirmation-page.html',
  styleUrl: './otp-confirmation-page.css',
})
export class OtpConfirmationPage {
  @Input() open = false;
  @ViewChild('modal') modal: IonModal;
  @Output() continue = new EventEmitter();
  canDismiss = false;

  async proceed() {
    this.canDismiss = true;
    await this.modal.dismiss(null, 'continue');
    this.continue.emit();
  }
}
