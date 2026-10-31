import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-laboratory-details',
  imports: [
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonSkeletonText,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './laboratory-details.html',
  styleUrl: './laboratory-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LaboratoryDetails {
  loading = false;
  label = 'Request for Costing';
  loaded = false;

  private router = inject(Router);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  }

  goBack() {
    this.router.navigateByUrl('laboratory');
  }

  requestCosting() {
    this.loading = true;
    this.label = 'Please Wait';
    setTimeout(() => {
      this.label = 'Request for Costing';
      this.loading = false;
      this.router.navigateByUrl('/');
    }, 5000);
  }
}
