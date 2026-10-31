import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonImg,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-available-symptoms',
  imports: [
    IonContent,
    IonText,
    ButtonComponent,
    IonImg,
    IonIcon,
    IonSkeletonText,
  ],
  templateUrl: './available-symptoms.html',
  styleUrl: './available-symptoms.css',
})
export class AvailableSymptoms implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  loaded = false;
  module: string | null;
  symptoms = [
    { name: 'Eye Redness', date: '2025-11-10', time: '20:12am' },
    { name: 'Runny Nose', date: '2025-11-10', time: '20:12am' },
    { name: 'Shortness of Breath', date: '2025-11-10', time: '20:12am' },
  ];

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
    this.route.paramMap.subscribe((param: any) => {
      this.module = param.get('module');
    });
  }

  addSymptoms() {
    if (this.module) {
      this.router.navigateByUrl('/dashboard/vitals/symptoms/' + this.module);
      return;
    }
    this.router.navigateByUrl('add-symptoms');
  }
  continue() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/symptoms-details/' + this.module
      );
      return;
    }
    this.router.navigateByUrl('symptoms-details');
  }
}
