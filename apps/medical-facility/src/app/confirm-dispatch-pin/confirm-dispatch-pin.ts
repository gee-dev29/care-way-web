import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { ButtonComponent, InputComponent } from '@healbridge/ui';
import { Subject, takeUntil } from 'rxjs';
import {
  DocumentStatus,
  FacilityTypeService,
  ToastService,
} from '@healbridge/shared';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService, FacilityType } from '@healbridge/api';

@Component({
  selector: 'medical-facility-confirm-dispatch-pin',
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './confirm-dispatch-pin.html',
  styleUrl: './confirm-dispatch-pin.css',
})
export class ConfirmDispatchPin implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastService);
  loading = false;
  FacilityType = FacilityType;
  facilityType: any;
  fulfilmentId: any;
  orderId: any;
  documentStatus = DocumentStatus;
  facilityTypeId: any;
  private destroy$ = new Subject<void>();
  facilityTypeService = inject(FacilityTypeService);
  form: FormGroup;
  fulfilmentPin = new FormControl('', Validators.required);

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      cameraOutline,
    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fulfilmentPin: this.fulfilmentPin,
    });
  }

  ionViewWillEnter() {
    this.facilityTypeService.facilityType$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.facilityType = type;
        this.activatedRoute.params.subscribe((params: any) => {
          this.facilityType = params.facilityType;
          this.facilityTypeId = params.facilityTypeId;
          this.fulfilmentId = params.fulfilmentId;
          this.orderId = params.orderId;
        });
      });
    // this.facilityTypeService.refresh();
  }

  goBack() {
    if (
      this.facilityType === FacilityType.Pharmacy ||
      this.facilityType === FacilityType.BloodBank
    ) {
      this.router.navigate([
        '/dashboard/order-details',
        this.fulfilmentId,
        this.facilityType,
        this.facilityTypeId,
      ]);
    } else {
      this.router.navigate(['/dashboard/orders']);
    }
  }

  dispatch() {
    this.loading = true;
    this.api
      .validatePin({
        orderId: this.orderId,
        pinType: 'Fulfilment',
        body: {
          pin: this.form.value.fulfilmentPin as any,
          fulfilmentOrderId: this.fulfilmentId,
        },
      })
      .subscribe({
        next: () => {
          if (
            this.facilityType === FacilityType.Pharmacy ||
            this.facilityType === FacilityType.BloodBank
          ) {
            this.toastr.show('Order Dispatched Successfully', 'success');
            this.loading = false;
            this.router.navigate(['dashboard/orders']);
          } else {
            this.api
              .updateOrderFulfilmentStatus({
                fulfilmentId: this.fulfilmentId,
                body: { status: DocumentStatus.Processed },
              })
              .subscribe({
                next: () => {
                  this.toastr.show(
                    'Order Fulfillment validated Successfully',
                    'success'
                  );
                  this.loading = false;
                  this.router.navigate([
                    'dashboard/order-details',
                    this.fulfilmentId,
                    this.facilityType,
                    this.facilityTypeId,
                  ]);
                },
                error: () => {
                  this.loading = false;
                },
              });
          }
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
