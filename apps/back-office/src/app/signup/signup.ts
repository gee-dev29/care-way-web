import { Component, inject, OnInit } from '@angular/core';
import {
  Authentication,
  ButtonComponent,
  InputComponent,
  ToastService,
} from '@care-way/ui';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { Router } from '@angular/router';
import { ConversionService, Gender, SetCountry } from '@care-way/shared';
import { v4 } from 'uuid';
import { IonText } from '@ionic/angular/standalone';
import { switchMap } from 'rxjs';

@Component({
  selector: 'back-office-signup',
  imports: [
    Authentication,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonText,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  private conversionService = inject(ConversionService);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  setCountry = inject(SetCountry);
  loading = false;
  signupLabel = 'Continue';
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);
  gender = new FormControl('', Validators.required);
  userId = new FormControl(v4(), Validators.required);
  updates = new FormControl(false, Validators.required);
  userType = new FormControl(
    NonProfessionalUserType.Staff,
    Validators.required
  );
  genders: any = [];

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      gender: this.gender,
      userId: this.userId,
      userType: this.userType,
      userTypeId: this.userId,
    });
    this.conversionService.convert(Gender, this.genders);
  }

  signup() {
    this.loading = true;
    this.signupLabel = 'Signing Up';

    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.signUpUser({
            body: 
              this.form.value,
          })
        ),
        switchMap(() => this.api.createOtp({ body: this.form.value }))
      )
      .subscribe({
        next: () => {
          this.signupLabel = 'Continue';
          this.loading = false;
          this.toast.show('Account created successfully', 'success');
          this.router.navigate(['verify-otp', this.form.value.email]);
        },
        error: () => {
          this.loading = false;
          this.signupLabel = 'Sign Up';
        },
      });
  }

  goToSignIn() {
    this.router.navigateByUrl('signin');
  }
}
