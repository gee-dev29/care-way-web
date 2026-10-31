import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  FacilityType,
  ReferralType,
  ServiceRequestStatus,
} from '@healbridge/api';
import {
  DesktopButton,
  PageBody,
  PageHighlight,
  Tab,
  ServiceRequestDetailsCard,
  UploadCard,
  Modal,
  InputTextarea,
  ConfirmationModalDesktop,
} from '@healbridge/ui';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { MedicalFacilityTable } from '../medical-facility-table/medical-facility-table';
import { Table } from 'primeng/table';
import { ServiceRequestTable } from '../service-request-table/service-request-table';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReferralItems } from '../referral-items/referral-items';
import { OrderTable } from '../order-table/order-table';
@Component({
  selector: 'back-office-service-request-details',
  imports: [
    CommonModule,
    PageBody,
    DesktopButton,
    Tab,
    PageHighlight,
    ServiceRequestDetailsCard,
    UploadCard,
    Modal,
    MedicalFacilityTable,
    ServiceRequestTable,
    InputTextarea,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ConfirmationModalDesktop,
    ReferralItems,
    OrderTable,
  ],
  templateUrl: './service-request-details.html',
  styleUrl: './service-request-details.css',
})
export class ServiceRequestDetails implements OnInit {
  router = inject(Router);
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);
  api = inject(ApiService);
  toastr = inject(ToastrService);
  formBuilder = inject(FormBuilder);
  activeTab = 0;
  serviceRequest$: Observable<any>;
  connectedServiceRequests$: Observable<any>;
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Orders', value: 1, content: 'Orders' },
  ];
  requestCode: string;
  member: string;
  member$: Observable<any>;
  uploads$: Observable<any>;
  costRequests$: Observable<any>;
  referralType: ReferralType;
  facilityType: FacilityType;
  connectFacilityTypesModal: boolean;
  connectFacilityTypeHeading: string;
  type = ReferralType;
  serviceRequestStatus = ServiceRequestStatus;
  costRequestStatus = '';
  selected: any;
  serviceRequestId: string;
  connectedServiceRequestsTotalRecords = 0;
  referralTypeTableHeading: string;
  requestConfirmationModal: boolean;
  form: FormGroup;
  instruction = new FormControl('', [Validators.required]);
  serviceRequestConfirmationModal: boolean;
  costModal: boolean;
  costRequestTotalRecords: number;
  facilityServiceRequestId: string;
  facilityTypeId: string;
  costRequestTotal: number;
  costRequestFacilityName: any;
  loading = false;
  referralItems: object[];
  showReferralItems: boolean;
  referralItemsTotalRecords = 0;
  confirmationMessage: string;

  constructor() {
    this.selected = new Map();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.referralType = params.referralType;
      this.facilityType = params.referralType;
      this.serviceRequestId = params.serviceRequestId;
      this.getServiceRequest(
        params.serviceRequestId,
        params.memberId,
        params.referralType
      );
      this.getMember(params.memberId);
      this.getUploads(params.serviceRequestId);
      this.getServiceRequestFacilityTypes(params.serviceRequestId);
    });
    this.form = this.formBuilder.group({
      instruction: this.instruction,
    });
  }

  back() {
    this.location.back();
  }

  getServiceRequest(
    serviceRequestId: string,
    memberId: string,
    referralType: ReferralType
  ) {
    this.serviceRequest$ = this.api
      .getServiceRequest({
        serviceRequestId,
        memberId,
        referralType,
      })
      .pipe(
        tap((serviceRequest: any) => {
          if (serviceRequest.referralIds?.length) {
            this.showReferralItems = true;
            const requests = serviceRequest.referralIds.map(
              (referralId: string) =>
                this.api.getReferralEntry({
                  referralId,
                  referralType: this.referralType,
                })
            );
            forkJoin(requests).subscribe((referralItems: any) => {
              this.referralItems = referralItems ?? [];
              this.referralItemsTotalRecords = referralItems.length;
            });
          }
        })
      );
  }

  getMember(memberId: string) {
    this.member$ = this.api.getMember({ memberId }).pipe(
      tap((member: any) => {
        this.member = `${member.firstName} ${member.lastName}`;
      })
    );
  }

  getUploads(serviceRequestId: string) {
    this.uploads$ = this.api.getUploads({
      referencedDocumentId: serviceRequestId,
    });
  }

  getServiceRequestFacilityTypes(serviceRequestId: string) {
    this.connectedServiceRequests$ = this.api
      .getServiceRequestFacilityTypes({
        serviceRequestId: serviceRequestId,
      })
      .pipe(
        tap((response: any) => {
          this.connectedServiceRequestsTotalRecords = response.length;
        })
      );
  }

  openConnectFacilityTypesModal() {
    this.connectFacilityTypesModal = true;
    this.connectFacilityTypeHeading = `Send Medical Request to ${this.referralType}`;
    this.getReferralFacilityTypeTableHeading();
  }

  getReferralFacilityTypeTableHeading() {
    if (this.referralType === ReferralType.Pharmacy) {
      this.referralTypeTableHeading = 'Pharmacies';
    }
    if (this.referralType === ReferralType.Laboratory) {
      this.referralTypeTableHeading = 'Laboratories';
    }
    if (this.referralType === ReferralType.BloodBank) {
      this.referralTypeTableHeading = 'Blood Banks';
    }
    if (this.referralType === ReferralType.Radiology) {
      this.referralTypeTableHeading = 'Radiology Centres';
    }
  }

  onRowSelect(event: any) {
    this.selected.set(event.data.id, event.data.id);
  }


  onRowUnselect(event: any) {
    this.selected.delete(event.data.id);
  }

  onHeaderCheckboxToggle(eventData: {
    $event: any;
    dt1: Table;
    connectedRequests: any[];
  }) {
    if (eventData.$event.checked) {
      eventData.dt1.value
        .filter(
          (item: any) =>
            !eventData.connectedRequests?.some(
              (res: any) =>
                res.status === ServiceRequestStatus.Pending &&
                res.facilityTypeId === item.id
            )
        )
        .forEach((item: any) => {
          this.selected.set(item.id, item.id);
        });
    } else {
      this.selected.clear();
    }
  }

  proceed() {
    this.connectFacilityTypesModal = false;
    this.requestConfirmationModal = true;
  }

  sendRequest() {
    const facilityTypeIds = [...this.selected.values()];

    this.api
      .connectServiceRequestToFacilityTypes({
        serviceRequestId: this.serviceRequestId,
        body: { facilityTypeIds, instruction: this.form.value.instruction },
      })
      .subscribe(() => {
        this.toastr.success('Medical Request sent successfully');
        this.requestConfirmationModal = false;
        this.activeTab = 0;
        this.selected.clear();
        this.form.reset();
        this.getServiceRequestFacilityTypes(this.serviceRequestId);
      });
  }

  openServiceRequestAcceptanceConfirmation(event: any) {
    this.serviceRequestConfirmationModal = true;
    this.facilityServiceRequestId = event.serviceRequestId;
    this.facilityTypeId = event.facilityTypeId;

    this.confirmationMessage =
      'Please confirm. Do you want to accept this service request?';
  }

  openConfirmationFromCostModal() {
    this.serviceRequestConfirmationModal = true;
    this.confirmationMessage =
      'Please confirm. Do you want to accept this cost?';
  }

  acceptRequest() {
    this.api
      .updateServiceRequestFacilityStatus({
        facilityTypeId: this.facilityTypeId,
        serviceRequestId: this.facilityServiceRequestId,
        body: {
          status: ServiceRequestStatus.Accepted,
        },
      })
      .pipe(
        switchMap(() =>
          this.api.updateServiceRequestStatus({
            serviceRequestId: this.serviceRequestId,
            body: {
              status: ServiceRequestStatus.Processed,
            },
          })
        )
      )
      .subscribe({
        next: () => {
          this.costModal = false;
          this.toastr.success('Medical Request accepted successfully');
          this.getServiceRequestFacilityTypes(this.serviceRequestId);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  viewCost(event: any) {
    this.costRequestFacilityName = event.facilityName;
    this.costRequestStatus = event.status;
    this.costModal = true;

    this.facilityServiceRequestId = event.serviceRequestId;
    this.facilityTypeId = event.facilityTypeId;

    this.costRequests$ = this.api
      .getCostEntriesForServiceRequest({
        facilityTypeId: event.facilityTypeId,
        serviceRequestId: event.serviceRequestId,
      })
      .pipe(
        tap((response: any) => {
          this.costRequestTotalRecords = response.totalRecords;
        }),
        map((response: any) => {
          const groupedByKey: Record<string, any[]> = {};
          response.data.forEach((item: any) => {
            const key = item.activeIngredient ?? item.testGroup ?? item.serviceName;
            if (!groupedByKey[key]) {
              groupedByKey[key] = [];
            }
            groupedByKey[key].push(item);
          });
          this.costRequestTotal = Object.values(groupedByKey).reduce(
            (sum: number, group: any[]) =>
              sum + Math.min(...group.map((item: any) => Number(item.cost))),
            0
          );

          const ingredients: any[] = [];
          const testGroups: any[] = [];
          const serviceNameGroups: any[] = [];

          response.data.forEach((item: any) => {
            if (item.activeIngredient) {
              let ingredientGroup = ingredients.find(
                (g) => g.activeIngredient === item.activeIngredient
              );
              if (!ingredientGroup) {
                ingredientGroup = {
                  activeIngredient: item.activeIngredient,
                  data: [],
                };
                ingredients.push(ingredientGroup);
              }
              ingredientGroup.data.push(item);
            }

            if (item.testGroup) {
              let testGroup = testGroups.find(
                (g) => g.testGroup === item.testGroup
              );
              if (!testGroup) {
                testGroup = { testGroup: item.testGroup, data: [] };
                testGroups.push(testGroup);
              }
              testGroup.data.push(item);
            }

            if (item.serviceName) {
              let serviceGroup = serviceNameGroups.find(
                (g) => g.serviceName === item.serviceName
              );
              if (!serviceGroup) {
                serviceGroup = { serviceName: item.serviceName, data: [] };
                serviceNameGroups.push(serviceGroup);
              }
              serviceGroup.data.push(item);
            }
          });

          return ingredients.length
            ? ingredients
            : testGroups.length
            ? testGroups
            : serviceNameGroups;
        })
      );
  }
}
