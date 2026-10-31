import { Component, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { MedFacilityDetailCard } from '../med-facility-detail-card/med-facility-detail-card';
import { AppointmentCard } from '../appointment-card/appointment-card';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, MedicalAppointmentStatus } from '@care-way/api';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'agency-all-appointments',
  imports: [
    IonContent,
    IonIcon,
    MedFacilityDetailCard,
    AppointmentCard,
    AsyncPipe,
  ],
  templateUrl: './all-appointments.html',
  styleUrl: './all-appointments.css',
})
export class AllAppointments {
  private router = inject(Router);
  private actRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  appointments: any[] = [];
  facilityId: string;
  facilityTypeId!: string;
  medDetails$!: Observable<any>;

  ionViewWillEnter() {
    this.actRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.getFacility(this.facilityId);
      this.getMedicalAppointments(this.facilityTypeId);
    });
  }
  constructor() {
    addIcons({ chevronBackOutline });
  }

  getFacility(facilityId: string) {
    this.medDetails$ = this.api.getFacility({
      facilityId: facilityId,
    });
  }

  routeTo() {
    this.router.navigate(['/dashboard/med-facilities', this.facilityId]);
  }

  getMedicalAppointments(facilityTypeId: string) {
    this.api
      .getMedicalAppointments({
        facilityTypeId: facilityTypeId,
        status: MedicalAppointmentStatus.Confirmed,
        limit: 1000,
      })
      .subscribe((response: any) => {
        this.appointments = response?.data ?? [];
      });
  }
}
