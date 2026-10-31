import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  ConversionService,
  ImagingProcedure,
} from '@healbridge/shared';
import { InputComponent, ButtonComponent, Item } from '@healbridge/ui';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-radiology-test',
  imports: [
    IonContent,
    IonIcon,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './add-radiology-test.html',
  styleUrl: './add-radiology-test.css',
})
export class AddRadiologyTest implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private conversion = inject(ConversionService);

  form: FormGroup;

  isForm = false;
  loading = false;
  noAttachmentPresent = false;
  activeIngredient: any;
  facilityType: string;
  facilityId: string;
  serviceRequestId: string;
  memberId: string;
  costingId: string;
  facilityTypeId: string;
  isServiceName = false;
  serviceNames: Item[] = [];
  min = 1;

  constructor() {
      addIcons({
        chevronBackOutline,
      });
    }

  ngOnInit(): void {
    this.form = this.fb.group({
      serviceName: ['', Validators.required],
      cost: [0, [Validators.required, Validators.min(1)]],
    });
    this.conversion.convert(ImagingProcedure, this.serviceNames);

    this.route.params.subscribe((params: any) => {
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;

      if (params.costingId) {
        this.costingId = params.costingId;
        this.api
          .getCostEntryForServiceRequest({
            serviceRequestId: this.serviceRequestId,
            facilityTypeId: this.facilityTypeId,
            costingId: this.costingId,
          })
          .subscribe((response: any) => {
            this.form.patchValue(response);
          });
      }
      if (params.serviceName) {
        this.form.patchValue({
          serviceName: params.serviceName,
        });
      }
    });

    this.noAttachmentPresent = this.isRouteSegment(
      'add-radiology-without-attachment'
    );
  }

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);

    return segments.includes(segment);
  }

  isServiceNameClicked() {
    this.isServiceName = true;
  }

  offServiceNameClicked() {
    this.isServiceName = false;
  }

  goBack() {
    if (this.noAttachmentPresent) {
      this.router.navigate([
        'dashboard',
        'no-attach-radiology',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
      ]);
    } else {
      this.router.navigate([
        'dashboard',
        'attach-radiology',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
      ]);
    }
  }
  next() {
    this.loading = true;
    if (!this.form.valid) return;

    const { serviceName, cost } = this.form.value;
    const costingId = this.costingId ?? v4();

    this.api
      .createCostEntryForServiceRequest({
        serviceRequestId: this.serviceRequestId,
        facilityTypeId: this.facilityTypeId,
        costingId: costingId,
        body: {
          cost: Number(cost),
          serviceName: serviceName,
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.goBack();
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
