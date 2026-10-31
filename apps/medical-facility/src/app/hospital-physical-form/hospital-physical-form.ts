import { Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConversionService, Specialization } from '@healbridge/shared';
import { AppointmentForm, Item } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-hospital-physical-form',
  imports: [AppointmentForm, IonContent],
  templateUrl: './hospital-physical-form.html',
  styleUrl: './hospital-physical-form.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalPhysicalForm {
  private router = inject(Router);
  private conversion = inject(ConversionService);
  @Input() Specialization: any;
  selectedTime: any;
  date: any;
  time: any;
  notes: any;

  doctors: Item[] = [];

  ngOnInit(): void {
    this.conversion.convert(Specialization, this.doctors);
  }
  selectTime(time: string) {
    this.selectedTime = time;
  }

  goBack() {
    this.router.navigateByUrl('dashboard/patient-profile');
  }
  proceed() {}
}
