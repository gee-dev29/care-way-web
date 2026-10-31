import { Component, inject, Input, OnInit } from '@angular/core';
import { IonImg, IonText, IonContent } from '@ionic/angular/standalone';

import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from '../input/input';
import { ToastService } from '../toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-forgot-password',
  imports: [
    RouterLink,
    IonText,
    IonImg,
    ButtonComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    CommonModule,
    IonContent,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class SharedForgotPassword implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  @Input() api: any;
  @Input() bgColor: any;
  loading = false;
  loginLabel = 'Get OTP';
  form: FormGroup;
  private formBuilder = inject(FormBuilder);
  identity = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      identity: this.identity,
    });
  }
  routeTo() {
    const identity = this.form.value.identity;
    this.loading = true;
    this.loginLabel = 'Please Wait';
    this.api
      .createOtp({ body: { email: this.form.value.identity.toLowerCase() } })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.toast.show(`Otp sent successfully to ${identity}`, 'success');
          this.loginLabel = 'Get OTP';
          this.loading = false;
          this.router.navigate(['verify-otp', identity, 'forgot-password']);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
