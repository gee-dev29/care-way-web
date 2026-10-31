import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ReferralType } from '@care-way/api';
import { CostFlow } from '@care-way/shared';
import { CostOptionCard, StorageService } from '@care-way/ui';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  arrowBackSharp,
  arrowForward,
  chevronBackOutline,
  chevronForwardOutline,
  location,
} from 'ionicons/icons';
import { Subject } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'app-dashboard-prescription',
  imports: [IonHeader, IonContent, IonIcon, IonList, IonText, CostOptionCard],
  templateUrl: './dashboard-prescription.html',
  styleUrl: './dashboard-prescription.css',
})
export class DashboardPrescription implements OnInit, OnDestroy {
  private router = inject(Router);
  private api = inject(ApiService);
  loaded = false;
  costFlowPharmacy = CostFlow.PHARMACY;
  costFlowLabTest = CostFlow.LABTEST;
  costFlowBloodBank = CostFlow.BLOODBANK;
  costFlowRadiology = CostFlow.RADIOLOGY;
  serviceRequestId: any;
  referencedDocumentId: any;
  memberId: string;
  referralType: any;
  ReferralType = ReferralType;
  private destroy$ = new Subject<void>();
  private storageService = inject(StorageService);
  options = [
    {
      name: 'Prescription',
      img: '/icons/prescription-icon.svg',
      type: this.costFlowPharmacy,
    },
    {
      name: 'Lab Test',
      img: '/icons/labIcon.svg',
      type: this.costFlowLabTest,
    },
    {
      name: 'Imaging/Radiology',
      img: '/icons/radiologyIcon.svg',
      type: this.costFlowRadiology,
    },
    {
      name: 'Blood',
      img: '/icons/bloodBankIcon.svg',
      type: this.costFlowBloodBank,
    },
  ];
  constructor() {
    addIcons({
      location,
      addCircleOutline,
      chevronBackOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit(): void {
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(flow: CostFlow) {
    this.serviceRequestId = v4();
    this.referencedDocumentId = v4();
    switch (flow) {
      case CostFlow.PHARMACY:
        this.referralType = this.ReferralType?.Pharmacy;
        break;
      case CostFlow.LABTEST:
        this.referralType = this.ReferralType?.Laboratory;
        break;
      case CostFlow.RADIOLOGY:
        this.referralType = this.ReferralType?.Radiology;
        break;
      default:
        this.referralType = this.ReferralType?.BloodBank;
    }
    this.api
      .createServiceRequest({
        memberId: this.memberId,
        serviceRequestId: this.serviceRequestId,
        referralType: this.referralType,
        body: {},
      })
      .subscribe(() => {
        if (flow) {
          this.router.navigate([
            '/dashboard/uploaded-prescription',
            flow,
            this.serviceRequestId,
          ]);
        }
      });
  }
  back() {
    this.router.navigateByUrl(`/dashboard/requests`);
  }
}
