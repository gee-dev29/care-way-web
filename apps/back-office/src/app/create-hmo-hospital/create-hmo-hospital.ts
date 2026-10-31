import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import {
  PageBody,
  FormBody,
  InputDropDownComponent,
  DesktopButton,
  LimitSize,
} from '@healbridge/ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-create-hmo-hospital',
  imports: [
    PageBody,
    CommonModule,
    FormBody,
    InputDropDownComponent,
    ReactiveFormsModule,
    DesktopButton,
  ],
  templateUrl: './create-hmo-hospital.html',
  styleUrl: './create-hmo-hospital.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateHmoHospital implements OnInit {
  formBuilder = inject(FormBuilder);
  api = inject(ApiService);
  router = inject(Router);
  location = inject(Location);
  auth = inject(AuthService);
  activatedRoute = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  state = new FormControl('', [Validators.required]);
  lga = new FormControl('', [Validators.required]);
  ward = new FormControl('', [Validators.required]);
  hospital = new FormControl('', [Validators.required]);

  stateOptions: { key: string; value: string }[] = [];
  lgaOptions: { key: string; value: string }[] = [];
  wardOptions: { key: string; value: string }[] = [];
  hospitals: { key: string; value: string }[] = [];

  form: FormGroup;
  loading = false;
  saveLabel = 'Save';
  hmoId: string;

  ngOnInit(): void {
    this.initializeForm();

    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.hmoId = params.hmoId;
      this.getStates();
    });

  }

  initializeForm() {
    this.form = this.formBuilder.group({
      state: this.state,
      lga: this.lga,
      ward: this.ward,
      hospital: this.hospital,
    });
  }

  onStateChange(event: any) {
    const state = event?.value;

    if (!state) {
      return;
    }

    this.lga.reset();
    this.ward.reset();
    this.hospital.reset();

    this.lgaOptions = [];
    this.wardOptions = [];
    this.hospitals = [];

    this.api
      .getMedicalFacilityHospitalGroupsByFilters({
        filterType: 'LGA',
        state: state,
      })
      .subscribe((response: any) => {
        this.lgaOptions = response.map((item: string) => ({
          key: item,
          value: item,
        }));
      });
  }

  onLgaChange(event: any) {
    const lga = event?.value;

    if (!this.state.value) {
      this.toastr.warning('Please choose a State first');
      return;
    }

    if (!lga) {
      return;
    }

    this.ward.reset();
    this.hospital.reset();

    this.wardOptions = [];
    this.hospitals = [];

    this.api
      .getMedicalFacilityHospitalGroupsByFilters({
        filterType: 'Ward',
        state: this.state.value,
        lga: lga,
      })
      .subscribe((response: any) => {
        this.wardOptions = response.map((item: string) => ({
          key: item,
          value: item,
        }));
      });
  }

  onWardChange(event: any) {
    const ward = event?.value;

    if (!this.state.value) {
      this.toastr.warning('Please choose a State first');
      return;
    }

    if (!this.lga.value) {
      this.toastr.warning('Please choose an LGA first');
      return;
    }

    if (!ward) {
      return;
    }

    this.hospital.reset();
    this.hospitals = [];

    this.api
      .getMedicalFacilityHospitals({
        skip: 0,
        limit: LimitSize.DropDown,
        state: this.state.value,
        lga: this.lga.value!,
        ward: ward,
      })
      .subscribe((response: any) => {
        this.hospitals = response.data.map((item: any) => ({
          key: item.facilityName,
          value: item.id,
        }));
      });
  }

  getStates() {
    this.api
      .getMedicalFacilityHospitalGroupsByFilters({ filterType: 'State' })
      .subscribe((response: any) => {
        this.stateOptions = response.map((item: string) => ({
          key: item,
          value: item,
        }));
      });
  }

  save() {
    this.loading = true;
    this.saveLabel = 'Please Wait';

    this.api
      .addHmoMedicalFacilityHospitals({
        hmoId: this.hmoId,
        body: {
          hospitalIds: [this.hospital.value],
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.saveLabel = 'Save';
          this.toastr.success('HMO Hospital Added Successfully');
          this.location.back();
        },
        error: () => {
          this.loading = false;
          this.saveLabel = 'Save';
        },
      });
  }

  back() {
    this.location.back();
  }
}
