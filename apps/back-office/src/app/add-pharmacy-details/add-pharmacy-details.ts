import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  DesktopButton,
  FacilityType,
} from '@care-way/ui';
import { ToastrService } from 'ngx-toastr';
import { CheckboxModule } from 'primeng/checkbox';
import { v4 } from 'uuid';

@Component({
  selector: 'back-office-add-pharmacy-details',
  imports: [
    DesktopButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
  ],
  templateUrl: './add-pharmacy-details.html',
  styleUrl: './add-pharmacy-details.css',
})
export class AddPharmacyDetails implements OnInit {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private toaster = inject(ToastrService);
  private api = inject(ApiService);
  form: FormGroup;
  facilityId: string;
  pharmacyId: string;
  categories = [];
  edit = '';
  label = 'Save';
  loading: boolean;
  valid: boolean;
  @Output() cancelled = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{
    id: string;
    facilityType: FacilityType;
  }>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.facilityTypeId || null;
      this.edit = params.edit;
    });
  }

  cancel() {
    this.cancelled.emit();
  }
  next() {
    if (this.categories.length === 0)
      this.toaster.info('Please select at least one option');

    this.label = 'Saving...';
    this.loading = true;
    this.pharmacyId = v4();

    const payload = {
      productCategories: this.categories,
    };

    this.api
      .createFacilityType({
        facilityId: this.facilityId,
        facilityType: FacilityType.Pharmacy,
        facilityTypeId: this.pharmacyId,
        body: payload,
      } as any)
      .subscribe({
        next: () => {
          this.loading = false;
          this.label = 'Next';
          this.loading = false;
          this.saved.emit({
            id: this.pharmacyId,
            facilityType: FacilityType.Pharmacy,
          });
        },
        error: (err) => {
          this.loading = false;
          this.label = 'Save';

          this.toaster.show(err?.detail || 'Failed to save details', 'error');
        },
      });
  }
}
