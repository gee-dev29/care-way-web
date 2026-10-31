import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { DesktopButton, DesktopInput, FormBody, PageBody, ToastService } from '@healbridge/ui';
import { map, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'back-office-create-medical-facility',
  imports: [
    DesktopButton,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageBody,
    FormBody,
    DesktopInput,
  ],
  templateUrl: './create-medical-facility.html',
  styleUrl: './create-medical-facility.css',
})
export class CreateMedicalFacility  implements OnInit{
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  loading = false;
  signupLabel = 'Next';
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', Validators.required);
  country = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);
  facilityId = new FormControl(v4(), Validators.required);
  countries$: Observable<any>;
  isCountry = false;
  isState = false;
  state = new FormControl('', Validators.required);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      facilityId: this.facilityId,
      state: this.state,
    });
    this.countries$ = this.api.getAllCountries().pipe(
      map((res) => {
        return res.map((country: any) => {
          return {
            text: country.countryName,
            value: country.countryId,
          };
        });
      })
    );
  }
  back(){
    this.router.navigate([
      'list-all-medical-facilities'
    ]);
  }
  next(){
    this.loading = true;
    this.signupLabel = 'Please Wait';
    this.api
      .createFacility({
        body: this.form.value,
      })
      .subscribe({
        next: () => {
          const payload: any = { email: this.form.value.email as any };
          this.toast.show('Medical Facility created successfully', 'success');
          this.signupLabel = 'Next';
          this.loading = false;
          this.router.navigate([
            'medical-facility-details', this.form.value.facilityId
          ]);
        },
        error: (err: any) => {
          this.signupLabel = 'Next';
          this.loading = false;
        },
      });
  }

  isCountryClicked() {
    this.isCountry = true;
    this.isState = false;
  }
  offCountryClicked() {
    this.isCountry = false;
  }
  isStateClicked() {
    this.isState = true;
    this.isCountry = false;
  }
  offStateClicked() {
    this.isState = false;
  }
}
