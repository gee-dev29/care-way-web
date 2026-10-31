import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import {
  ButtonComponent,
  SaveUploadService,
  MedicalRequestCard,
} from '@care-way/ui';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import { forkJoin, switchMap } from 'rxjs';
import { v4 } from 'uuid';
@Component({
  selector: 'app-dashboard-prescription-limit',
  imports: [
    IonContent,
    IonCard,
    IonCardContent,
    ButtonComponent,
    IonIcon,
    IonText,
    IonList,
    ReactiveFormsModule,
    CommonModule,
    IonRadioGroup,
    IonRadio,
    MedicalRequestCard,
  ],
  templateUrl: './dashboard-prescription-limit.html',
  styleUrl: './dashboard-prescription-limit.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardPrescriptionLimit implements OnInit {
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'chevron-down-outline': chevronDownOutline,
      'chevron-up-outline': chevronUpOutline,
    });
  }
  expanded: { [key: number]: boolean } = {};

  private router = inject(Router);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private precscriptionService = inject(SaveUploadService);
  medicalType: string;
  private api = inject(ApiService);
  facilityId: string;
  facilityTypeId: null;
  facilityType: string;
  FacilityType = FacilityType;
  serviceRequestId: string;
  memberId: string;
  checkname = '';
  limit: any;
  costing: any = [];
  loading = false;
  form: FormGroup;
  groupedLimitsDetails: Record<string, any> = {};
  control = new FormControl(null);
  selectedCount = 0;
  totalAmount = 0;

  request: any = null;
  costingIds: any = [];
  activeTab = null;
  selectedByGroup: Record<string, string | null> = {};

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.medicalType = params['medical-type'];
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      if (params.facilityTypeId) {
        this.facilityTypeId = params.facilityTypeId;
      }
      this.limit = params.limit;
      this.api
        .getServiceRequest({
          serviceRequestId: this.serviceRequestId,
          memberId: this.memberId,
          referralType: this.facilityType,
        } as any)
        .subscribe((response: any) => (this.request = response));
      if (this.facilityTypeId != null) {
        this.api
          .getCostEntriesForServiceRequest({
            serviceRequestId: this.serviceRequestId,
            facilityTypeId: params.facilityTypeId,
          })
          .subscribe((responses: any) => {
            this.costing = responses.data;
            this.costing.forEach((each: any) => {
              this.costingIds.push(each.costingId);
            });
            const drugs = this.costing.filter(
              (item: any) =>
                item.activeIngredient ?? item.testName ?? item.serviceName
            );
            this.sortData(drugs, this.limit);
          });
      } else {
        this.api
          .getServiceRequestFacilityTypes({
            serviceRequestId: this.serviceRequestId,
          })
          .pipe(
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

            const drugs = this.costing.filter(
              (item: any) =>
                item.activeIngredient ?? item.testName ?? item.serviceName
            );
            this.sortData(drugs, this.limit);
          });
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      if (params.activeTab) {
        this.activeTab = params.activeTab;
      }
    });
  }
  sortData(drugs: any[], filter: any) {
    this.groupedLimitsDetails = {} as any;

    drugs.forEach((drug) => {
      const key = drug.activeIngredient ?? drug.testName ?? drug.serviceName;

      if (!this.groupedLimitsDetails[key]) {
        this.groupedLimitsDetails[key] = {
          selectedId: null,
          items: [],
        };
      }

      this.groupedLimitsDetails[key].items.push({
        ...drug,
      });
    });
    Object.keys(this.groupedLimitsDetails).forEach((key) => {
      const items = this.groupedLimitsDetails[key].items;
      let target;
      if (filter === 'lower') {
        target = items.reduce((a: any, b: any) => (a.cost < b.cost ? a : b));
      } else if (filter === 'upper') {
        target = items.reduce((a: any, b: any) => (a.cost > b.cost ? a : b));
      } else if (filter === 'Extra') {
        target = items.reduce((a: any, b: any) => a.cost === a.cost);
      } else {
        target = items;
      }
      this.groupedLimitsDetails[key].selectedId = target.costingId;
    });

    this.recalculateSummary();
  }
  recalculateSummary() {
    let count = 0;
    let total = 0;
    const selectedPrescriptions: any[] = [];
    this.costingIds = [];

    Object.values(this.groupedLimitsDetails).forEach((group: any) => {
      // if (this.facilityType == FacilityType.Pharmacy) {
      const chosen = group.items.find(
        (i: any) => i.costingId === group.selectedId
      );

      if (chosen) {
        count++;
        total += chosen.cost;
        selectedPrescriptions.push(chosen);
        this.costingIds.push(chosen.costingId);
      }
      // } else {
      //   const selectedIds = group.selectedIds || [];

      //   const chosenItems = group.items.filter((i: any) =>
      //     selectedIds.includes(i.costingId)
      //   );

      //   chosenItems.forEach((chosen: any) => {
      //     count++;
      //     total += chosen.cost;
      //     selectedPrescriptions.push(chosen);
      //     this.costingIds.push(chosen.costingId);
      //   });
      // }
    });

    this.selectedCount = count;
    this.totalAmount = total;
  }

  onCheck(groupKey: string, id: string, checked?: boolean) {
    if (this.facilityType == FacilityType.Pharmacy) {
      this.groupedLimitsDetails[groupKey].selectedId = id;
    } else {
      if (!this.groupedLimitsDetails[groupKey].selectedIds) {
        this.groupedLimitsDetails[groupKey].selectedIds = [];
      }

      const selectedIds = this.groupedLimitsDetails[groupKey].selectedIds;

      if (checked === true) {
        if (!selectedIds.includes(id)) {
          selectedIds.push(id);
        }
      } else {
        this.groupedLimitsDetails[groupKey].selectedIds = selectedIds.filter(
          (itemId: string) => itemId !== id
        );
      }
    }

    this.recalculateSummary();
  }
  isChecked(groupKey: string, id: string): boolean {
    return (
      this.groupedLimitsDetails[groupKey].selectedIds?.includes(id) ?? false
    );
  }

  onToggle(id: number) {
    this.expanded[id] = !this.expanded[id];
  }

  goBack() {
    if (this.limit === 'Extra') {
      if (this.facilityTypeId != null) {
        if (this.activeTab != null) {
          this.router.navigateByUrl(
            `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/pricing?activeTab=${this.activeTab}`
          );
        } else {
          this.router.navigateByUrl(
            `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/pricing`
          );
        }
      } else {
        if (this.activeTab != null) {
          this.router.navigateByUrl(
            `dashboard/requests?activeTab=${this.activeTab}`
          );
        } else {
          this.router.navigateByUrl(`dashboard/requests`);
        }
      }
    } else {
      if (this.activeTab != null) {
        this.router.navigateByUrl(
          `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/pricing?activeTab=${this.activeTab}`
        );
      } else {
        this.router.navigateByUrl(
          `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/pricing`
        );
      }
    }
  }

  getKey(obj: any): string {
    return Object.keys(obj)[0];
  }

  proceedToSummary() {
    this.loading = true;
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
          this.loading = false;
          this.router.navigateByUrl(`/dashboard/order-details/${orderId}`);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
