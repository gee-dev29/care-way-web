import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { InputComponent } from '../input/input';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-bank-details-form',
  imports: [
    IonContent,
    IonIcon,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './bank-details-form.html',
  styleUrl: './bank-details-form.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankDetailsForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  @Input() heading = '';
  @Input() title = '';
  @Input() subTitle = '';
  @Input() label = '';
  @Input() labelAccountName = '';
  @Input() labelBankName = '';
  @Input() labelAccountNumber = '';
  @Output() back = new EventEmitter<void>();
  @Output() continue = new EventEmitter<void>();
  @Output() selectAccountNumber = new EventEmitter<string>();
  @Output() selectBank = new EventEmitter<string>();
  @Output() selectAccountName = new EventEmitter<string>();

  accountNumber = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{10}$/),
  ]);
  bank = new FormControl('', [Validators.required]);
  accountName = new FormControl('', [Validators.required]);

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      accountNumber: this.accountNumber,
      bank: this.bank,
      accountName: this.accountName,
    });
  }

  goBack() {
    this.back.emit();
  }
  proceed() {
    this.continue.emit();
  }
  handleAccountNumber(event: any) {
    this.accountNumber.setValue(event);
    this.selectAccountNumber.emit(event);
  }
  handleBank(event: any) {
    this.accountNumber.setValue(event);
    this.selectAccountNumber.emit(event);
  }
  handleAccountName(event: any) {
    this.accountNumber.setValue(event);
    this.selectAccountNumber.emit(event);
  }
}
