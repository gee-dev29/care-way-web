import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType, ReferralType } from '@care-way/api';
import {
  CostFlow,
  DocumentStatus,
  ProfileInfoService,
} from '@care-way/shared';
import {
  ConfirmationModal,
  MedicalRequestCard,
  PlusIconComponent,
  StorageService,
} from '@care-way/ui';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  addOutline,
  attachOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import moment from 'moment';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';

type TabType = 'pharmacy' | 'labtest' | 'radiology' | 'bloodbank';
type StatusType =
  | 'all| draft| pending'
  | 'processed'
  | 'ordered'
  | 'cancelled'
  | 'Accepted';

interface MedicalRequest {
  id: number;
  name: string;
  attachments: number;
  status: StatusType;
}
@Component({
  selector: 'app-dashboard-prescription-medical-requests',
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    ConfirmationModal,
    PlusIconComponent,
    PlusIconComponent,
    MedicalRequestCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './dashboard-prescription-medical-requests.html',
  styleUrl: './dashboard-prescription-medical-requests.css',
})
export class DashboardPrescriptionMedicalRequests {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private profileInfoService = inject(ProfileInfoService);
  private storageService = inject(StorageService);
  costFlow: string;
  activeTab: any;
  activeStatus = DocumentStatus.All;
  facilityType: string;
  medicalType: CostFlow;
  DocumentStatus = DocumentStatus;
  referralType: any;
  requests: any = [];
  private router = inject(Router);
  requests$: Observable<any>;
  private destroy$ = new Subject<void>();
  memberId: any;
  user: any;
  requestModal = false;
  moment = moment;
  hasMore = true;
  skip = 0;
  limit = 20;
  allRequests: any;
  totalRecords = 0;
  showPharmacyTab = false;
  showLabTestTab = false;
  showRadiologyTab = false;
  showBloodBankTab = false;
  constructor() {
    addIcons({
      addOutline,
      addCircleOutline,
      'attach-outline': attachOutline,
      chevronBackOutline,
    });
  }

  ionViewWillEnter() {
    this.storageService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => !!user)
      )
      .subscribe((type: any) => {
        this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params.activeTab) {
            this.activeTab = params.activeTab as TabType;
            switch (this.activeTab) {
              case 'pharmacy':
                this.referralType = ReferralType.Pharmacy;
                break;
              case 'labtest':
                this.referralType = ReferralType.Laboratory;
                break;
              case 'radiology':
                this.referralType = ReferralType.Radiology;
                break;
              case 'bloodbank':
                this.referralType = ReferralType.BloodBank;
                break;
            }
          } else {
            this.activeTab = 'pharmacy' as TabType;
            this.referralType = ReferralType.Pharmacy;
          }
        });
        this.filteredRequests();
        this.checkTabAvailability(type);
      });
    if (!this.storageService.getUser()) {
      this.filteredRequests();
    }
  }

  load() {
    this.storageService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        this.memberId = user;
        this.user = this.profileInfoService.name;
        this.getAllRequests();
      });
  }
  getAllRequests() {
    this.skip = 0;
    this.allRequests = [];
    this.hasMore = true;
    this.fetchRequest();
  }

  checkTabAvailability(memberId: any) {
    this.api
      .getServiceRequests({
        memberId,
        referralType: ReferralType.Pharmacy,
        status: null,
        skip: 0,
        limit: 1,
      } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.showPharmacyTab = (response?.totalRecords ?? 0) > 0;
      });

    this.api
      .getServiceRequests({
        memberId,
        referralType: ReferralType.Laboratory,
        status: null,
        skip: 0,
        limit: 1,
      } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.showLabTestTab = (response?.totalRecords ?? 0) > 0;
      });

    this.api
      .getServiceRequests({
        memberId,
        referralType: ReferralType.Radiology,
        status: null,
        skip: 0,
        limit: 1,
      } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.showRadiologyTab = (response?.totalRecords ?? 0) > 0;
      });

    this.api
      .getServiceRequests({
        memberId,
        referralType: ReferralType.BloodBank,
        status: null,
        skip: 0,
        limit: 1,
      } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.showBloodBankTab = (response?.totalRecords ?? 0) > 0;
      });
  }
  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.fetchRequest(event);
  }

  fetchRequest(infiniteEvent?: InfiniteScrollCustomEvent) {
    this.requests$ = this.api
      .getServiceRequests({
        memberId: this.memberId,
        referralType: this.referralType,
        status: this.activeStatus === 'All' ? null : this.activeStatus,
        skip: this.skip,
        limit: this.limit,
      } as any)
      .pipe(
        takeUntil(this.destroy$),
        map((response: any) => {
          this.totalRecords = response.totalRecords;
          return response.data ?? [];
        })
      );
    this.requests$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.allRequests =
        this.skip === 0 ? data : [...this.allRequests, ...data];
      this.hasMore = this.allRequests.length < this.totalRecords;
      infiniteEvent?.target.complete();
    });
  }

  setTab(tab: TabType, referralType: any) {
    this.activeTab = tab;
    this.referralType = referralType;
    this.activeStatus = DocumentStatus.All;
    this.setStatus(this.activeStatus);
  }

  setStatus(status: any) {
    this.activeStatus = status;
    this.filteredRequests();
  }

  navigateTo(item: any) {
    switch (this.activeTab) {
      case 'pharmacy':
        this.medicalType = CostFlow.PHARMACY;
        this.facilityType = FacilityType.Pharmacy;
        break;
      case 'labtest':
        this.medicalType = CostFlow.LABTEST;
        this.facilityType = FacilityType.Laboratory;
        break;
      case 'radiology':
        this.medicalType = CostFlow.RADIOLOGY;
        this.facilityType = FacilityType.Radiology;
        break;
      case 'bloodbank':
        this.medicalType = CostFlow.BLOODBANK;
        this.facilityType = FacilityType.BloodBank;
        break;
      default:
        console.error('Invalid medical type:', this.activeTab);
        return;
    }
    switch (item.status) {
      case DocumentStatus.Draft:
      case DocumentStatus.Pending:
      case DocumentStatus.Declined:
        this.router.navigateByUrl(
          `/dashboard/uploaded-prescription/${this.medicalType}/${item.serviceRequestId}?activeTab=${this.activeTab}`
        );
        break;
      case DocumentStatus.Processed:
        this.router.navigateByUrl(
          `/dashboard/${item.serviceRequestId}/${this.facilityType}/${this.medicalType}/${item.memberId}/pricing?activeTab=${this.activeTab}`
        );
        break;
      case DocumentStatus.Ordered:
        this.api
          .getServiceRequestOrders({
            serviceRequestId: item.serviceRequestId,
            memberId: this.memberId,
          })
          .subscribe((response: any) => {
            const filter = response.data.find(
              (data: any) => data.serviceRequestCode === item.serviceRequestCode
            );
            this.router.navigate([
              '/dashboard/order-details',
              filter.serviceRequestOrderId,
            ]);
          });

        break;
    }
  }

  goto() {
    this.router.navigateByUrl('dashboard/prescription');
  }
  delete(event: Event) {
    this.requestModal = true;
    event.stopPropagation();
  }
  cancelRequest() {
    //
  }
  closeRequestModal() {
    this.requestModal = false;
  }

  filteredRequests() {
    this.skip = 0;
    this.load();
  }

  ionViewWillLeave(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }
}
