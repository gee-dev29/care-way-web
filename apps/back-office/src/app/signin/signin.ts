import { Component, inject, OnInit } from '@angular/core';
import {
  Authentication,
  ButtonComponent,
  InputComponent,
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
import { ApiService } from '@care-way/api';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  AuthService,
  DisplayLayout,
  PageLayout,
  SetCountry,
} from '@care-way/shared';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'back-office-signin',
  imports: [
    Authentication,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
  standalone: true,
})
export class Signin implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  setCountry = inject(SetCountry);
  loading = false;
  form: FormGroup;
  private auth = inject(AuthService);
  private displayLayout = inject(DisplayLayout);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  showResendOTP: boolean;
  showSetPassword = true;
  showSignInWithPassword: boolean;
  showPasswordInput = true;
  showSignInButton = true;
  showGetOTPButton: boolean;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  signIn() {
    this.loading = true;
    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.logUserIn$Response({
            body: {
              password: this.form.value.password,
              email: this.form.value.email.toLowerCase(),
            },
          })
        )
      )
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.toastr.success('Login Successful!');
          const auth = response.headers.get('x-authorization');
          this.auth.saveAuthentication(auth);
          this.displayLayout.setLayout(PageLayout.Sidebar);
          this.router.navigateByUrl('list-all-customers');
        },
        error: (error) => {
          this.getErrorDetail(error);
          this.loading = false;
        },
      });
  }

  getOTP() {
    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.createOtp({
            body: {
              identity: this.form.value.email.toLowerCase(),
              email: this.form.value.email.toLowerCase(),
            },
          } as any)
        )
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.show('OTP has been sent to your email', 'success');
          this.router.navigate(['verify-otp', this.form.value.email]);
        },
        error: (error) => {
          this.getErrorDetail(error);
          this.loading = false;
        },
      });
  }

  getErrorDetail(error: any) {
    try {
      const body =
        typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
      return this.toastr.error(
        body?.detail ?? body?.message ?? 'An unexpected error occurred'
      );
    } catch {
      return this.toastr.error('An unexpected error occurred');
    }
  }

  signInWithPassword() {
    this.showSetPassword = true;
    this.showPasswordInput = true;
    this.showGetOTPButton = false;
    this.showSignInButton = true;
    this.showSignInWithPassword = false;
  }

  setPassword() {
    this.showSetPassword = false;
    this.showPasswordInput = false;
    this.showGetOTPButton = true;
    this.showSignInButton = false;
    this.showSignInWithPassword = true;
  }
}
