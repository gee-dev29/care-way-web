import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, ApprovalType } from '@healbridge/api';
import {
  AuthService,
  ConversionService,
  DocumentStatus,
} from '@healbridge/shared';
import {
  DesktopButton,
  Modal,
  FormBody,
  DesktopInput,
  DateInput,
  InputDropDownComponent,
  ConfirmationModalDesktop,
} from '@healbridge/ui';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Table, TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { v4 } from 'uuid';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'back-office-msa-rates-table',
  imports: [
    DesktopButton,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    Modal,
    FormBody,
    DesktopInput,
    DateInput,
    InputDropDownComponent,
    ConfirmationModalDesktop,
  ],
  templateUrl: './msa-rates-table.html',
  styleUrl: './msa-rates-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MsaRatesTable implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  conversion = inject(ConversionService);
  approvalService = inject(ApprovalService);

  @Input() msaType: string;
  @Input() heading: string;

  rate = new FormControl('', [Validators.required]);
  dateOfRate = new FormControl('', [Validators.required]);

  statusTypes: { key: string; value: string }[] = [];
  satusFilter = new BehaviorSubject<any>('');
  totalRecords: number;
  showSetRateModal = false;
  loading = false;
  isEdit = false;
  filters: object;
  msaRates$: Observable<any>;
  msaRateId = v4();
  bulkApprovalInitiationConfirmationModal: boolean;
  bulkApprovalMessage: string;
  event: any;
  approvalType = 'MSA Rate';

  @ViewChild('dt1') dt1: Table;
  form: FormGroup;
  tableEvent$ = new BehaviorSubject<any>('');
  selected = new Map();
  selectedMsaRate: any[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.conversion.convert(DocumentStatus, this.statusTypes);
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      rate: this.rate,
      dateOfRate: this.dateOfRate,
    });
  }

  filterByStatus(event: any) {
    this.satusFilter.next(event);
  }

  onRowSelect(event: any) {
    this.selected.set(event.data.msaRateId, event.data.msaRateId);
  }

  onRowUnselect(event: any) {
    this.selected.delete(event.data.msaRateId);
  }

  onHeaderCheckboxToggle(eventData: { $event: any; dt1: Table }) {
    if (eventData.$event.checked) {
      eventData.dt1._selection
        .map((item: any) => ({
          msaRateId: item.msaRateId,
          status: item.status,
        }))
        .forEach((element: any) => {
          if (element.status === 'Draft' || element.status === 'Rejected') {
            this.selected.set(element.msaRateId, element.msaRateId);
          }
        });
    } else {
      this.selected.clear();
    }
  }

  load(event: any) {
    this.event = event;
    this.tableEvent$.next(event);
    this.filters = {
      skip: event.first,
      limit: event.rows,
    };
    this.satusFilter.subscribe((status) => {
      this.filters = {
        ...this.filters,
        status: status?.value || undefined,
      };
      this.getMsaRates(this.filters);
    });
    this.getMsaRates(this.filters);
  }

  getMsaRates(filter: any) {
    this.msaRates$ = this.api
      .getMsaRates({ ...filter, msaType: this.msaType })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map(({ data }) => data)
      );
  }

  showSetRate() {
    this.isEdit = false;
    this.showSetRateModal = true;
    this.form.reset();
    this.msaRateId = v4();
  }

  edit(item: any) {
    this.isEdit = true;
    this.showSetRateModal = true;
    this.msaRateId = item.msaRateId;

    this.form.patchValue({
      rate: item.rate,
      dateOfRate: item.dateOfRate,
    });
  }

  proceed() {
    this.loading = true;
    const date = moment(this.form.value?.dateOfRate).format('YYYY-MM-DD');
    const payLoad: any = {
      rate: this.form.value?.rate,
      dateOfRate: date,
      msaId: this.msaRateId,
    };

    if (this.isEdit) {
      payLoad.msaRateId = this.msaRateId;
    }

    this.api.setMsaRate({ body: payLoad, msaType: this.msaType }).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(
          this.isEdit
            ? `MSA Rate - ${this.msaType} Edited Successfully`
            : `MSA Rate - ${this.msaType} Set Successfully`
        );
        this.showSetRateModal = false;
        this.getMsaRates(this.filters);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openBulkApprovalConfirmationModal() {
    if (this.selected.size === 1) {
      this.bulkApprovalMessage =
        'Do you want to initiate approval for this entry?';
    }
    if (this.selected.size > 1) {
      this.bulkApprovalMessage =
        'Do you want to initiate approvals for these entries?';
    }
    this.bulkApprovalInitiationConfirmationModal = true;
  }

  approve() {
    const approvalIds = [...this.selected.values()];
    let path: string;

    switch (this.msaType) {
      case 'Wallet':
        path = 'msa-rates/wallet';
        break;
      case 'Investment':
        path = 'msa-rates/investment';
        break;
      case 'Future':
        path = 'msa-rates/future';
        break;
      case 'Target S':
        path = 'msa-rates/target-s';
        break;
      case 'Target M':
        path = 'msa-rates/target-m';
        break;
      case 'Target L':
        path = 'msa-rates/target-l';
        break;
      default:
        path = `msa-rates/${this.msaType.toLowerCase()}`;
    }

    const payload = approvalIds.map((msaRateId: string) => ({
      path,
      description: `Approval for MSA Rate - ${this.msaType}`,
      approvalDocumentId: msaRateId,
      approvalType: this.approvalType as any,
    }));

    this.api.bulkAutoInitiateApproval({ body: payload }).subscribe({
      next: () => {
        this.selected.clear();
        this.selectedMsaRate = [];
        this.toastr.success('Bulk Approval successful!');
        this.load(this.event);
      },
      error: () => {
        this.toastr.error('Bulk Approval failed!');
      },
    });
  }
}
