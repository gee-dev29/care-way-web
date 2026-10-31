import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SummaryDetailCard } from '@healbridge/ui';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-appointment-summary-details',
  imports: [IonContent, SummaryDetailCard],
  templateUrl: './appointment-summary-details.html',
  styleUrl: './appointment-summary-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentSummaryDetails {
  private router = inject(Router);

  activeItems: string[] = [];

  items = [
    { key: 'vitals', label: 'Vitals' },
    { key: 'prescription', label: 'Prescription' },
    { key: 'lab', label: 'Lab Test' },
    { key: 'radiology', label: 'Imaging/Radiology' },
    { key: 'blood', label: 'Blood Bank' },
  ];

  constructor() {
    addIcons({
      chevronDownOutline,
      chevronForwardOutline,
    });
  }

  goBack() {
    this.router.navigateByUrl('dashboard/patient-profile');
  }

  toggleTab(key: string) {
    switch (key) {
      case 'vitals':
      case 'prescription':
      case 'lab':
      case 'radiology':
      case 'blood':
        if (this.activeItems.includes(key)) {
          this.activeItems = this.activeItems.filter((i) => i !== key);
        } else {
          this.activeItems = [...this.activeItems, key];
        }
        break;
      default:
    }
  }
  isOpen(key: string): boolean {
    return this.activeItems.includes(key);
  }
}
