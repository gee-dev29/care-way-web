import { CurrencyPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../toast';
@Component({
  selector: 'ui-validate-otp',
  imports: [IonIcon, ButtonComponent, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './validate-otp.html',
  styleUrl: './validate-otp.css',
})
export class ValidateOtp implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  @Input() amount: number;
  @Input() api: any;
  @Input() withdrawalId: string;
  @Input() moduleType: moduleType;
  @Input() email: string;
  @Input() facilityId: string;
  @Input() facilityType: string;

  @Output() back = new EventEmitter<void>();

  otpForm: FormGroup;
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  readonly resendDelay = 60;
  countdown = this.resendDelay;
  canResend = false;
  resending = false;
  loading = false;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    addIcons({ chevronBackOutline });
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(4)
          .fill('')
          .map(() =>
            this.fb.control('', [
              Validators.required,
              Validators.pattern('[0-9]'),
            ])
          )
      ),
    });
  }

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  resendOtp() {
    if (!this.canResend || this.resending) return;
    this.resending = true;

    this.api.sendWithdrawalOtp({ withdrawalId: this.withdrawalId }).subscribe({
      next: () => {
        this.resending = false;
        this.startCountdown();
      },
      error: () => {
        this.resending = false;
      },
    });
  }

  submit() {
    if (this.otpForm.invalid || this.loading) return;

    const otp = this.otpArray.value.join('');

    this.loading = true;
    this.api
      .verifyWithdrawalOtp({
        withdrawalId: this.withdrawalId,
        body: {
          otp,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.toast.show('OTP verified successfully');
          if (this.facilityId && this.facilityType) {
            this.router.navigateByUrl(
              `dashboard/${this.facilityType}/wallet-history/${this.facilityId}`
            );
          } else {
            this.router.navigateByUrl('dashboard/wallet-history');
          }
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  startCountdown() {
    this.clearTimer();
    this.canResend = false;
    this.countdown = this.resendDelay;
    this.timerId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.clearTimer();
        this.canResend = true;
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get otpArray(): FormArray {
    return this.otpForm.get('otp') as FormArray;
  }

  get otpControls() {
    return this.otpArray.controls;
  }

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (!/^[0-9]$/.test(value)) {
      this.otpArray.at(index).setValue('');
      return;
    }

    if (index < 3) {
      const next = event.target.nextElementSibling;
      if (next) next.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prev = input.previousElementSibling;
        if (prev) (prev as HTMLInputElement).focus();
      }
    }
  }

  routeTo = (url: string) => {
    this.router.navigate([url]);
  };
}
type moduleType = 'Default' | 'Medical Facility' | 'Agent' | 'Staff' | 'Rider';
