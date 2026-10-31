import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  IonImg,
  IonText,
  Platform,
  IonContent,
  IonModal,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input';
import { ToastService } from '../toast';
import { switchMap } from 'rxjs';
import { Biometric } from '../biometric';
import { addIcons } from 'ionicons';
import { body, close } from 'ionicons/icons';
import { PushService } from '../pushservice';

@Component({
  selector: 'ui-login',
  imports: [
    RouterLink,
    IonImg,
    ButtonComponent,
    IonText,
    InputComponent,
    ReactiveFormsModule,
    CommonModule,
    IonContent,
    IonModal,
  ],
  templateUrl: './login.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './login.css',
})
export class SharedLogin implements OnInit {
  @Input() api: any;
  @Input() appModule: any;
  @Input() setCountry: any;
  @Input() authService: any;
  @Input() bgColor: string;
  @Input() environment: any;
  showBiometric = false;
  private router = inject(Router);
  private toast = inject(ToastService);
  biometricService = inject(Biometric);
  platform = inject(Platform);
  isWeb = false;
  firebase: any;
  openMe = false;
  loading = false;
  otpLoading = false;
  loginLabel = 'Login';
  otpLabel = 'Login with OTP';
  form: FormGroup;
  otpLoginForm: FormGroup;
  private formBuilder = inject(FormBuilder);
  identity = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  @Input() FacilityTypeService: any;

  async ngOnInit() {
    this.form = this.formBuilder.group({
      identity: this.identity,
      password: this.password,
    });
    this.showBiometric = await this.biometricService.hasBiometricCredentials(
      this.appModule
    );
    if (this.showBiometric) {
      this.loginWithBiometric();
    }
    if (!this.showBiometric) {
      if (this.authService.isUserLoggedIn()) {
        this.router.navigateByUrl('dashboard/home');
      }
    }

    this.biometricService.isAvailable();
    // this.otpLoginForm = this.formBuilder.group({
    //   identity: this.identity,
    // });
    addIcons({
      close,
    });
  }

  ionViewWillEnter() {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('dashboard/home');
    }
  }

  enableBiometric() {
    this.openMe = true;
  }

  routeTo() {
    this.router.navigateByUrl('signup');
  }

  async loginWithBiometric() {
    try {
      const credential: any = await this.biometricService.loginWithBiometric(
        this.appModule
      );
      if (this.authService.isUserLoggedIn()) {
        this.router.navigate(['/dashboard']);
      } else {
        this.setCountry
          .setDefaultCountry(this.api)
          .pipe(
            switchMap(() =>
              this.api.logUserBiometricIn$Response({
                body: {
                  identity: credential?.username,
                  password: credential.password,
                },
              })
            )
          )
          .subscribe((response: any) => {
            const auth = response.headers.get('x-authorization');
            this.authService.saveAuthentication(auth);
            this.reuse();
          });
      }
    } catch (error) {
      this.toast.show('Biometric authentication was cancelled.', 'error');
    }
  }

  async login() {
    this.loading = true;
    this.loginLabel = 'Logging In';

    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.logUserIn$Response({
            body: {
              ...this.form.value,
              email: this.form.value.identity.toLowerCase(),
            },
          })
        )
      )
      .subscribe({
        next: (response: any) => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          // Object.keys(this.otpLoginForm.controls).forEach((key) => {
          //   this.form.get(key)?.setValue('');
          // });
          const auth = response.headers.get('x-authorization');
          this.authService.saveAuthentication(auth);
          if (this.biometricService.isNative) {
            this.biometricService.enableBiometric(
              this.form.value.identity.toLowerCase(),
              auth,
              this.appModule
            );
          }
          // this.api.setBiometricPassword({ password: this.form.value.password });
          this.reuse();
        },
        error: () => {
          this.loading = false;
          this.loginLabel = 'Login';
        },
      });
  }
  loginWithOtp() {
    this.otpLoading = true;
    this.otpLabel = 'Please Wait';

    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.createOtp({
            body: { email: this.otpLoginForm.value.identity.toLowerCase() },
          })
        )
      )
      .subscribe({
        next: () => {
          this.toast.show(
            `Otp sent successfully to ${this.otpLoginForm.value.identity}`,
            'success'
          );

          this.otpLabel = 'Login with OTP';
          this.otpLoading = false;

          this.router.navigate([
            'verify-otp',
            this.otpLoginForm.value.identity,
            'otp-login',
          ]);
        },

        error: (err: any) => {
          this.toast.show(
            err?.error?.message || 'Something went wrong. Try again.',
            'error'
          );

          this.otpLabel = 'Login with OTP';
          this.otpLoading = false;
        },
      });
  }

  close() {
    this.openMe = !this.openMe;
  }

  reuse() {
    this.authService.userDetail(this.api, (auth: any) => {
      const user = auth;
      this.toast.show('Logged in successfully', 'success');
      this.loginLabel = 'Login';
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
        this.router.navigateByUrl('/dashboard/home');
      } else if (user?.userType === 'Agent' && user?.userTypeId) {
        this.router.navigateByUrl(
          `/dashboard/add-bank-agency/${user.userTypeId}`
        );
      } else {
        switch (user?.userType) {
          case 'Pharmacist':
            this.FacilityTypeService.setFacilityType('Pharmacy');
            this.router.navigateByUrl('/dashboard');
            break;
          case 'Nurse':
            this.FacilityTypeService.setFacilityType('Hospital');
            this.router.navigateByUrl('/dashboard');
            break;
          case 'Pharmacy Staff':
            this.FacilityTypeService.setFacilityType('Pharmacy');
            this.router.navigateByUrl('/dashboard');
            break;
          case 'Blood Bank Staff':
            this.FacilityTypeService.setFacilityType('Blood Bank');
            this.router.navigateByUrl('/dashboard');
            break;
          case 'Laboratory Staff':
            this.FacilityTypeService.setFacilityType('Laboratory');
            this.router.navigateByUrl('/dashboard');
            break;
          case 'Radiology Staff':
            this.FacilityTypeService.setFacilityType('Radiology');
            this.router.navigateByUrl('/dashboard');
            break;
          default:
            this.router.navigateByUrl('/dashboard');
            break;
        }
      }
    });
  }
}
