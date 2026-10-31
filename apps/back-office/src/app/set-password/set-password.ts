import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { DisplayLayout, PageLayout } from '@care-way/shared';
import {
  Authentication,
  InputComponent,
  ButtonComponent,
  ToastService,
} from '@care-way/ui';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'back-office-set-password',
  imports: [
    Authentication,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonText,
  ],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css',
})
export class SetPassword implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastService);
  loading = false;
  form: FormGroup;
  readonly STRONG_PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  showPasswordRules = false;
  passwordRules = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  };
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(this.STRONG_PASSWORD_REGEX),
  ]);
  confirmPassword = new FormControl('', Validators.required);
  displayLayout = inject(DisplayLayout);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
    this.onPasswordInput();
  }

  onPasswordInput() {
    const val = this.password.value || '';
    this.passwordRules.length = val.length >= 8;
    this.passwordRules.lowercase = /[a-z]/.test(val);
    this.passwordRules.uppercase = /[A-Z]/.test(val);
    this.passwordRules.number = /[0-9]/.test(val);
    this.passwordRules.specialChar = /[^A-Za-z0-9]/.test(val);
  }

  onPasswordFocus() {
    this.showPasswordRules = true;
  }

  get passwordsMatch(): boolean {
    return (
      this.password.value === this.confirmPassword.value &&
      !!this.password.value
    );
  }

  proceed() {
    this.loading = true;
    this.api.createPassword({ body: this.form.value }).subscribe({
      next: () => {
        this.toastr.show('Password created successfully!');
        this.displayLayout.setLayout(PageLayout.Sidebar);
        this.router.navigateByUrl('list-all-customers');
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
