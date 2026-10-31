import { CommonModule } from '@angular/common';
import {
  Component,
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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityType } from '@care-way/shared';
import { DesktopButton, ToastService, DesktopInput } from '@care-way/ui';
import moment from 'moment';
import { v4 } from 'uuid';

@Component({
  selector: 'shared-add-bank-account-details',
  imports: [
    CommonModule,
    FormsModule,
    DesktopButton,
    ReactiveFormsModule,
    DesktopInput,
  ],
  templateUrl: './add-bank-account-details.html',
  styleUrl: './add-bank-account-details.css',
})
export class AddBankAccountDetails implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  @Input() api: any;
  @Input() route: any;
  @Input() backRoute: any;
  @Input() facilityType: any;
  edit = '';
  facilityId: string;
  facilityTypeId: string;
  loading = false;
  label = 'Continue';
  form: FormGroup;
  bankAccountId = new FormControl(v4(), [Validators.required]);
  referencedDocumentId = new FormControl('', [Validators.required]);
  accountNumber = new FormControl('', [Validators.required]);
  bank = new FormControl('', Validators.required);
  accountName = new FormControl('', Validators.required);
  @Output() saved = new EventEmitter<{ id: string; type: string }>();
  @Output() cancelled = new EventEmitter<void>();
  @Input() hospitalId: string;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      bankAccountId: this.bankAccountId,
      referencedDocumentId: this.referencedDocumentId,
      accountNumber: this.accountNumber,
      bank: this.bank,
      accountName: this.accountName,
    });

    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.form.patchValue({ referencedDocumentId: this.facilityId });
      if (params.bankAccountId) {
        this.api
          .getFacilityTypeBankAccount({
            facilityTypeId: this.hospitalId,
          })
          .subscribe((response: any) => {
            response.forEach((bank: any) => {
              if (bank.bankAccountId === params.bankAccountId) {
                this.form.patchValue(bank);
              }
            });
          });
      }
    });
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    this.api
      .addFacilityTypeBankAccount({
        facilityType: this.facilityType,
        facilityTypeId: this.hospitalId,
        body: this.form.value,
      })
      .subscribe({
        next: () => {
          if (this.edit) {
            this.toast.show('Bank Account updated successfully', 'success');
          } else {
            this.toast.show('Bank Account added successfully', 'success');
          }
          this.saved.emit({ id: this.hospitalId, type: this.facilityType });
          this.form.reset();
        },
        error: () => {
          this.label = 'Continue';
          this.loading = false;
        },
        complete: () => {
          this.label = 'Continue';
          this.loading = false;
        },
      });
  }
  cancel() {
    this.cancelled.emit();
  }
}
