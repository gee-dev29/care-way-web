import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { DocumentStatus, FacilityTypeService } from '@healbridge/shared';
import { ButtonComponent, SafePipe, ConfirmationModal } from '@healbridge/ui';
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
  chevronUpOutline,
  chevronDownOutline,
  createOutline,
  trashOutline,
  attachOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import moment from 'moment';
import {
  forkJoin,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'medical-facility-attachement-all-request-lab-test',
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
  templateUrl: './attachement-all-request-lab-test.html',
  styleUrl: './attachement-all-request-lab-test.css',
})
export class AttachementAllRequestLabTest {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  confirmSwitchModalOpen = false;
  requestId: string;
  request$: Observable<any>;
  viewCostAttachment = false;
  imageView: string;
  loading = false;
  moment = moment;
  data: Record<string, any> = {};
  expanded: { [key: number]: boolean } = {};
  editModal = false;
  form: FormGroup;
  productName = new FormControl('', Validators.required);
  strength = new FormControl('', Validators.required);
  cost = new FormControl(0, Validators.required);
  private facilityTypeService = inject(FacilityTypeService);
  selectedParentId!: string;
  selectedChildId!: string;
  parentId: string;
  childId: string;
  isAttachmentPresent = false;
  canDismiss = false;
  facilityType: string;
  facilityId: string;
  serviceRequestId: string;
  memberId: string;
  @ViewChild('modal') modal: IonModal;
  confirmSend = false;
  myAddress$: Observable<any>;
  facilityTypeId: string;
  costingId: string;
  private api = inject(ApiService);
  costing: any;
  documentStatus = DocumentStatus;
  addressSelected: any;
  dataForCosting: any[] = [];
  referralIds: any[] = [];
  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({
      chevronBackOutline,
      'attach-outline': attachOutline,
      'add-outline': addOutline,
      chevronUpOutline,
      chevronDownOutline,
      createOutline,
      trashOutline,
    });
  }

  ionViewWillEnter(): void {
    this.destroy$ = new Subject<void>();
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.serviceRequestId = params.serviceRequestId;
        this.memberId = params.memberId;
        this.facilityType = params.facilityType;
        this.facilityId = params.facilityId;

        this.initData();
      });

    this.isAttachmentPresent = this.isRouteSegment('lab-test-attachment');

    this.form = this.fb.group({
      productName: this.productName,
      strength: this.strength,
      cost: this.cost,
    });
  }

  initData() {
    this.myAddress$ = this.api.getAddresses({
      referencedDocumentId: this.facilityId,
    } as any);

    this.request$ = this.api
      .getServiceRequest({
        serviceRequestId: this.serviceRequestId,
        referralType: this.facilityType as any,
        memberId: this.memberId,
      })
      .pipe(
        tap((response: any) => {
          this.referralIds = response.referralIds;
          if (this.referralIds) {
            this.loadCostingData();
          }
        }),
        switchMap((response: any) =>
          forkJoin({
            member: this.api.getMember({ memberId: response.memberId }),
            uploads: this.api.getUploads({
              referencedDocumentId: response.serviceRequestId,
            }),
          }).pipe(
            map(({ member, uploads }) => ({
              ...response,
              member: {
                ...member,
                age: moment().diff(moment(member.dob), 'years'),
              },
              uploads,
            }))
          )
        )
      );

    this.reload();
  }

  reload() {
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
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          this.dataFromLocalStorage(response.data);
        });
    }
  }

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);

    return segments.includes(segment);
  }
  showUploadedAttachment(url: any) {
    this.imageView = url;
    this.viewCostAttachment = true;
  }

  addCostProduct() {
    this.router.navigate([
      'dashboard',
      'attachment-labtest-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      this.facilityTypeId,
      'add-lab-test-attachment',
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

  continue(addressSelected: any) {
    this.addressSelected = addressSelected;
    this.confirmSend = true;
  }

  toggleDeleteBtn(costingId: any) {
    this.confirmSwitchModalOpen = true;
    this.costingId = costingId;
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

  async closeSave() {
    this.viewCostAttachment = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
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

  addCostProductTwo(testName: any, testGroup: any) {
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

  ionViewWillLeave(): void {
    this.destroy$.next();
  }

  isLabTestAlreadyAdded(testName: string, testGroup: string): boolean {
    return Object.values(this.data || {}).some((group: any) =>
      group?.items?.some(
        (item: any) =>
          item?.testName?.trim()?.toLowerCase() ===
            testName?.trim()?.toLowerCase() &&
          item?.testGroup?.trim()?.toLowerCase() ===
            testGroup?.trim()?.toLowerCase()
      )
    );
  }
}
