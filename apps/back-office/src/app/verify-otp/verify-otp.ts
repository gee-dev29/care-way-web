import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  Authentication,
  ButtonComponent,
  InputComponent,
  ToastService,
} from '@healbridge/ui';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '@healbridge/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DisplayLayout, PageLayout } from '@healbridge/shared';

@Component({
  selector: 'back-office-verify-otp',
  imports: [
    Authentication,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerifyOtp implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private displayLayout = inject(DisplayLayout);
  loading = false;
  label = 'Confirm';
  email: string;
  form: FormGroup;
  otp = new FormControl('', [Validators.required, Validators.minLength(4)]);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.email = params.email;
    });
    this.form = this.formBuilder.group({
      otp: this.otp,
    });
  }

  resendOtp() {
    this.api
      .createOtp({
        body: {
          identity: this.email.toLowerCase(),
          email: this.email.toLowerCase(),
        },
      } as any)
      .subscribe(() => {
        this.toastr.show(`Otp resent to ${this.email}`, 'success');
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
      } as any)
      .subscribe({
        next: (response: any) => {
          this.label = 'Click to Verify';
          this.loading = false;
          this.toastr.show('OTP Successfully', 'success');
          const auth = response.headers.get('x-authorization');
          this.auth.saveAuthentication(auth);
          this.router.navigateByUrl('set-password');
        },
        error: () => {
          this.loading = false;
          this.label = 'Confirm';
        },
      });
  }
}
