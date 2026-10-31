import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, ApprovalType } from '@care-way/api';
import { AuthService, ConversionService, Export } from '@care-way/shared';
import {
  InputDropDownComponent,
  LimitSize,
  PageBody,
  DesktopButton,
  ConfirmationModalDesktop,
  DesktopInput,
  FormBody,
  Modal,
} from '@care-way/ui';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DatePicker } from 'primeng/datepicker';
import { Table, TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-my-pending-approvals',
  imports: [
    PageBody,
    CommonModule,
    TableModule,
    DatePicker,
    InputDropDownComponent,
    DesktopButton,
    ConfirmationModalDesktop,
    DesktopInput,
    FormBody,
    Modal,
  ],
  templateUrl: './my-pending-approvals.html',
  styleUrl: './my-pending-approvals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyPendingApprovals {
  router = inject(Router);
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  conversion = inject(ConversionService);
  auth = inject(AuthService);
  exportService = inject(Export);

  showCheckbox = true;
  showApprovalRejectionButton = true;
  showViewButton = true;

  approvalsData: any[] = [];

  bulkApprovalConfirmationModal: boolean;
  otpApprovalModal: boolean;
  rejectionModal: boolean;

  approvalConfirmationMessage: string;
  event: any;

  approvalStatus: string;
  approvalStatusEnum = {
    approval: 'isApproval',
    rejection: 'isRejection',
  };
  otpStatus = {
    resend: 'isResend',
  };

  approvals$: Observable<any>;

  totalRecords = 0;

  switchApprovalModal = false;
  loading = false;

  form: FormGroup;
  otpApprovalForm: FormGroup;

  otp = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ]);
  reason = new FormControl('', Validators.required);

  tableEvent$ = new BehaviorSubject<any>('');

  filters: any = {};

  approvalTypes: { key: string; value: string }[] = [];

  approvalTypeFilter = new BehaviorSubject<any>('');
  staffFilter = new BehaviorSubject<any>('');
  dateFilter = new BehaviorSubject<any>('');

  selected = new Map();
  userTypeId: any;

  ngOnInit() {
    this.userTypeId = this.auth.getUserId();
    this.conversion.convert(ApprovalType, this.approvalTypes);

    this.form = this.formBuilder.group({});
    this.form.setControl('reason', this.reason);
    this.otpApprovalForm = this.formBuilder.group({});
    this.otpApprovalForm.setControl('otp', this.otp);
  }

  filterByType(type: any) {
    this.approvalTypeFilter.next(type?.value || '');
  }

  filterByDate(date: any) {
    this.dateFilter.next(date ? moment(date).format('YYYY-MM-DD') : '');
  }

  filterByStaff(type: any) {
    this.staffFilter.next(type?.value || '');
  }

  load(event: any) {
    this.event = event;
    this.tableEvent$.next(event);

    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
      description: event.filters?.description?.value || undefined,
    };
    this.dateFilter.subscribe((date: any) => {
      this.filters = {
        ...this.filters,
        date: date || undefined,
      };
      this.getAllPendingApproval(this.filters);
    });
    this.approvalTypeFilter.subscribe((approvalType: any) => {
      this.filters = {
        ...this.filters,
        approvalType: approvalType || undefined,
      };
      this.getAllPendingApproval(this.filters);
    });
    this.getAllPendingApproval(this.filters);
  }

  getAllPendingApproval(filter: any) {
    this.approvals$ = this.api.getPendingApprovals({ ...filter }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
        this.approvalsData = response.results;
      }),
      map(({ results }) => results)
    );
  }

  view(item: any) {
    const path = new URL(item.path).pathname.substring(1);
    this.router.navigateByUrl(path);
  }

  onRowSelect(event: any) {
    this.selected.set(event.data.approvalId, event.data.approvalId);
  }

  onRowUnselect(event: any) {
    this.selected.delete(event.data.approvalId);
  }

  onHeaderCheckboxToggle(eventData: { $event: any; dt1: Table }) {
    if (eventData.$event.checked) {
      eventData.dt1._selection
        .map((item: any) => item.approvalId)
        .forEach((element: any) => {
          this.selected.set(element, element);
        });
    } else {
      this.selected.clear();
    }
  }

  export() {
    this.api
      .getAllPendingApprovals({
        ...this.filters,
        limit: this.totalRecords,
        userId: this.userTypeId,
      })
      .subscribe((approvals: any) => {
                this.exportService.exportExcel(approvals.data, 'My Pending Approvals');
      });
  }

  openApprovalConfirmationModal() {
    if (this.selected.size === 1) {
      this.approvalConfirmationMessage = 'Do you want to approve this entry?';
    }
    if (this.selected.size > 1) {
      this.approvalConfirmationMessage =
        'Do you want to approve these entries?';
    }
    this.bulkApprovalConfirmationModal = true;
  }

  approve(otp: string | undefined = undefined) {
    const approvalIds = [...this.selected.values()].map((item) => item);
    const payload: any = [];
    approvalIds.forEach((approvalId: any) => {
      payload.push({
        approvalId: approvalId,
        isApproved: true,
        otp: otp,
      });
    });
    this.updatePendingApprovals(payload, otp);
  }

  reject(otp: any | undefined = undefined) {
    const approvalIds = [...this.selected.values()].map((item) => item);
    const payload: any = [];
    approvalIds.forEach((approvalId: any) => {
      payload.push({
        approvalId: approvalId,
        isApproved: false,
        reason: this.reason.value,
        otp: otp,
      });
    });
    this.updatePendingApprovals(payload, otp, true);
  }

  updatePendingApprovals(
    payload: any,
    otp: string | undefined = undefined,
    isRejection = false
  ) {
    const action = isRejection ? 'Rejection' : 'Approval';
    const message =
      this.selected.size > 1
        ? `Bulk ${action} done successfully!`
        : `${action} done successfully!`;
    this.api
      .bulkUpdatePendingApprovals({
        body: { items: payload, ...(otp ? { otp: otp } : {}) },
      } as any)
      .subscribe({
        next: () => {
          if (this.event) {
            this.load(this.event);
          }
          this.selected.clear();
          this.toastr.success(message);
          this.otpApprovalModal = false;
          this.rejectionModal = false;
          this.form.reset();
          this.otpApprovalForm.reset();
        },
      });
  }

  openRejectionModal() {
    this.rejectionModal = true;
  }

  closeRejectionModal() {
    this.rejectionModal = false;
  }

  checkOTPApproval(approvalStatus: string) {
    const withOtp = this.approvalsData.some(
      (item: any) => this.selected.has(item.approvalId) && item.withOTP === true
    );

    if (withOtp) {
      this.generateOtp();
      this.approvalStatus = approvalStatus;
      return;
    }
    if (!withOtp) {
      if (approvalStatus === this.approvalStatusEnum.approval) {
        this.approve();
      }
      if (approvalStatus === this.approvalStatusEnum.rejection) {
        this.reject();
      }
    }
  }

  generateOtp(otpStatus = '') {
    const approvalIds = [...this.selected.values()].map((item) => item);
    if (otpStatus !== this.otpStatus.resend) {
      this.loading = true;
    }
    this.api
      .generatePendingApprovalOtp({
        body: {
          pendingApprovalIds: approvalIds,
        },
      })
      .subscribe({
        next: () => {
          if (otpStatus !== 'isResend') {
            this.loading = false;
            this.bulkApprovalConfirmationModal = false;
            this.otpApprovalModal = true;
          }
          this.toastr.success('Please check your mail inbox for OTP');
        },
        error: () => {
          if (otpStatus !== 'isResend') {
            this.loading = false;
          }
        },
      });
  }

  getApprovalOtp() {
    if (this.approvalStatus === this.approvalStatusEnum.approval) {
      this.approve(this.otpApprovalForm.value.otp);
    }
    if (this.approvalStatus === this.approvalStatusEnum.rejection) {
      this.reject(this.otpApprovalForm.value.otp);
    }
  }

  closeOTPModal() {
    this.otpApprovalModal = false;
    this.otpApprovalForm.reset();
  }
}
