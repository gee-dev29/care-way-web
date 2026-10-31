import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { IonText, IonContent } from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input';
import { ToastService } from '../toast';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-verify-otp',
  imports: [
    IonText,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    CommonModule,
    IonContent,
  ],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedVerifyOtp implements OnInit {
  @Input() api: any;
  @Input() auth: any;
  @Input() bgColor: any;
  @Input() routeSlug: any;
  @Input() userType: any;
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toast = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  email: string;
  form: FormGroup;
  otp = new FormControl('', [Validators.required, Validators.minLength(4)]);
  loading = false;
  label = 'Click to Verify';
  module: string;
  canDismiss = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.email = params.email;
      this.module = params.module;
    });
    this.form = this.formBuilder.group({
      otp: this.otp,
    });
  }

  resendOtp() {
    this.api
      .createOtp({ body: { email: this.email.toLowerCase() } })
      .subscribe(() => {
        this.toast.show(`Otp resent to ${this.email}`, 'success');
      });
  }

  verify() {
    this.loading = true;
    this.label = 'Verifying';
    this.api
      .validateOtp$Response({
        body: {
          identity: this.email.toLowerCase(),
          email: this.email.toLowerCase(),
          otp: this.form.value.otp,
        },
      })
      .subscribe({
        next: (response: any) => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.label = 'Click to Verify';
          this.loading = false;
          this.toast.show('OTP Successfully', 'success');
          const auth = response.headers.get('x-authorization');
          this.auth.saveAuthentication(auth);
          this.auth.userDetail(this.api, (auth: any) => {
            const user = auth;
            if (this.module === 'otp-login') {
              if (user.userType === 'Doctor') {
                this.router.navigate(['/doctor-dashboard', user.userTypeId]);
              } else if (user.userType === 'Nurse') {
                this.router.navigate(['/nurse-dashboard', user.userTypeId]);
              } else if (user.userType === this.userType.Rider) {
                //
              } else if (
                user?.userType === this.userType.MedicalFacility &&
                user?.userTypeId
              ) {
                this.api
                  .getFacilityTypesOfFacility({ facilityId: user.userTypeId })
                  .subscribe({
                    next: (res: any[]) => {
                      if (res.length > 0) {
                        this.router.navigateByUrl('/dashboard');
                      } else {
                        this.router.navigateByUrl(
                          '/dashboard/onboarding/' + user.userTypeId
                        );
                      }
                    },
                    error: (err: any) => {
                      this.toast.show(err.message, 'error');
                    },
                  });
              } else if (user.userType === this.userType.Agent) {
                this.router.navigateByUrl(
                  `/dashboard/add-bank-agency/${user.userTypeId}`
                );
              } else if (user.userType === this.userType.Default) {
                this.router.navigateByUrl('/dashboard');
              }
            } else {
              if (this.routeSlug != null) {
                this.router.navigate(['/set-password', this.routeSlug]);
              } else {
                this.router.navigateByUrl('/set-password');
              }
            }
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
