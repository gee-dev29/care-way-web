import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { FacilityTypeService, DocumentStatus } from '@care-way/shared';
import { ButtonComponent } from '@care-way/ui';
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
  selector: 'medical-facility-no-attachement-all-request-lab-test',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './no-attachement-all-request-lab-test.html',
  styleUrl: './no-attachement-all-request-lab-test.css',
})
export class NoAttachementAllRequestLabTest implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private facilityTypeService = inject(FacilityTypeService);
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
      'attachment-labtest-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      this.facilityTypeId,
      'add-lab-test-no-attachment',
      testName,
      testGroup,
    ]);
  }

  dataFromLocalStorage(data: any) {
    this.costing = data;
    const drugs = this.costing.filter((item: any) => item.testGroup);
    this.data = {} as any;
    drugs.forEach((drug: any) => {
      const key = drug.testGroup;

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
    this.api
      .getFacilityTypeById({
        facilityType: this.facilityType as any,
        facilityTypeId: this.facilityTypeId,
        facilityId: this.facilityId,
      })
      .subscribe((res: any) => {
        this.continue(res.address);
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
      .subscribe(() => {
        this.api
          .updateServiceRequestFacilityStatus({
            serviceRequestId: this.serviceRequestId,
            facilityTypeId: this.facilityTypeId,
            body: { status: DocumentStatus.Processed },
          })
          .subscribe(() => {
            this.loading = false;
            this.confirmSend = false;
            setTimeout(() => {
              this.router.navigateByUrl('dashboard/request');
            }, 100);
          });
      });
  }

  onToggle(id: number) {
    this.expanded[id] = !this.expanded[id];
  }
}
