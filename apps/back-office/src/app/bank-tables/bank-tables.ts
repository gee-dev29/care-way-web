import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import {
  DesktopButton,
  Modal,
  DesktopInput,
  InputDropDownComponent,
  ConfirmationModalDesktop,
  RegisteredBankStatus,
} from '@healbridge/ui';
import { ApiService, BankStatus } from '@healbridge/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { ConversionService } from '@healbridge/shared';

@Component({
  selector: 'back-office-bank-tables',
  imports: [
    CommonModule,
    TableModule,
    // DesktopButton,
    // Modal,
    ReactiveFormsModule,
    // DesktopInput,
    // InputDropDownComponent,
    // ConfirmationModalDesktop,
  ],
  templateUrl: './bank-tables.html',
  styleUrl: './bank-tables.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankTables implements OnInit {
  api = inject(ApiService);
  toastr = inject(ToastrService);
  formBuilder = inject(FormBuilder);
  conversion = inject(ConversionService);
  @Input() heading: string;
  @Input() referencedDocumentId: string;
  banks$: Observable<any>;
  totalRecords = 0;
  // bankStatuses: { key: string; value: string }[] = [];
  // bankStatusFilter = new BehaviorSubject<any>('');
  // addBankModal: boolean = false;
  // statusModal: boolean = false;
  form: FormGroup;
  bankCode = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{3}$'),
  ]);
  bankName = new FormControl('', [Validators.required]);
  bankId = v4();
  currentStatus: string;
  status: BankStatus;
  bankStatus = BankStatus;
  title: string;
  headerStatus: string;
  label: string;
  filters: object;

  ngOnInit(): void {
    this.initializeForm();
    // this.conversion.convert(RegisteredBankStatus, this.bankStatuses);
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      bankId: this.bankId,
      bankCode: this.bankCode,
      bankName: this.bankName,
    });
  }

  // filterByBankStatus(event: any) {
  //   this.bankStatusFilter.next(event);
  // }
  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      bankName: event.filters.bankName?.value || undefined,
    };
    // this.bankStatusFilter.subscribe((bankStatus) => {
    //   this.filters = {
    //     ...this.filters,
    //     status: bankStatus?.value,
    //   };

    //   this.getAllBanks();
    // });
    this.getAllBanks();
  }

  getAllBanks() {
    this.banks$ = this.api.getBanks(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.results)
    );
  }

  // addBank() {
  //   this.addBankModal = true;
  //   this.title = 'Add Bank';
  //   this.label = 'Add';
  // }

  // save() {
  //   if (this.form.invalid) return;

  //   const isEditing = this.label === 'Save';
  //   if (isEditing) {
  //     this.api
  //       .updateBank({
  //         body: {
  //           bankId: this.form.value.bankId,
  //           bankName: this.form.value.bankName,
  //           bankCode: this.form.value.bankCode,
  //           status: this.currentStatus as BankStatus,
  //         },
  //       })
  //       .subscribe({
  //         next: () => {
  //           this.addBankModal = false;
  //           this.toastr.success('Bank Updated Successfully');
  //           this.form.reset();
  //           this.getAllBanks();
  //         },
  //         error: () => {
  //           this.toastr.error('Failed to update bank. Please try again.');
  //         },
  //       });
  //   } else {
  //     this.api
  //       .registerBank({
  //         body: {
  //           ...this.form.value,
  //           bankId: v4(),
  //           status: this.bankStatus.Enable,
  //         },
  //       })
  //       .subscribe({
  //         next: () => {
  //           this.addBankModal = false;
  //           this.toastr.success('Bank Registered Successfully');
  //           this.form.reset();
  //           this.getAllBanks();
  //         },
  //         error: () => {
  //           this.toastr.error('Failed to register bank. Please try again.');
  //         },
  //       });
  //   }
  // }

  // openStatusModal(item: any) {
  //   this.currentStatus = item.status;
  //   this.bankId = item.bankId;
  //   this.statusModal = true;
  //   if (this.currentStatus === this.bankStatus.Disable) {
  //     this.headerStatus = 'Do you want to enable this bank?';
  //   } else {
  //     this.headerStatus = 'Do you want to disable this bank?';
  //   }
  // }

  // proceed() {
  //   if (this.currentStatus === this.bankStatus.Enable) {
  //     this.status = this.bankStatus.Disable;
  //   } else {
  //     this.status = this.bankStatus.Enable;
  //   }
  //   this.api
  //     .enableOrDisableBank({
  //       body: {
  //         bankId: this.bankId,
  //         status: this.status,
  //       },
  //     })
  //     .subscribe(() => {
  //       if (this.currentStatus == this.bankStatus.Enable) {
  //         this.toastr.success('Bank Disabled Successfully');
  //       } else {
  //         this.toastr.success('Bank Enabled Successfully');
  //       }
  //       this.getAllBanks();
  //       this.statusModal = false;
  //     });
  // }

  // edit(event: any) {
  //   this.addBankModal = true;
  //   this.form.patchValue({
  //     ...event,
  //   });
  //   this.title = 'Edit Bank';
  //   this.label = 'Save';
  // }
}
