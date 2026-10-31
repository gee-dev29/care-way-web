import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { ConversionService, DrugsForms } from '@care-way/shared';
import { InputComponent, ButtonComponent, Item, LimitSize } from '@care-way/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-lab-test',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './add-lab-test.html',
  styleUrl: './add-lab-test.css',
})
export class AddLabTest implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form: FormGroup;
  activeIngredients: '';
  isForm = false;
  loading = false;
  noAttachmentPresent = false;
  activeIngredient: any;
  costingId: any;
  facilityId: string;
  facilityType: string;
  serviceRequestId: string;
  facilityTypeId: any;
  memberId: string;
  isDisabled = false;
  testGroups: Item[] = [];
  testNames: Item[] = [];
  isTestGroup = false;
  isTestName = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      testGroup: ['', Validators.required],
      testName: ['', Validators.required],
      cost: [null, Validators.required],
    });
    this.route.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
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
      if (params.testGroup) {
        this.form.patchValue({
          testGroup: params.testGroup,
          testName: params.testName,
        });
      }
      this.getLabGroups();
      this.getLabTests();
    });
    this.noAttachmentPresent = this.isRouteSegment(
      'add-lab-test-no-attachment'
    );
    this.isDisabled = false;
  }

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);
    return segments.includes(segment);
  }

  goBack() {
    if (this.noAttachmentPresent) {
      this.router.navigate([
        'dashboard',
        'no-attachment-labtest-request-details',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
      ]);
    } else {
      this.router.navigate([
        'dashboard',
        'attachment-labtest-request-details',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
      ]);
    }
  }
  next() {
    if (!this.form.valid) return;
    this.loading = true;
    const costingId = this.costingId ?? v4();
    this.api
      .createCostEntryForServiceRequest({
        serviceRequestId: this.serviceRequestId,
        facilityTypeId: this.facilityTypeId,
        costingId: costingId,
        body: {
          ...this.form.value,
          cost: Number(this.form.value.cost),
        },
      } as any)
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
  getLabGroups() {
    this.testGroups = [];
    this.api.getLabGroups().subscribe((res: any) => {
      res.forEach((res: any) => {
        this.testGroups.push({ text: res, value: res });
      });
    });
  }
  getLabTests() {
    this.testNames = [];
    this.api
      .getLabTests({ testGroup: this.form.value.testGroup, skip:0, limit:LimitSize.DropDown })
      .subscribe((res: any) => {
        res?.data?.forEach((res: any) => {
          this.testNames.push({ text: res.name, value: res.name });
        });
      });
  }
  isTestGroupClicked() {
    this.isTestGroup = true;
  }
  offtestGroupClicked() {
    this.isTestGroup = false;
    this.getLabTests();
  }
  isTestNameClicked() {
    this.isTestName = true;
  }
  offtestNameClicked() {
    this.isTestName = false;
  }
}
