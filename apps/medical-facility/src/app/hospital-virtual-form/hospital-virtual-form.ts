import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AppointmentForm, Item } from '@healbridge/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'medical-facility-hospital-virtual-form',
  imports: [IonContent, AppointmentForm],
  templateUrl: './hospital-virtual-form.html',
  styleUrl: './hospital-virtual-form.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalVirtualForm {
  private router = inject(Router);
  @Input() Specialization: any;
  date: any;
  time: any;
  notes: any;
  doctors: Item[] = [];

  goBack() {
    this.router.navigateByUrl('dashboard/patient-profile');
  }

  proceed() {
    //
  }
}
