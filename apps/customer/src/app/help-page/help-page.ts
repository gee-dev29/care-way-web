import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { IonImg, IonText, Platform } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { AuthService, SetCountry } from '@care-way/shared';
import { ButtonComponent, InputComponent, ToastService } from '@care-way/ui';
import { ApiService } from '@care-way/api';

@Component({
  selector: 'app-help-page',
  imports: [
    IonImg,
    ButtonComponent,
    IonText,
    InputComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './help-page.html',
  styleUrl: './help-page.css',
})
export class HelpPage implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private setCountry = inject(SetCountry);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  platform = inject(Platform);
  isWeb = false;
  firebase: any;
  loading = false;
  otpLoading = false;
  loginLabel = 'Confirm';
  orderId: string;
  helpId: string;
  form: FormGroup;
  otpLoginForm: FormGroup;
  private formBuilder = inject(FormBuilder);
  email = new FormControl('', [Validators.required]);
  helpCode = new FormControl('', [Validators.required]);

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.orderId = params.orderId;
      this.helpId = params.helpId;
    });
    this.form = this.formBuilder.group({
      email: this.email,
      helpCode: this.helpCode,
    });
  }

  proceed() {
    this.loading = true;
    this.loginLabel = 'Confirming';
    this.setCountry
      .setDefaultCountry(this.api)
      .pipe(
        switchMap(() =>
          this.api.confirmHelpCode$Response({
            body: this.form.value,
          })
        )
      )
      .subscribe({
        next: (response: any) => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          const helpId = response.headers.get('X-HELP-ID');
          this.loginLabel = 'Confirm';
          this.loading = false;
          this.router.navigate(['help-page-detail', this.orderId, helpId]);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
