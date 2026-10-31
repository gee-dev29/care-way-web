import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { forkJoin, switchMap, tap } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'app-dashboard-description-pricing',
  imports: [
    IonContent,
    IonIcon,
    IonCard,
    IonCardContent,
    IonText,
    CommonModule,
    IonButton,
  ],
  templateUrl: './dashboard-description-pricing.html',
  styleUrl: './dashboard-description-pricing.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardDescriptionPricing implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  medicalType: any;
  facilityId: string;
  facilityTypeId: string;
  facilityType: string;
  serviceRequestId: string;
  selected: any;
  memberId: string;
  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
    });
  }
  activeTab = null;
  request: any;
  allHaveOne = false;
  costing: any = [];
  costingIds: any = [];
  groupedDrugs: Record<string, any> = {};
  limits: any;
  totalNoOfFacilities = 0;
  customCount = 0;
  lowerCount = 0;
  upperCount = 0;
  totalAmountUpper = 0;
  totalAmountLower = 0;
  totalAmountCustom = 0;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.medicalType = params['medical-type'];
      if (this.facilityType === 'Pharmacy') {
        this.selected = 'Price';
      } else {
        this.selected = 'Facility';
      }
      this.reuse();
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.activeTab) {
        this.activeTab = params.activeTab;
      }
    });
  }

  reuse() {
    this.api
      .getServiceRequestFacilityTypes({
        serviceRequestId: this.serviceRequestId,
      })
      .pipe(
        tap((response: any) => (this.totalNoOfFacilities = response.length)),
        switchMap((facilityTypes: any[]) => {
          const requests = facilityTypes.map((item: any) =>
            this.api.getCostEntriesForServiceRequest({
              serviceRequestId: this.serviceRequestId,
              facilityTypeId: item.facilityTypeId,
            })
          );

          return forkJoin(requests);
        })
      )
      .subscribe((responses: any[]) => {
        this.costing = responses.flatMap((res) => res.data);
        this.costing.forEach((each: any) => {
          this.costingIds.push(each.costingId);
        });
        this.customCount = this.costing.length;
        if (this.selected == 'Price') {
          const drugs = this.costing.filter(
            (item: any) =>
              item.activeIngredient ?? item.testName ?? item.serviceName
          );
          this.sortData(drugs, this.limits);
        } else {
          const drugs = this.costing.filter((item: any) => item.facilityTypeId);
          this.sortData(drugs, this.limits);
        }
      });
  }

  sortData(drugs: any[], filter: any) {
    this.groupedDrugs = {};
    drugs.forEach((drug) => {
      if (this.selected == 'Price') {
        const key = drug.activeIngredient ?? drug.testName ?? drug.serviceName;

        if (!this.groupedDrugs[key]) {
          this.groupedDrugs[key] = [];
        }

        this.groupedDrugs[key].push({ ...drug });
      } else {
        const key = drug.facilityTypeId;

        if (!this.groupedDrugs[key]) {
          this.groupedDrugs[key] = [];
        }

        this.groupedDrugs[key].push({ ...drug });
      }
    });
    Object.entries(this.groupedDrugs).forEach(([key, items]: any) => {
      const costs = items.map((d: any) => d.cost);

      let lowerLimit: number;
      let higherLimit: number;

      if (items.length === 1) {
        lowerLimit = costs[0];
        higherLimit = costs[0];
      } else {
        lowerLimit = Math.min(...costs);
        higherLimit = Math.max(...costs);
      }

      this.groupedDrugs[key] = items.map((drug: any) => {
        const isSingle = items.length === 1;

        return {
          ...drug,
          isLower: isSingle || drug.cost === lowerLimit,
          isUpper: isSingle || drug.cost === higherLimit,
        };
      });
    });
    if (drugs.length === 1) {
      this.allHaveOne = true;
    }
    this.recalculateLimitCounts();
    // if (this.facilityType != FacilityType.Pharmacy) {
    //   this.proceedToSummary();
    // } else {
    this.checkIfOne();
    // }
  }

  changeTab(tab: string) {
    this.selected = tab;
    this.reuse();
  }

  checkIfOne() {
    if (this.allHaveOne) {
      this.proceedToSummary();
    }
  }

  sumPrices(items: any) {
    const groupedByDrug: Record<string, any[]> = {};
    items.forEach((item: any) => {
      const key = item.activeIngredient ?? item.testName ?? item.serviceName;
      if (!groupedByDrug[key]) {
        groupedByDrug[key] = [];
      }
      groupedByDrug[key].push(item);
    });
    return Object.values(groupedByDrug).reduce(
      (total: number, group: any[]) =>
        total + Math.min(...group.map((item: any) => item.cost)),
      0
    );
  }

  recalculateLimitCounts() {
    const result: any = Object.values(this.groupedDrugs).reduce(
      (acc: any, group: any) => {
        group.forEach((item: any) => {
          const cost = Number(item.cost || 0);
          acc.totalCustom += cost;

          if (item.isLower) {
            acc.lowerCount++;
            acc.totalLower += cost;
          }

          if (item.isUpper) {
            acc.upperCount++;
            acc.totalUpper += cost;
          }
        });

        return acc;
      },
      {
        lowerCount: 0,
        upperCount: 0,
        totalLower: 0,
        totalUpper: 0,
        totalCustom: 0,
      }
    );

    Object.assign(this, {
      lowerCount: result.lowerCount,
      upperCount: result.upperCount,
      totalAmountLower: result.totalLower,
      totalAmountUpper: result.totalUpper,
      totalAmountCustom: result.totalCustom,
    });
  }

  goBack() {
    if (this.activeTab != null) {
      this.router.navigateByUrl(
        `/dashboard/requests?activeTab=${this.activeTab}`
      );
    } else {
      this.router.navigateByUrl(`/dashboard/requests`);
    }
  }

  view(limit: string) {
    if (this.activeTab != null) {
      this.router.navigateByUrl(
        `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/prescription/${limit}?activeTab=${this.activeTab}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/prescription/${limit}`
      );
    }
  }

  viewIt(facilityTypeId: string) {
    if (this.activeTab != null) {
      this.router.navigateByUrl(
        `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${facilityTypeId}/${this.memberId}/prescription/Extra?activeTab=${this.activeTab}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${facilityTypeId}/${this.memberId}/prescription/Extra`
      );
    }
  }

  proceedToSummary() {
    const orderId = v4();
    this.api
      .createServiceRequestOrder({
        orderId: orderId,
        body: {
          serviceRequestId: this.serviceRequestId,
          costingIds: this.costingIds,
        },
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl(`/dashboard/order-details/${orderId}`);
        },
        error: () => {
          //
        },
      });
  }
}
