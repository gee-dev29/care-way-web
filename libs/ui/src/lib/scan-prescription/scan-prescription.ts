import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, cameraOutline, pulse, recordingOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-scan-prescription',
  imports: [IonContent, IonText, IonIcon],
  templateUrl: './scan-prescription.html',
  styleUrl: './scan-prescription.css',
})
export class ScanPrescription implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  isSymptoms = false;
  module: string | null;

  constructor() {
    addIcons({ cameraOutline, recordingOutline, add, pulse });
  }

  ngOnInit() {
    this.isSymptoms = this.router.url.includes('scan-symptoms');
    this.activatedRoute.params.subscribe((params: any) => {
      this.module = params.module;
    });
  }

  openScanner() {
    if (this.isSymptoms) {
      if (this.module) {
        this.router.navigateByUrl('/dashboard/upload-symptoms/' + this.module);
        return;
      }
      this.router.navigateByUrl('/upload-symptoms');
    } else {
      this.router.navigateByUrl('/dashboard/upload-prescription');
    }
  }
  goBack() {
    if (this.module) {
      this.router.navigateByUrl('/dashboard/vitals/symptoms/' + this.module);
      return;
    }
    this.router.navigateByUrl('add-symptoms');
  }
  skip() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/symptoms-details/' + this.module
      );
      return;
    }
    this.router.navigateByUrl('/symptoms-details');
  }
}
