import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, NonProfessionalUserType, Gender } from '@care-way/api';
import { ConversionService, SetCountry } from '@care-way/shared';
import { Platform } from '@ionic/angular/common';
import { IonText, IonImg } from '@ionic/angular/standalone';
import { switchMap } from 'rxjs';
import { ButtonComponent, InputComponent, ToastService } from '@care-way/ui';
import { v4 } from 'uuid';

@Component({
  selector: 'rider-signup',
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
  templateUrl: './rider-signup.html',
  styleUrl: './rider-signup.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RiderSignup implements OnInit {
  private conversionService = inject(ConversionService);
  private api = inject(ApiService);
  private router = inject(Router);
  platform = inject(Platform);
  private toast = inject(ToastService);
  isWeb = false;
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
    NonProfessionalUserType.Rider,
    Validators.required
  );
  userId = new FormControl(v4(), Validators.required);
  term = new FormControl(false, Validators.requiredTrue);
  genders: any = [];
  setCountry = inject(SetCountry);

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      userType: this.userType,
      gender: this.gender,
      userId: this.userId,
      term: this.term,
    });
    this.conversionService.convert(Gender, this.genders);
  }

  signup() {
    this.loading = true;
    this.signupLabel = 'Signing Up';
    const email = this.form.value.email.toLowerCase();
    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.signUpUser({
            body: {
              ...this.form.value,
              email: email,
              userTypeId: this.form.value.userId,
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
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
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
}
