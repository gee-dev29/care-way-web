import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, GreenBookType } from '@care-way/api';
import {
  ConversionService,
  FacilityTypeService,
  DocumentStatus,
} from '@care-way/shared';
import {
  ButtonComponent,
  ConfirmationModal,
  Address,
  SafePipe,
} from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonText,
  IonModal,
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
import { Observable, map } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-all-request-details',
  imports: [
    IonContent,
    IonIcon,
    IonModal,
    IonText,
    ButtonComponent,
    ConfirmationModal,
    CommonModule,
    IonCard,
    IonCardContent,
    SafePipe,
    IonRadio,
  ],
  templateUrl: './all-request-details.html',
  styleUrl: './all-request-details.css',
})
export class AllRequestDetails implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private conversionService = inject(ConversionService);
  private facilityTypeService = inject(FacilityTypeService);
  private api = inject(ApiService);
  public addressService = inject(Address);

  moment = moment;

  viewCostAttachment = false;
  canDismiss = true;
  attachments = false;
  loading = false;
  editModal = false;
  confirmSwitchModalOpen = false;
  confirmSend = false;
  greenBook = false;

  imageView!: string;
  costId!: string;
  parentId!: string;
  childId!: string;

  facilityId!: string;
  facilityTypeId!: string;
  facilityType!: string;
  serviceRequestId!: string;
  memberId!: string;

  expanded: { [key: number]: boolean } = {};
  data: Record<string, any> = {};
  dataForCosting: any[] = [];
  referralIds: any[] = [];
  costing: any;
  addressSelected: any;
  greeBooks: any[] = [];

  request$!: Observable<any>;
  myAddress$!: Observable<any>;

  flow: any;

  documentStatus = DocumentStatus;

  @ViewChild('modal') modal!: IonModal;

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

  ngOnInit(): void {
    this.greeBooks = [];
    this.conversionService.convert(GreenBookType, this.greeBooks);

    this.facilityTypeService.facilityType$.subscribe(() => {
      const params: any = this.activatedRoute.snapshot.params;

      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;

      this.myAddress$ = this.api.getAddresses({
        referencedDocumentId: this.facilityId,
      } as any);

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

    this.flow = this.activatedRoute.url.subscribe((data: any) =>
      data.includes('cost-details')
    );
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

  dataFromLocalStorage(data: any) {
    this.costing = data;

    const drugs = this.costing.filter((item: any) => item.activeIngredient);

    this.data = {};

    drugs.forEach((drug: any) => {
      const key = drug.activeIngredient;

      if (!this.data[key]) {
        this.data[key] = { items: [] };
      }

      this.data[key].items.push({ ...drug });
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
      'no-attachment-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      'add-request-item',
      greenBook,
    ]);
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
                this.confirmSend = false;
                this.loading = false;
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

  //
  routeToCost(values: any) {
    const id = v4();
    const newItem = {
      id,
      form: values.form,
      availability: true,
      activeIngredient: values.activeIngredient,
      greenBook: values.type,
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
