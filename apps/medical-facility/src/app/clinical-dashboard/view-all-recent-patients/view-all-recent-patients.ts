import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
@Component({
  standalone: true,
  selector: 'medical-facility-view-all-recent-patients',
  imports: [IonContent, IonList, IonIcon, IonText],
  templateUrl: './view-all-recent-patients.html',
  styleUrl: './view-all-recent-patients.css',
})
export class ViewAllRecentPatients {
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
    });
  }
  router = inject(Router);
  recentPatients = [
    {
      image: '/images/female-profile1.svg',
      name: 'Olivia Johnson',
      gender: 'Female',
      age: 42,
      lastVisit: '12, oct, 2025',
      asignedDoctor: 'Dr. F Okafor',
    },
    {
      image: '/images/female-profile2.svg',
      name: 'Angelina Jolie',
      gender: 'Female',
      age: 56,
      lastVisit: '12, oct, 2025',
      asignedDoctor: 'Dr. M Marufu',
    },
  ];

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
