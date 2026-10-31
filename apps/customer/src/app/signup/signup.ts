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
import { ConversionService, Gender, SetCountry } from '@healbridge/shared';
import { CommonModule } from '@angular/common';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { v4 } from 'uuid';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-signup',
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
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  platform = inject(Platform);
  private toast = inject(ToastService);
  isWeb = false;
  firebase: any;
  loading = false;
  signupLabel = 'Continue';
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);
  gender = new FormControl('', Validators.required);
  userType = new FormControl(
    NonProfessionalUserType.Default,
    Validators.required
  );
  userId = new FormControl(v4(), Validators.required);
  term = new FormControl(false, Validators.requiredTrue);
  // updates = new FormControl(false, Validators.required);
  genders: any = [];
  setCountry = inject(SetCountry);
  referralCode = new FormControl('');

  async ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      userType: this.userType,
      gender: this.gender,
      userId: this.userId,
      term: this.term,
      referralCode: this.referralCode,
      agentId: null,
    });
    this.conversionService.convert(Gender, this.genders);

    this.activatedRoute.params.subscribe((params) => {
      const referralCode = params['referralCode'];
      if (referralCode) {
        this.form.patchValue({ referralCode: referralCode });
        this.getCode(referralCode);
      }
    });
  }

  routeTo() {
    this.router.navigateByUrl('signup');
  }

  signup() {
    this.loading = true;
    this.signupLabel = 'Signing Up';
    const email = this.form.value.email.toLowerCase();

    const referralId: any = this.form.value.referralCode;
    const agentId =
      referralId && referralId.length > 0 ? this.form.value.agentId : null;

    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.signUpUser({
            body: {
              ...this.form.value,
              email: email,
              userTypeId: this.form.value.userId,
              agentId: agentId,
            },
          })
        ),
        switchMap(() =>
          this.api.createOtp({
            body: {
              ...this.form.value,
              email: this.form.value.email.toLowerCase(),
            },
          })
        )
      )
      .subscribe({
        next: () => {
          this.form.reset();
          this.signupLabel = 'Continue';
          this.loading = false;
          this.toast.show('Account Created Successfully', 'success');
          this.router.navigate(['verify-otp', email, 'sign up']);
        },
        error: () => {
          this.loading = false;
          this.signupLabel = 'Sign Up';
        },
      });
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
}
