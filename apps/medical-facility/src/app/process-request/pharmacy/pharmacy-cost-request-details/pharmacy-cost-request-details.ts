import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, GreenBookType } from '@healbridge/api';
import {
  ConversionService,
  DocumentStatus,
  FacilityTypeService,
} from '@healbridge/shared';
import {
  Address,
  ButtonComponent,
  ConfirmationModal,
} from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonText,
  IonCard,
  IonCardContent,
  IonRadio,
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
import {
  forkJoin,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-pharmacy-cost-request-details',
  imports: [
    IonContent,
    IonIcon,
    IonModal,
    IonText,
    ButtonComponent,
    ReactiveFormsModule,
    ConfirmationModal,
    CommonModule,
    IonCard,
    IonCardContent,
    IonRadio,
  ],
  templateUrl: './pharmacy-cost-request-details.html',
  styleUrl: './pharmacy-cost-request-details.css',
})
export class PharmacyCostRequestDetails {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private conversionService = inject(ConversionService);
  private facilityTypeService = inject(FacilityTypeService);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  moment = moment;
  viewCostAttachment = false;
  canDismiss = true;
  imageView: string;
  attachments = false;
  costId: string;
  loading = false;
  data: Record<string, any> = {};
  expanded: { [key: number]: boolean } = {};
  editModal = false;
  confirmSwitchModalOpen = false;
  selectedParentId!: string;
  selectedChildId!: string;
  parentId: string;
  flow: any;
  @ViewChild('modal') modal: IonModal;
  greenBook = false;
  addressSelected: any;
  greeBooks: any = [];
  public addressService = inject(Address);
  childId: string;
  request$: Observable<any>;
  confirmSend = false;
  facilityId: string;
  facilityTypeId: string;
  facilityType: string;
  serviceRequestId: string;
  dataForCosting: any[] = [];
  referralIds: any[] = [];
  memberId: string;
  costing: any;
  myAddress$: Observable<any>;
  documentStatus = DocumentStatus;
  private destroy$ = new Subject<void>();
  @ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;
  @ViewChild('previewImg') previewImg!: ElementRef<HTMLImageElement>;

  zoomLevel = 1;
  transformOrigin = 'center center';

  private minZoom = 1;
  private maxZoom = 4;
  private zoomStep = 0.2;

  private startDistance = 0;
  private startZoom = 1;

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
    this.greeBooks = [];
    this.facilityTypeService.facilityType$.subscribe((facilityType) => {
      this.conversionService.convert(GreenBookType, this.greeBooks);
      this.activatedRoute.params.subscribe((params: any) => {
        this.serviceRequestId = params.serviceRequestId;
        this.memberId = params.memberId;
        this.loading = false;
        this.facilityType = params.facilityType;
        this.facilityId = params.facilityId;
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
              if (this.referralIds !== null) {
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
        this.api
          .getFacilityTypesOfFacility({ facilityId: this.facilityId })
          .subscribe((res: any) => {
            const facility = res.find(
              (each: any) => each.facilityType == this.facilityType
            );

            if (!facility) return;

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
          });
      });

      this.flow = this.activatedRoute.url.subscribe((data: any) =>
        data.includes('cost-details')
      );
    });
  }

  dataFromLocalStorage(data: any) {
    this.costing = data;
    const drugs = this.costing.filter((item: any) => item.activeIngredient);
    this.data = {} as any;
    drugs.forEach((drug: any) => {
      const key = drug.activeIngredient;

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

  onToggle(id: number) {
    this.expanded[id] = !this.expanded[id];
  }

  showUploadedAttachment(url: any) {
    this.imageView = url;
    this.viewCostAttachment = true;
  }

  confirmSwitch() {
    //
  }

  cancelSwitch() {
    //
  }
  goBack() {
    this.router.navigateByUrl('dashboard/request');
  }

  notEmptyObject(obj: object) {
    return Object.keys(obj).length > 0;
  }
  isEmpty(obj: object) {
    return Object.keys(obj).length === 0;
  }

  addCostProduct() {
    this.greenBook = true;
  }

  async selectGreenBook(greenBook: any) {
    this.greenBook = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
    this.router.navigate([
      'dashboard',
      'pharmacy-cost-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      'add-drug-form',
      greenBook,
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
              error: () => {
                this.loading = false;
              },
            });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  async closeSave() {
    this.viewCostAttachment = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }

  editIngredient(item: any) {
    this.router.navigate([
      'dashboard',
      'pharmacy-cost-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      item.greenBook,
      item.id,
    ]);
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

  routeToCost(values: any, requestStatus: string) {
    if (requestStatus === DocumentStatus.Pending) {
      const id = v4();
      const newItem = {
        id,
        form: values.form,
        availability: true,
        activeIngredient: values.activeIngredient,
        greenBook: values.type,
        strength: values?.strength,
        frequencyOfUse: values?.frequencyOfUse,
        duration: values?.duration,
        durationType: values?.durationType,
        schedule:values?.schedule,
        products: [],
      };

      // console.log(values);

      const stored = localStorage.getItem('activeIngredients');
      const activeIngredients = stored ? JSON.parse(stored) : [];

      activeIngredients.push(newItem);
      localStorage.setItem(
        'activeIngredients',
        JSON.stringify(activeIngredients)
      );
      this.router.navigate([
        'dashboard',
        'no-attachment-request-details',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
        values.type,
        id,
      ]);
    }
  }

  setPreview(url: string) {
    this.imageView = url;
    this.zoomLevel = 1;
    this.transformOrigin = 'center center';

    if (this.scrollArea?.nativeElement) {
      this.scrollArea.nativeElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  onWheelZoom(event: WheelEvent) {
    event.preventDefault();

    this.updateTransformOrigin(event.clientX, event.clientY);

    if (event.deltaY < 0) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
    } else {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
    }
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      this.startDistance = this.getTouchDistance(event.touches);
      this.startZoom = this.zoomLevel;

      const center = this.getTouchCenter(event.touches);
      this.updateTransformOrigin(center.x, center.y);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      event.preventDefault();

      const currentDistance = this.getTouchDistance(event.touches);
      if (!this.startDistance) return;

      const center = this.getTouchCenter(event.touches);
      this.updateTransformOrigin(center.x, center.y);

      const scaleFactor = currentDistance / this.startDistance;
      const newZoom = this.startZoom * scaleFactor;

      this.zoomLevel = Math.min(Math.max(newZoom, this.minZoom), this.maxZoom);
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (event.touches.length < 2) {
      this.startDistance = 0;
    }
  }

  private getTouchDistance(touches: TouchList): number {
    const touch1 = touches[0];
    const touch2 = touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(touches: TouchList) {
    const touch1 = touches[0];
    const touch2 = touches[1];

    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }

  private updateTransformOrigin(clientX: number, clientY: number) {
    if (!this.previewImg?.nativeElement) return;

    const rect = this.previewImg.nativeElement.getBoundingClientRect();

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    this.transformOrigin = `${x}% ${y}%`;
  }
}
