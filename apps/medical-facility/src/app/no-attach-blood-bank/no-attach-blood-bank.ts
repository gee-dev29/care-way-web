import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityTypeService, DocumentStatus } from '@healbridge/shared';
import { ButtonComponent } from '@healbridge/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  chevronUpOutline,
  chevronDownOutline,
  createOutline,
  trashOutline,
  attachOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import moment from 'moment';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'medical-facility-no-attach-blood-bank',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './no-attach-blood-bank.html',
  styleUrl: './no-attach-blood-bank.css',
})
export class NoAttachBloodBank implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facilityTypeService = inject(FacilityTypeService);

  private api = inject(ApiService);
  request$: Observable<any>;

  loading = false;
  moment = moment;
  data: Record<string, any> = {};
  expanded: { [key: number]: boolean } = {};

  facilityType: string;
  facilityId: string;
  serviceRequestId: string;
  memberId: string;

  confirmSend = false;
  myAddress$: Observable<any>;
  facilityTypeId: string;
  costing: any;
  documentStatus = DocumentStatus;
  addressSelected: any;
  dataForCosting: any[] = [];
  referralIds: any[] = [];

  ngOnInit(): void {
    this.facilityTypeService.facilityType$.subscribe((facilityType) => {
      this.route.params.subscribe((params: any) => {
        this.serviceRequestId = params.serviceRequestId;
        this.memberId = params.memberId;
        this.facilityType = params.facilityType;
        this.facilityId = params.facilityId;
        // this.myAddress$ = this.api.getFacilityTypeAddresses({
        //   facilityType: this.facilityType,
        //   facilityTypeId: this.facilityTypeId,
        // } as any);
        this.request$ = this.api
          .getServiceRequest({
            serviceRequestId: this.serviceRequestId,
            referralType: this.facilityType,
            memberId: this.memberId,
          } as any)
          .pipe(
            map((response: any) => {
              this.referralIds = response.referralIds;

              this.loadCostingData();

              this.api
                .getMember({ memberId: response.memberId })
                .subscribe((member: any) => {
                  response.member = {
                    ...member,
                    age: moment().diff(moment(member.dob), 'years'),
                  };
                });

              return response;
            })
          );
      });
    });
  }

  loadCostingData() {
    const facilityType = JSON.parse(
      localStorage.getItem('facilityType') as any
    );
    if (facilityType === this.facilityType) {
      this.facilityTypeId = JSON.parse(
        localStorage.getItem('facilityTypeId') as any
      );
      this.api
        .getCostEntriesForServiceRequest({
          serviceRequestId: this.serviceRequestId,
          facilityTypeId: this.facilityTypeId,
        })
        .subscribe((response: any) => {
          console.log(response, 'mw');
          this.dataFromLocalStorage(response.data);
        });
      this.dataForCosting = [];

      this.referralIds.forEach((referralId: any) => {
        this.api
          .getReferralEntry({
            referralId,
            referralType: this.facilityType as any,
          })
          .subscribe((serviceCost: any) => {
            this.dataForCosting.push(serviceCost);
          });
      });
    }
  }

  constructor() {
    addIcons({
      addOutline,
      chevronUpOutline,
      chevronDownOutline,
      createOutline,
      trashOutline,
      attachOutline,
      chevronBackOutline,
      chevronForwardOutline,
    });
  }

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);

    return segments.includes(segment);
  }

  addCostProduct(testName: any, testGroup: any) {
    this.router.navigate([
      'dashboard',
      'add-bb-test',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      this.facilityTypeId,
      'add-bb-no-attach',
      testName,
      testGroup,
    ]);
  }

  dataFromLocalStorage(data: any) {
    this.costing = data;

    const drugs = this.costing.filter((item: any) => item.serviceName);

    this.data = {} as any;
    drugs.forEach((drug: any) => {
      const key = drug.serviceName;

      if (!this.data[key]) {
        this.data[key] = {
          items: [],
        };
      }
      this.data[key].items.push({
        ...drug,
      });
    });
  }

  goBack() {
    this.router.navigateByUrl('dashboard/request');
  }

  sendCost() {
    this.loading = true;
    this.myAddress$.subscribe((response: any) => {
      if (response.length == 1) {
        this.continue(response[0]);
      } else {
        this.router.navigateByUrl(
          `dashboard/select-address/${this.facilityType}/${this.facilityId}/${this.serviceRequestId}/${this.memberId}/${this.facilityTypeId}/select-address`
        );
      }
    });
  }

  continue(addressSelected: any) {
    this.addressSelected = addressSelected;
    this.confirmSend = true;
  }

  finishSendCost() {
    this.api
      .setServiceRequestFacilityTypeAddress({
        serviceRequestId: this.serviceRequestId,
        facilityTypeId: this.facilityTypeId,
        body: this.addressSelected as any,
      })
      .subscribe({
        next: () => {
          this.api
            .updateServiceRequestFacilityStatus({
              serviceRequestId: this.serviceRequestId,
              facilityTypeId: this.facilityTypeId,
              body: { status: DocumentStatus.Processed },
            })
            .subscribe({
              next: () => {
                this.loading = false;
                this.confirmSend = false;
                setTimeout(() => {
                  this.router.navigateByUrl('dashboard/request');
                }, 100);
              },
              error: () => (this.loading = false),
            });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onToggle(id: number) {
    this.expanded[id] = !this.expanded[id];
  }
}
