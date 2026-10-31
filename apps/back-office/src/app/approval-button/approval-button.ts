import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
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
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { ApprovalMethod, LimitSize } from '@care-way/shared';
import {
  DesktopButton,
  DesktopInput,
  InputDropDownComponent,
  Modal,
  SplitButtonComponent,
} from '@care-way/ui';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputOtpModule } from 'primeng/inputotp';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { map, Observable } from 'rxjs';
import { v4 } from 'uuid';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'back-office-approval-button',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DesktopButton,
    DesktopInput,
    InputDropDownComponent,
    Modal,
    SplitButtonComponent,
    InputNumberModule,
    InputOtpModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './approval-button.html',
  styleUrl: './approval-button.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApprovalButton implements OnInit, OnDestroy {
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  approvalService = inject(ApprovalService);
  @Input() description = '';
  @Input() amount: any;
  @Input() approvalMethod = ApprovalMethod.Both;
  @Output() approvalAction = new EventEmitter<string>();
  approvalMethods = ApprovalMethod;
  approval$ = this.approvalService.approval$;
  approvalRoutes$: Observable<any>;
  loading = false;
  requestModal = false;
  autoApprovalModal = false;
  approveModal = false;
  rejectModal = false;
  queryModal = false;
  otpModal = false;
  approvers: any[] = [];
  staffs: any[] = [];
  selectedRoute: any;
  openApproverForm = false;
  selectedApproverIndex: number | null = null;
  pendingDecision: 'approve' | 'reject' | null = null;
  counter = 0;
  interval: any;
  form: FormGroup;
  approverForm: FormGroup;
  rejectForm: FormGroup;
  queryForm: FormGroup;
  otpForm: FormGroup;
  approvalRoute = new FormControl('', Validators.required);
  withOTP = new FormControl(false);
  approverId = new FormControl('', Validators.required);
  sla = new FormControl<any>(null, [Validators.required, Validators.min(1)]);
  reason = new FormControl('', Validators.required);
  query = new FormControl('', Validators.required);
  otp = new FormControl('', [Validators.required, Validators.minLength(6)]);
  items: MenuItem[] = [
    {
      label: 'Manual Approval',
      icon: 'pi pi-users',
      command: () => this.openRequestModal(),
    },
    {
      label: 'Auto Approval',
      icon: 'pi pi-bolt',
      command: () => (this.autoApprovalModal = true),
    },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      approvalRoute: this.approvalRoute,
      withOTP: this.withOTP,
    });
    this.approverForm = this.formBuilder.group({
      approverId: this.approverId,
      sla: this.sla,
    });
    this.rejectForm = this.formBuilder.group({ reason: this.reason });
    this.queryForm = this.formBuilder.group({ query: this.query });
    this.otpForm = this.formBuilder.group({ otp: this.otp });
  }

  startApproval() {
    if (this.approvalMethod === ApprovalMethod.Automatic) {
      this.autoApprovalModal = true;
    } else {
      this.openRequestModal();
    }
  }

  openRequestModal() {
    this.form.reset({ approvalRoute: '', withOTP: false });
    this.selectedRoute = null;
    this.approvers = [];
    this.cancelApprover();
    this.requestModal = true;
    this.approvalRoutes$ = this.api.getApprovalRoutes({
      approvalType: this.approvalService.approvalType,
      amount: this.amount ? `${this.amount}` : undefined,
    });
  }

  getSelectedRoute(route: any) {
    this.selectedRoute = route;
    this.approvers = (route?.approvers ?? []).map((approver: any) => ({
      userId: approver.approverId ?? approver.userId ?? approver.id,
      name: approver.name,
      slaInHours: Number(approver.slaInHours) || 0,
      cannotChange: !!approver.cannotChange,
    }));
    this.cancelApprover();
  }

  openApprover(index: number | null = null) {
    this.getStaffs();
    this.selectedApproverIndex = index;
    const approver = index === null ? null : this.approvers[index];
    this.approverForm.reset({
      approverId: approver?.userId ?? '',
      sla: approver?.slaInHours ?? null,
    });
    this.openApproverForm = true;
  }

  cancelApprover() {
    this.openApproverForm = false;
    this.selectedApproverIndex = null;
  }

  saveApprover() {
    const { approverId, sla } = this.approverForm.value;
    const staff = this.staffs.find((item) => item.userId === approverId);
    if (!staff) return;
    const index = this.selectedApproverIndex;
    const exists = this.approvers.some(
      (approver, i) => approver.userId === approverId && i !== index
    );
    if (exists) {
      this.toastr.warning(`${staff.name} is already an approver`);
      return;
    }
    const approver = {
      userId: approverId,
      name: staff.name,
      slaInHours: Number(sla),
      cannotChange: false,
    };
    if (index === null) {
      this.approvers = [...this.approvers, approver];
    } else {
      this.approvers = this.approvers.map((item, i) =>
        i === index ? approver : item
      );
    }
    this.cancelApprover();
  }

  removeApprover(index: number) {
    this.approvers = this.approvers.filter((_, i) => i !== index);
    this.cancelApprover();
  }

  moveApprover(index: number, offset: number) {
    const target = index + offset;
    if (target < 0 || target >= this.approvers.length) return;
    const approvers = [...this.approvers];
    [approvers[index], approvers[target]] = [
      approvers[target],
      approvers[index],
    ];
    this.approvers = approvers;
    this.cancelApprover();
  }

  getStaffs() {
    if (this.staffs.length) return;
    this.api
      .getAllUsers({
        userType: NonProfessionalUserType.Staff as any,
        limit: LimitSize.DropDown,
      })
      .pipe(map((response: any) => response.data ?? []))
      .subscribe((data: any[]) => {
        this.staffs = data.map((user) => ({
          userId: user.userId,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        }));
      });
  }

  initiateApproval() {
    this.loading = true;
    this.api
      .initiateApproval({
        approvalId: v4(),
        body: {
          path: location.href,
          approvalType: this.approvalService.approvalType,
          approvalDocumentId: this.approvalService.documentId,
          description: this.description,
          withOTP: !!this.form.value.withOTP,
          approvers: this.approvers.map((approver) => ({
            userId: approver.userId,
            slaInHours: `${approver.slaInHours}`,
            cannotChange: approver.cannotChange,
          })),
        },
      })
      .subscribe({
        next: () =>
          this.onSuccess('Approval request sent', 'initiate-approval'),
        error: () => (this.loading = false),
      });
  }

  autoInitiateApproval() {
    this.loading = true;
    this.api
      .autoInitiateApproval({
        approvalId: v4(),
        body: {
          path: location.href,
          approvalType: this.approvalService.approvalType,
          approvalDocumentId: this.approvalService.documentId,
          description: this.description,
        },
      })
      .subscribe({
        next: () => this.onSuccess('Approval initiated', 'auto-approval'),
        error: () => (this.loading = false),
      });
  }

  openReject() {
    this.rejectForm.reset();
    this.rejectModal = true;
  }

  openQuery() {
    this.queryForm.reset();
    this.queryModal = true;
  }

  checkOTPApproval(decision: 'approve' | 'reject') {
    if (this.approvalService.getApproval()?.withOTP) {
      this.pendingDecision = decision;
      this.generateOtp();
    } else {
      this.updateApproval(decision);
    }
  }

  generateOtp() {
    this.loading = true;
    this.api
      .generatePendingApprovalOtp({
        body: {
          pendingApprovalIds: [this.approvalService.getApproval()?.approvalId],
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Please check your mail inbox for OTP');
          this.approveModal = false;
          this.rejectModal = false;
          this.otpForm.reset();
          this.otpModal = true;
          this.startCounter();
        },
        error: () => (this.loading = false),
      });
  }

  startCounter() {
    clearInterval(this.interval);
    this.counter = 30;
    this.interval = setInterval(() => {
      this.counter--;
      if (this.counter <= 0) clearInterval(this.interval);
    }, 1000);
  }

  submitOtp() {
    if (this.pendingDecision && this.otpForm.valid) {
      this.updateApproval(this.pendingDecision, this.otpForm.value.otp);
    }
  }

  updateApproval(decision: 'approve' | 'reject', otp?: string) {
    const isApproved = decision === 'approve';
    this.loading = true;
    this.api
      .updatePendingApproval({
        approvalId: this.approvalService.getApproval()?.approvalId,
        body: {
          isApproved,
          otp,
          reason: isApproved ? undefined : this.rejectForm.value.reason,
        },
      })
      .subscribe({
        next: () =>
          this.onSuccess(
            isApproved ? 'Document approved' : 'Document rejected',
            isApproved ? 'approve' : 'reject'
          ),
        error: () => (this.loading = false),
      });
  }

  createQuery() {
    this.loading = true;
    this.api
      .createQuery({
        referencedDocumentId: this.approvalService.documentId,
        body: {
          query: this.queryForm.value.query,
          queryId: v4(),
          approvalType: this.approvalService.approvalType,
        },
      })
      .subscribe({
        next: () => this.onSuccess('Query created successfully', 'query'),
        error: () => (this.loading = false),
      });
  }

  onSuccess(message: string, action: string) {
    this.loading = false;
    this.toastr.success(message);
    this.requestModal = false;
    this.autoApprovalModal = false;
    this.approveModal = false;
    this.rejectModal = false;
    this.queryModal = false;
    this.otpModal = false;
    this.pendingDecision = null;
    clearInterval(this.interval);
    this.approvalService.refresh();
    this.approvalAction.emit(action);
  }
}
