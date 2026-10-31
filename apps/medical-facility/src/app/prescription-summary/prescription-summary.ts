import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@care-way/ui';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-prescription-summary',
  imports: [IonContent, IonIcon, ButtonComponent],
  templateUrl: './prescription-summary.html',
  styleUrl: './prescription-summary.css',
})
export class PrescriptionSummary {
  private router = inject(Router);

  requestForCosting() {
    this.router.navigateByUrl('/dashboard/patient-profile');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/patient-profile');
  }

  addDrug() {
    this.router.navigateByUrl('/dashboard/add-drug');
  }
  editDrug() {
    this.router.navigateByUrl('/dashboard/add-drug');
  }
}
