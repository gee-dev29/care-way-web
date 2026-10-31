import { Component, inject, Input } from '@angular/core';
import { IonContent, IonText, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { Location } from '@angular/common';

@Component({
  selector: 'ui-request-card',
  imports: [IonContent, IonText, ButtonComponent, ConfirmationModal, IonIcon],
  templateUrl: './request-card.html',
  styleUrl: './request-card.css',
})
export class RequestCard {
  private router = inject(Router);
  private location = inject(Location);
  @Input() route: string;
  @Input() trackColor: string;
  @Input() cardBg: string;
  @Input() buttonBg: string;
  @Input() background: string;
  open = false;
  request = {
    trackingId: 'XH457Q1',
    type: 'Request',
    testType: 'X-ray test',
    doctor: 'Adefarati Joseph',
    date: 'Oct 20, 2025',
    hospital: 'Emmanuel Hospital',
    patient: 'Adigun Grace',
    product: 'Whole blood',
    bloodType: 'B+',
    quantity: 2,
    price: 100,
  };
  constructor() {
    addIcons({
      chevronBack,
    });
  }

  goBack() {
    this.location.back();
  }

  proceed() {
    this.router.navigateByUrl(this.route);
  }
  continue() {
    this.open = !this.open;
  }

  dismiss(value: boolean) {
    this.open = value;
  }
  no() {
    this.open = !this.open;
  }
  yes() {
    //
  }
}
