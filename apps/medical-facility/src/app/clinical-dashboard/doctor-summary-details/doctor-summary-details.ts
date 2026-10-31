import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { SummaryDetalilsCardOne } from '@healbridge/ui';
import { ButtonComponent } from '@healbridge/ui';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'medical-facility-doctor-summary-details',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    SummaryDetalilsCardOne,
    ButtonComponent,
  ],
  templateUrl: './doctor-summary-details.html',
  styleUrl: './doctor-summary-details.css',
})
export class DoctorSummaryDetails implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  professionalId: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
    });
  }
  constructor() {
    addIcons({ 'chevron-back-outline': chevronBackOutline });
  }

  doctorDetails = [
    { label: 'Name', value: 'Adefarati Joseph' },
    { label: 'Address', value: 'No. 24, Agbabiaka street, Ketu, Lagos' },
    { label: 'Phone No', value: '08135647281' },
    { label: 'Cadre', value: 'Consultant' },
    { label: 'Specialization', value: 'Cardiologist' },
  ];

  licenseDetails = [
    { label: 'License Start Date', value: '2025-10-25' },
    { label: 'License End Date', value: '2026-10-26' },
    { label: 'License No', value: 'MDCN/233456/H/352' },
  ];

  editDetails(what: string) {
    if (what === 'detail') {
      this.router.navigate(['dashboard/add-doctor', this.professionalId]);
    } else {
      this.router.navigate(['dashboard/add-doctor', this.professionalId, 2]);
    }
  }

  previewLicense() {
    console.log('Previewing license...');
  }

  goBack() {
    this.router.navigateByUrl('dashboard/doctors');
  }

  sendVerification() {
    console.log('sending verification....');
  }
}
