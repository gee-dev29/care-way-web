import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService, HospitalCategory } from '@healbridge/api';
import {
  ConversionService,
  FacilityType,
  ToastService,
} from '@healbridge/shared';
import {
  DesktopButton,
  FormBody,
  InputDropDownComponent,
} from '@healbridge/ui';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'back-office-add-hospital-details',
  imports: [
    DesktopButton,
    ReactiveFormsModule,
    InputDropDownComponent,
    CommonModule,
    FormsModule,
    FormBody,
    MultiSelect,
    MultiSelectModule,
  ],
  templateUrl: './add-hospital-details.html',
  styleUrl: './add-hospital-details.css',
})
export class AddHospitalDetails implements OnInit {
  conversionService = inject(ConversionService);
  private formBuilder = inject(FormBuilder);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastService);
  facilityId: string;
  hospitalId: string;
  loading = false;
  label = 'Next';
  form: FormGroup;
  category = new FormControl('', Validators.required);
  specializationId = new FormControl([], Validators.required);
  facilityTypeId = new FormControl(v4());
  categories: any = [];
  edit = '';
  selectedItem: any = [];
  @Input() specializations$: Observable<any>;
  @Output() saved = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      facilityTypeId: this.facilityTypeId,
      category: this.category,
      specializationId: this.specializationId,
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.hospitalId = params.facilityTypeId || null;
      this.edit = params.edit;
    });
    this.specializations$ = this.api.getHospitalSpecializations();
    this.conversionService.convert(HospitalCategory, this.categories);
  }
  next() {
    if (this.form.valid) {
      this.loading = true;
      this.label = 'Please Wait';
      this.hospitalId = v4();
      const specializationIds = (this.form.value.specializationId || []).map(
        (s: any) => s.hospitalSpecializationId
      );

      const payload = {
        facilityId: this.facilityId,
        hospitalId: this.hospitalId,
        name: FacilityType.Hospital,
        category: this.form.value.category,
        specializationIds: specializationIds,
      };
      this.api
        .createFacilityType({
          facilityId: this.facilityId,
          facilityType: FacilityType.Hospital,
          facilityTypeId: this.hospitalId,
          body: payload,
        } as any)
        .subscribe({
          next: () => {
            this.loading = false;
            this.label = 'Next';
            this.loading = false;
            this.saved.emit(this.hospitalId);
          },
          error: (err) => {
            this.loading = false;
            this.label = 'Continue';

            this.toastr.show(
              err?.detail || 'Failed to save Hospital / Clinic details',
              'error'
            );
          },
        });
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
