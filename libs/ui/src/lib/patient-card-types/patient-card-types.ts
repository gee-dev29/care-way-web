/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonText,
  IonIcon,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../toast';
import { PlusIconComponent } from '@care-way/ui';

@Component({
  selector: 'ui-patient-card-types',
  imports: [
    IonText,
    CommonModule,
    IonIcon,
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    ButtonComponent,
    PlusIconComponent,
  ],
  templateUrl: './patient-card-types.html',
  styleUrl: './patient-card-types.css',
})
export class PatientCardTypes implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  @Input() api: any;
  @Input() facilityType: string;
  @Input() FacilityType: any;
  @Input() route: string;
  @Input() backRoute: string;
  @Input() navigateTo: string;

  facilityId: string;
  pharmacyId: string;
  loading = false;

  edit = '';
  label = 'Continue';

  cardTypeSelected: any[] = [];
  cardTypes: any[] = [];

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.getCardTypes();
    });
  }
  addMore() {
    this.router.navigateByUrl(this.route);
  }

  goback() {
    this.router.navigateByUrl(this.backRoute);
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    this.router.navigateByUrl(this.navigateTo);
    this.toast.show(`${this.facilityType} onboarded successfully`, 'success');
  }

  getCardTypes() {
    this.api
      .getFacilityTypeMembershipCardTypes({
        facilityTypeId: this.pharmacyId,
      })
      .subscribe((response: any) => {
        this.cardTypes = response;
      });
  }

  checkIfAnyIsEmpty(): boolean {
    return this.cardTypes.some((c) => c.check === true);
  }
}
