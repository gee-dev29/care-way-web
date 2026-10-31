import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, GreenBookType } from '@care-way/api';
import {
  ConversionService,
  DocumentStatus,
  FacilityTypeService,
} from '@care-way/shared';
import { ButtonComponent, SafePipe, ConfirmationModal } from '@care-way/ui';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  attachOutline,
  chevronBackOutline,
  chevronDownOutline,
  chevronUpOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import moment from 'moment';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'medical-facility-attach-bb-test',
  imports: [
    IonContent,
    IonIcon,
    IonModal,
    IonText,
    IonCard,
    IonCardContent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    SafePipe,
    ConfirmationModal,
  ],
  templateUrl: './attach-bb-test.html',
  styleUrl: './attach-bb-test.css',
})
export class AttachBbTest {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private conversionService = inject(ConversionService);
  private api = inject(ApiService);
  private facilityTypeService = inject(FacilityTypeService);

  myAddress$: Observable<any>;
  request$: Observable<any>;

  moment = moment;
  documentStatus = DocumentStatus;

  confirmSwitchModalOpen = false;
  viewCostAttachment = false;
  confirmSend = false;
  editModal = false;
  loading = false;
  canDismiss = false;

  greenBooks: any = [];
  data: Record<string, any> = {};
  expanded: { [key: number]: boolean } = {};

  imageView: string;
  facilityType: string;
  facilityId: string;
  serviceRequestId: string;
  memberId: string;
  costingId: string;
  selectedParentId!: string;
  selectedChildId!: string;
  parentId: string;
  childId: string;
  facilityTypeId: string;
  dataForCosting: any[] = [];
  referralIds: any[] = [];
  costing: any;
  addressSelected: any;
  @ViewChild('modal') modal: IonModal;

  ionViewWillEnter(): void {
    this.facilityTypeService.facilityType$.subscribe((facilityType) => {
      this.conversionService.convert(GreenBookType, this.greenBooks);
      this.activatedRoute.params.subscribe((params: any) => {
        this.serviceRequestId = params.serviceRequestId;
        this.memberId = params.memberId;
        this.facilityType = params.facilityType;
        this.facilityId = params.facilityId;
        this.loading = false;
        this.myAddress$ = this.api.getAddresses({
          referencedDocumentId: this.facilityId,
        } as any);

        this.request$ = this.api
          .getServiceRequest({
            serviceRequestId: params.serviceRequestId,
            referralType: params.facilityType,
            memberId: params.memberId,
          } as any)
          .pipe(
            tap((response: any) => {
              this.referralIds = response.referralIds;
              if (this.referralIds) {
                this.loadCostingData();
              }
            }),
            switchMap((response: any) =>
              forkJoin({
                member: this.api.getMember({
                  memberId: response.memberId,
                }),
                uploads: this.api.getUploads({
                  referencedDocumentId: response.serviceRequestId,
                }),
              }).pipe(
                map(({ member, uploads }) => {
                  const newMember = {
                    ...member,
                    age: moment().diff(moment(member.dob), 'years'),
                  };
                  return {
                    ...response,
                    member: newMember,
                    uploads,
                  };
                })
              )
            )
          );
        this.reload();
      });
    });
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
    });
  }

  reload() {
    const facilityType = JSON.parse(
      localStorage.getItem('facilityType') as any
    );
    if (facilityType == this.facilityType) {
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
    }
  }

  addCostProduct() {
    this.router.navigate([
      'dashboard',
      'add-bb-test',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      this.facilityTypeId,
      'add-bb-test-attach',
    ]);
  }

  sendCost() {
    this.loading = true;
    if (this.confirmSend) {
      this.finishSendCost();
    } else {
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
              error: () => {
                this.loading = false;
                this.confirmSend = false;
              },
            });
        },
        error: () => {
          this.loading = false;
        },
      });
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

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);

    return segments.includes(segment);
  }

  showUploadedAttachment(url: any) {
    this.imageView = url;
    this.viewCostAttachment = true;
  }

  onToggle(index: number) {
    this.expanded[index] = !this.expanded[index];
  }

  toggleDeleteBtn(costingId: any) {
    this.confirmSwitchModalOpen = true;
    this.costingId = costingId;
  }

  continue(addressSelected: any) {
    this.addressSelected = addressSelected;
    this.confirmSend = true;
  }

  async closeSave() {
    this.viewCostAttachment = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }

  goBack() {
    this.router.navigateByUrl('dashboard/request');
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
  addCostProductTwo(testName: any, testGroup: any, quantity: any) {
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
      quantity,
    ]);
  }
  isBloodItemAlreadyAdded(serviceName: string, bloodGroup: string): boolean {
    return Object.values(this.data || {}).some((group: any) =>
      group?.items?.some(
        (item: any) =>
          item?.serviceName?.trim()?.toLowerCase() ===
            serviceName?.trim()?.toLowerCase() &&
          item?.bloodGroup?.trim()?.toLowerCase() ===
            bloodGroup?.trim()?.toLowerCase()
      )
    );
  }
}
