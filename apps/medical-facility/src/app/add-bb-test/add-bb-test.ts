import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, BloodGroup, BloodProduct } from '@healbridge/api';
import { ConversionService } from '@healbridge/shared';
import { InputComponent, ButtonComponent, Item } from '@healbridge/ui';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-bb-test',
  imports: [
    IonContent,
    IonIcon,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './add-bb-test.html',
  styleUrl: './add-bb-test.css',
})
export class AddBbTest implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private conversion = inject(ConversionService);

  form: FormGroup;

  isForm = false;
  loading = false;
  isAttachmentPresent = false;
  activeIngredient: any;
  facilityType: string;
  facilityId: string;
  serviceRequestId: string;
  memberId: string;
  facilityTypeId: string;
  costingId: string;
  isServiceName = false;
  isBloodGroup = false;
  serviceNames: Item[] = [];
  bloodGroups: Item[] = [];
  min = 1;
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      serviceName: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      cost: [0, [Validators.required, Validators.min(0)]],
    });
    this.conversion.convert(BloodProduct, this.serviceNames);
    this.conversion.convert(BloodGroup, this.bloodGroups);

    this.route.params.subscribe((params: any) => {
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.serviceRequestId = params.serviceRequestId;
      this.facilityTypeId = params.facilityTypeId;
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
      if (params.bloodGroup) {
        this.form.patchValue({
          serviceName: params.serviceName,
          bloodGroup: params.bloodGroup,
          quantity: params.quantity,
        });
      }
    });
    this.isAttachmentPresent = this.isRouteSegment('add-bb-no-attach');
  }

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);

    return segments.includes(segment);
  }

  isServiceNameClicked() {
    this.isBloodGroup = false;
    this.isServiceName = true;
  }

  offServiceNameClicked() {
    this.isServiceName = false;
  }
  isBloodGroupClicked() {
    this.isServiceName = false;
    this.isBloodGroup = true;
  }

  offBloodGroupClicked() {
    this.isBloodGroup = false;
  }

  goBack() {
    if (this.isAttachmentPresent) {
      this.router.navigate([
        'dashboard',
        'no-attach-bb',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
      ]);
    } else {
      this.router.navigate([
        'dashboard',
        'attach-bb',
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

    const { serviceName, bloodGroup, quantity, cost } = this.form.value;
    const costingId = this.costingId ?? v4();

    this.api
      .createCostEntryForServiceRequest({
        serviceRequestId: this.serviceRequestId,
        facilityTypeId: this.facilityTypeId,
        costingId: costingId,
        body: {
          cost: Number(cost),
          serviceName: serviceName,
          bloodGroup: bloodGroup,
          quantity: Number(quantity),
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.goBack();
          this.form.patchValue({
            serviceName: '',
            bloodGroup: '',
            quantity: 1,
            cost: 0,
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
