import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonCard,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-glucose-type',
  imports: [IonContent, IonIcon, IonCard, IonList],
  templateUrl: './glucose-type.html',
  styleUrl: './glucose-type.css',
})
export class GlucoseType implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  module: string | null;
  memberId: string | null;
  professionalId: string | null;
  appointmentId: string | null;
  glucoseDatas = [
    {
      id: '1',
      title: 'Fasting',
      subtitle: 'Before any food',
    },
    {
      id: '2',
      title: 'Random',
      subtitle: 'Anytime of a Day',
    },
    {
      id: '3',
      title: 'Oral Glucose Tolerance Test',
      subtitle: 'After glucose drink any food',
    },
    {
      id: '4',
      title: 'Post-Prandial',
      subtitle: '2 hours after a meal',
    },
  ];
    facilityType: any;
  facilityId: any;
  facilityTypeId: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.module = params.get('module');
      this.professionalId = params.get('professionalId');
      this.memberId = params.get('memberId');
      this.appointmentId = params.get('appointmentId');
      this.facilityId = params.get('facilityId');
      this.facilityTypeId = params.get('facilityTypeId');
      this.facilityType = params.get('facilityType');
    });
  }

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
      'chevron-back-outline': chevronBackOutline,
    });
  }

  navigateTo(title: string) {
    let routeName;
    if (title === 'Oral Glucose Tolerance Test') {
      routeName = 'OGTT';
    } else {
      routeName = title;
    }

    if (this.module && title === 'Post-Prandial') {
      return this.router.navigateByUrl(
        `/dashboard/vitals/post-prandial/${this.module}`
      );
    }
    if (this.module && title === 'Oral Glucose Tolerance Test') {
      return this.router.navigateByUrl(`/dashboard/vitals/ogtt/${this.module}`);
    }

    if (this.module) {
      return this.router.navigateByUrl(
        `/dashboard/vitals/glucose-record/${routeName}/${this.module}`
      );
    }
    if (this.router.url.includes('nurse-dashboard')) {
      return this.router.navigateByUrl(
        `nurse-dashboard/${this.professionalId}/add-${routeName}/${this.appointmentId}/${this.memberId}`
      );
    } else if (this.professionalId !== null) {
      return this.router.navigateByUrl(
        `doctor-dashboard/${this.professionalId}/add-${routeName}/${this.appointmentId}/${this.memberId}`
      );
    } else {
      return this.router.navigateByUrl(
        `dashboard/add-${routeName}/${this.facilityType}/${this.facilityId}/${this.facilityTypeId}/${this.appointmentId}/${this.memberId}`
      );
    }
  }

  goBack() {
    if (this.module) {
      this.router.navigateByUrl(`/dashboard/vitals`);
    } else if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'view-appointment',
        this.appointmentId,
        this.memberId,
      ]);
    } else if (this.professionalId) {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'view-appointment',
        this.appointmentId,
        this.memberId,
      ]);
    } else {
     this.router.navigate([
        'dashboard/view-appointment',
        this.facilityType,
        this.facilityId,
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
    }
  }
}
