import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType } from '@healbridge/shared';
import { SharedEmptyBank } from '@healbridge/ui';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'medical-facility-laboratory-empty-bank',
  imports: [CommonModule, SharedEmptyBank, IonContent],
  templateUrl: './laboratory-empty-bank.html',
  styleUrl: './laboratory-empty-bank.css',
})
export class LaboratoryEmptyBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Laboratory;
  FacilityType = FacilityType;
  laboratoryId: string;
  route: string;
  backRoute: string;
  bankRoute: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-add-bank`;
      this.backRoute = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-upload`;
      this.bankRoute = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-empty-address`;
    });
  }
}
