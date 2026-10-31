import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonIcon, IonInput, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  checkmarkCircle,
  chevronBackOutline,
  ellipseOutline,
} from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { ReuseableWalletCard } from '../reuseable-wallet-card/reuseable-wallet-card';

@Component({
  selector: 'ui-wallet-withdraw',
  imports: [IonIcon, IonInput, IonText, ButtonComponent, ReuseableWalletCard],
  templateUrl: './wallet-withdraw.html',
  styleUrl: './wallet-withdraw.css',
})
export class WalletWithdraw {
  @Input() balance: number | undefined = 0;
  @Input() loading = false;
  @Output() initiateWithdrawal = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();
  @Input() bankDetails: BankDetails[] | null | undefined;
  @Output() addBank = new EventEmitter<void>();

  amount = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
  ]);

  private currencyPipe = inject(CurrencyPipe);
  displayValue = '';
  selectedBankAccountId: string | undefined;
  @Output() bankAccountSelected = new EventEmitter<string>();

  constructor() {
    addIcons({
      chevronBackOutline,
      checkmarkCircle,
      ellipseOutline,
      addCircleOutline,
    });
  }

  selectBank(bank: BankDetails): void {
    this.selectedBankAccountId = bank.bankAccountId;
    this.bankAccountSelected.emit(bank.bankAccountId);
  }

  onAmountInput(event: CustomEvent): void {
    const raw = (event.detail.value as string)?.replace(/[^0-9.]/g, '') ?? '';
    const num = parseFloat(raw);
    const valid = raw !== '' && !isNaN(num);
    this.amount.setValue(valid ? num : null);
    this.displayValue = valid
      ? this.currencyPipe.transform(num, 'NGN', 'symbol', '1.0-0') ?? raw
      : raw;
  }

  onAmountFocus(): void {
    this.displayValue = this.amount.value?.toString() ?? '';
  }

  onAmountBlur(): void {
    const val = this.amount.value;
    this.displayValue =
      val != null
        ? this.currencyPipe.transform(val, 'NGN', 'symbol', '1.2-2') ?? ''
        : '';
  }

  onWithdraw(): void {
    if (
      this.amount.invalid ||
      this.amount.value == null ||
      !this.selectedBankAccountId
    )
      return;
    this.initiateWithdrawal.emit(this.amount.value);
  }
}

interface BankDetails {
  accountName?: string;
  accountNumber?: number;
  bank?: string;
  bankAccountId?: string;
  bankCode?: string;
  referencedDocumentId?: string;
}
