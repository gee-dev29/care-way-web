import { Component, inject, Input, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input';
import { IonImg, IonText, IonContent } from '@ionic/angular/standalone';
import { ToastService } from '../toast';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-set-password',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    CommonModule,
    IonImg,
    IonText,
    CommonModule,
    IonContent,
  ],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css',
})
export class SharedSetPassword implements OnInit {
  @Input() api: any;
  @Input() route: any;
  @Input() bgColor: any;
  @Input() facilityId: string;
  @Input() auth: any;
  @Input() userType: any;
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toast = inject(ToastService);
  readonly STRONG_PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(this.STRONG_PASSWORD_REGEX),
  ]);
  confirmPassword = new FormControl('', Validators.required);
  form: FormGroup;
  label = 'Proceed';
  loading = false;
  isProceeding = false;
  showPasswordRules = false;
  passwordRules = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  };
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
    this.onPasswordInput();
  }

  get passwordsMatch(): boolean {
    return (
      this.password.value === this.confirmPassword.value &&
      !!this.password.value
    );
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

  onPasswordBlur() {
    if (this.isProceeding) {
      return;
    }
    // this.showPasswordRules = false;
  }

  proceed() {
    this.isProceeding = false;
    if (this.form.value.password != this.form.value.confirmPassword) {
      return this.toast.show("Password doesn't match", 'error');
    } else {
      this.loading = true;
      this.label = 'Setting Password';
      this.api.createPassword({ body: this.form.value }).subscribe({
        next: (res: any) => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.label = 'Proceed';
          this.auth.userDetail(this.api, (auth: any) => {
            const user = auth;
            this.toast.show('Logged in successfully', 'success');
            this.loading = false;
            if (user?.userType === 'Medical Facility' && user?.userTypeId) {
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
            } else if (user?.userType === 'Doctor' && user?.userTypeId) {
              this.router.navigate(['/doctor-dashboard', user.userTypeId]);
            } else if (user?.userType === 'Nurse' && user?.userTypeId) {
              this.router.navigate(['/nurse-dashboard', user.userTypeId]);
            } else if (user?.userType === 'Rider' && user?.userTypeId) {
              this.router.navigate([
                '/dashboard/add-rider-license',
                user.userTypeId,
              ]);
            } else if (user?.userType === 'Agent' && user?.userTypeId) {
              // this.router.navigate(['/dashboard/home']);
              this.router.navigate([
                '/dashboard/add-bank-agency',
                user.userTypeId,
              ]);
            } else {
              switch (user?.userType) {
                case 'Pharmacist':
                  this.router.navigateByUrl('/dashboard');
                  break;
                case 'Nurse':
                  this.router.navigateByUrl('/dashboard');
                  break;
                case 'Pharmacy Staff':
                  this.router.navigateByUrl('/dashboard');
                  break;
                case 'Blood Bank Staff':
                  this.router.navigateByUrl('/dashboard');
                  break;
                case 'Laboratory Staff':
                  this.router.navigateByUrl('/dashboard');
                  break;
                case 'Radiology Staff':
                  this.router.navigateByUrl('/dashboard');
                  break;
                default:
                  this.router.navigateByUrl('/dashboard');
                  break;
              }
            }
          });
        },
        error: (err: any) => {
          this.label = 'Proceed';
          this.loading = false;
        },
      });

      return;
    }
  }
}
