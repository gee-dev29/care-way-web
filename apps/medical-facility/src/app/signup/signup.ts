import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { IonImg, IonText, Platform } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent, InputComponent, ToastService } from '@healbridge/ui';
import { ConversionService, SetCountry } from '@healbridge/shared';
import { CommonModule } from '@angular/common';
import { ApiService } from '@healbridge/api';
import { v4 } from 'uuid';
import { map, Observable, switchMap } from 'rxjs';
@Component({
  selector: 'medical-facility-signup',
  imports: [
    RouterLink,
    IonText,
    IonImg,
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Signup implements OnInit {
  private conversionService = inject(ConversionService);
  private api = inject(ApiService);
  private router = inject(Router);
  private setCountry = inject(SetCountry);
  private activatedRoute = inject(ActivatedRoute);
  platform = inject(Platform);
  private toast = inject(ToastService);
  isWeb = false;
  firebase: any;
  loading = false;
  signupLabel = 'Next';
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', Validators.required);
  // country = new FormControl('');
  phoneNumber = new FormControl('', Validators.required);
  countries$: Observable<any>;
  isCountry = false;
  isState = false;
  // state = new FormControl('', Validators.required);
  referralCode = new FormControl('');
  async ngOnInit() {
    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      agentId: null,
    });

    this.activatedRoute.params.subscribe((params) => {
      const referralCode = params['referralCode'];
      if (referralCode) {
        this.referralCode.setValue(referralCode);
        this.getCode(referralCode);
      }
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

  getCode(code: any) {
    const value = (code || '').trim();

    if (value.length < 7) return;

    this.api
      .getAgentIdByReferralCode({ referralCode: code })
      .subscribe((res: any) => {
        this.form.patchValue({ agentId: res });
      });
  }

  routeTo() {
    this.router.navigateByUrl('signup');
  }
  signup() {
    this.loading = true;
    this.signupLabel = 'Please Wait';

    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.createFacility({
            body: {
              ...this.form.value,
              email: this.form.value.email.toLowerCase(),
              facilityId: v4(),
            },
          })
        )
      )
      .subscribe({
        next: () => {
          const payload: any = {
            email: this.form.value.email.toLowerCase() as any,
          };
          const facilityId = v4();
          this.api.createOtp({ body: payload }).subscribe();
          this.toast.show('Account created successfully', 'success');
          this.signupLabel = 'Next';
          this.loading = false;
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.router.navigate([
            'verify-otp',
            payload.email,
            'sign up',
            facilityId,
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
