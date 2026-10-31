import { Component, inject, Input, OnChanges } from '@angular/core';
import { IonChip, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { MedicalRequestCard } from '../medical-request-card/medical-request-card';

@Component({
  selector: 'ui-list-all-cost',
  imports: [IonIcon, IonChip, CommonModule, MedicalRequestCard],
  templateUrl: './list-all-cost.html',
  styleUrl: './list-all-cost.css',
})
export class ListAllCost implements OnChanges {
  private router = inject(Router);
  @Input() auth: any;
  @Input() FacilityType: any;
  @Input() api: any;
  @Input() facilityTypeService: any;
  statuses: string[] = ['All', 'Pending', 'Processed', 'Accepted', 'Cancelled'];
  selectedItem = 'All';
  costRequests$: Observable<any>;
  costRequests: any = [];
  private destroy$ = new Subject<void>();
  bg: string;
  bdColor = 'none';
  viewAll: string;
  @Input() facilityType: string;
  facilityId: string;
  private initialized = false;
  route = '';
  facilityTypeId: string;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnChanges() {
    if (this.initialized) return;
    this.destroy$ = new Subject<void>();
    this.initialized = true;
    this.auth.userDetail(this.api, (auth: any) => {
      this.facilityTypeService.facilityType$
        .pipe(
          takeUntil(this.destroy$),
          filter(Boolean),
          tap(() => {
            this.selectedItem = 'All';
          }),
          switchMap((type: any) => this.reuse(type, auth?.userTypeId))
        )
        .subscribe(() => {
          this.facilityId = auth?.userTypeId;
        });
    });
  }

  reuse(facilityType: any, facilityId: any) {
    this.facilityId = facilityId;
    const facilityTypeId = JSON.parse(
      localStorage.getItem('facilityTypeId') as any
    );
    switch (facilityType) {
      case this.FacilityType.BloodBank:
        this.viewAll = '#EF0000';
        this.bg = '#FFF3F3';
        this.bdColor = '0.5px solid #FEC6C6';
        this.route = `/dashboard/attach-bb/${facilityType}/${this.facilityId}`;
        break;

      case this.FacilityType.Radiology:
        this.viewAll = '#0061EF';
        this.route = `/dashboard/attach-radiology/${facilityType}/${this.facilityId}`;
        break;

      case this.FacilityType.Laboratory:
        this.viewAll = '#0061EF';
        this.route = `/dashboard/attachment-labtest-request-details/${facilityType}/${this.facilityId}`;
        break;

      case this.FacilityType.Pharmacy:
        this.viewAll = '#0061EF';
        this.bg = '#FFF';
        break;
    }

    return this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId })
      .pipe(
        map((res: any[]) => {
          const facility = res.find(
            (f: any) => f.facilityType === facilityType
          );

          if (!facility) return null;

          switch (facilityType) {
            case this.FacilityType.BloodBank:
            case this.FacilityType.Radiology:
            case this.FacilityType.Laboratory:
            case this.FacilityType.Pharmacy:
              this.facilityTypeId = facilityTypeId;
              break;
          }

          return facility;
        }),
        tap(() => this.filteredCostRequest())
      );
  }

  goBack() {
    this.router.navigateByUrl(`/dashboard/home`);
  }

  selectStatus(status: string) {
    this.selectedItem = status;
    this.filteredCostRequest();
  }

  filteredCostRequest() {
    if (this.selectedItem == 'All') {
      this.costRequests$ = this.api
        .getFacilityTypeServiceRequests({
          facilityTypeId: this.facilityTypeId,
          status: null,
        })
        .pipe(
          takeUntil(this.destroy$),
          map((response: any) => {
            const allResponse: any = [];
            response.forEach((item: any) => {
              switch (this.facilityType) {
                case this.FacilityType.Pharmacy:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attachment-request-details/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/pharmacy-cost-request-details/${this.facilityType}/${this.facilityId}`;
                  break;
                case this.FacilityType.Laboratory:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attachment-labtest-request-details/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/attachment-labtest-request-details/${this.facilityType}/${this.facilityId}`;
                  break;
                case this.FacilityType.BloodBank:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attach-bb/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/attach-bb/${this.facilityType}/${this.facilityId}`;
                  break;
                default:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attach-radiology/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/attach-radiology/${this.facilityType}/${this.facilityId}`;
                  break;
              }
              allResponse.push(item);
            });
            this.costRequests = allResponse;
            return allResponse;
          })
        );
    } else {
      this.costRequests$ = this.api
        .getFacilityTypeServiceRequests({
          facilityTypeId: this.facilityTypeId,
          status: this.selectedItem,
        })
        .pipe(
          map((response: any) => {
            const allResponse: any = [];
            response.forEach((item: any) => {
              switch (this.facilityType) {
                case this.FacilityType.Pharmacy:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attachment-request-details/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/pharmacy-cost-request-details/${this.facilityType}/${this.facilityId}`;
                  break;
                case this.FacilityType.Laboratory:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attachment-labtest-request-details/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/attachment-labtest-request-details/${this.facilityType}/${this.facilityId}`;
                  break;
                case this.FacilityType.BloodBank:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attach-bb/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/attach-bb/${this.facilityType}/${this.facilityId}`;
                  break;
                default:
                  item.route = item.referralIds?.length
                    ? `/dashboard/no-attach-radiology/${this.facilityType}/${this.facilityId}`
                    : `/dashboard/attach-radiology/${this.facilityType}/${this.facilityId}`;
                  break;
              }
              allResponse.push(item);
            });
            this.costRequests = allResponse;
            return allResponse;
          })
        );
    }
  }
  isBloodBank() {
    return this.facilityType === this.FacilityType.BloodBank;
  }
  ionViewWillLeave(): void {
    this.destroy$.next();
  }
}
