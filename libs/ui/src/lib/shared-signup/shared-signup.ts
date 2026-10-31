import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonImg, IonText } from '@ionic/angular/standalone';
import { switchMap } from 'rxjs';
import { v4 } from 'uuid';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input';

@Component({
  selector: 'ui-shared-signup',
  imports: [
    RouterLink,
    IonText,
    IonImg,
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent,
    CommonModule,
    FormsModule,
    IonContent,
  ],
  templateUrl: './shared-signup.html',
  styleUrl: './shared-signup.css',
})
export class SharedSignup implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  @Input() toast: any;
  @Input() conversionService: any;
  @Input() countryService: any;
  @Input() api: any;
  @Input() defaultUserType: any;
  @Input() genderEnum: any;
  @Input() bgColor: any;
  @Input() shouldShow = true;

  loading = false;
  signupLabel = 'Continue';
  genders: any = [];

  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);
  gender = new FormControl('', Validators.required);

  userId = new FormControl(v4(), Validators.required);
  term = new FormControl(false, Validators.requiredTrue);
  referral = new FormControl('');
  // updates = new FormControl(false, Validators.required);

  async ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      userType: [this.defaultUserType, Validators.required],
      gender: this.gender,
      userId: this.userId,
      term: this.term,
      // updates: this.updates,
    });
    this.conversionService.convert(this.genderEnum, this.genders);
    if (this.shouldShow) {
      this.form.addControl('referral', this.referral);
    }
  }

  navigateToSignup(): void {
    this.router.navigateByUrl('signup');
  }

  signup() {
    if (this.form.invalid) return;

    this.loading = true;
    this.signupLabel = 'Signing Up';

    const email = this.form.value.email.toLowerCase();

    this.countryService
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
          this.api.createOtp({ body: { ...this.form.value, email: email } })
        )
      )
      .subscribe({
        next: () => {
          this.signupLabel = 'Continue';
          this.loading = false;
          this.toast.show('Account Created Successfully', 'success');

          this.router.navigate(['verify-otp', email, 'sign up']);

          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
        },
        error: () => {
          this.loading = false;
          this.signupLabel = 'Sign Up';
        },
      });
  }
}
