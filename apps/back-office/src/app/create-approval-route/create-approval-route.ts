import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  ApprovalType,
  NonProfessionalUserType,
} from '@care-way/api';
import { ConversionService } from '@care-way/shared';
import {
  FormBody,
  LimitSize,
  Modal,
  PageBody,
  DesktopButton,
  InputComponent,
  InputDropDownComponent,
  DesktopInput,
  Currency,
} from '@care-way/ui';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { v4 } from 'uuid';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'back-office-create-approval-route',
  imports: [
    FormBody,
    Modal,
    CommonModule,
    PageBody,
    DesktopButton,
    InputComponent,
    InputDropDownComponent,
    DesktopInput,
    TableModule,
  ],
  templateUrl: './create-approval-route.html',
  styleUrl: './create-approval-route.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateApprovalRoute {
  formBuilder = inject(FormBuilder);
  api = inject(ApiService);
  router = inject(Router);
  conversionService = inject(ConversionService);
  activatedRoute = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  location = inject(Location);

  form: FormGroup;
  addApprovalForm: FormGroup;
  approvalLimit = new FormControl(0);
  slaInHours = new FormControl(0, [Validators.required]);
  approvalType = new FormControl('', [Validators.required]);
  routeName = new FormControl('', [Validators.required]);
  currency = new FormControl('');
  canReorder = new FormControl(false, [Validators.required]);
  isFinancial = new FormControl(false, [Validators.required]);
  cannotChange = new FormControl(false, [Validators.required]);
  withOTP = new FormControl(false);
  userId = new FormControl(null, [Validators.required]);
  approvalRouteId = new FormControl(v4());
  currencies: { key: string; value: string }[] = [];
  transactionTypes: { key: string; value: string }[] = [];
  selectedMenu$ = new BehaviorSubject<string>('');
  approvers$ = new BehaviorSubject<any>([]);
  users$: Observable<any>;
  popupOpen = false;
  loading = false;
  showApprovalItemModal = false;
  id: any;
  userType = NonProfessionalUserType;

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
    this.addApprovalForm = this.formBuilder.group({});

    this.addApprovalForm.setControl('cannotChange', this.cannotChange);
    this.addApprovalForm.setControl('userId', this.userId);
    this.addApprovalForm.setControl('slaInHours', this.slaInHours);

    this.conversionService.convert(ApprovalType, this.transactionTypes);
    this.conversionService.convert(Currency, this.currencies);
    this.form.setControl('approvalLimit', this.approvalLimit);
    this.form.setControl('routeName', this.routeName);
    this.form.setControl('currency', this.currency);
    this.form.setControl('approvalType', this.approvalType);
    this.form.setControl('canReorder', this.canReorder);
    this.form.setControl('isFinancial', this.isFinancial);
    this.form.setControl('approvalRouteId', this.approvalRouteId);

    this.users$ = this.api
      .getAllUsers({
        skip: 0,
        limit: LimitSize.DropDown,
        userType: this.userType.Staff as any,
      })
      .pipe(
        map((response: any) =>
          response.data.map((user: any) => ({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          }))
        )
      );
    this.activatedRoute.paramMap.subscribe((params: Params[string]) => {
      this.id = params.params.approvalRouteId;
      if (this.id) {
        this.api
          .getApprovalRoute({
            approvalRouteId: this.id,
          })
          .subscribe((response: any) => {
            this.form.patchValue(response);
            const approvers: any = [];
            response.approvers.forEach((res: any) => {
              approvers.push({
                userId: res.approverId,
                name: res.name,
                cannotChange: res.cannotChange,
                slaInHours: res.slaInHours,
              });
            });

            this.approvers$.next(approvers);
            this.resetApproverForm();
          });
      }
    });

    this.form.setControl('withOTP', this.withOTP);
  }

  openApprovalItemModal() {
    this.showApprovalItemModal = !this.showApprovalItemModal;
  }

  proceed() {
    this.showApprovalItemModal = false;
    const approver = {
      name: this.addApprovalForm.value.userId?.name,
      slaInHours: this.addApprovalForm.value.slaInHours,
      cannotChange: this.addApprovalForm.value.cannotChange,
      userId: this.addApprovalForm.value.userId?.userId,
    };
    this.resetApproverForm();
    this.approvers$.next(this.approvers$.getValue().concat(approver));
  }

  resetApproverForm() {
    this.selectedMenu$.next('approver');
    this.addApprovalForm.controls['userId'].reset();
    this.addApprovalForm.controls['slaInHours'].reset();
    this.addApprovalForm.patchValue({ cannotChange: false });
  }

  removeApprover(i: number) {
    const approvers = this.approvers$.getValue();

    approvers.splice(i, 1);
    this.approvers$.next([...approvers]);

    if (approvers.length === 0) {
      this.selectedMenu$.next('');
    }
  }

  addApprover() {
    this.popupOpen = !this.popupOpen;
  }

  confirmApprovers() {
    this.loading = true;
    const approvalRouteId = this.id ?? v4();

    this.api
      .addApprovalRoute({
        approvalRouteId,
        body: {
          routeName: this.form.value.routeName,
          canReorder: this.form.value.canReorder,
          isFinancial: this.form.value.isFinancial,
          approvalLimit: this.form.value.approvalLimit,
          currency: this.form.value.currency,
          approvalType: this.form.value.approvalType,
          withOTP: this.form.value.withOTP,
          approvers: this.approvers$.getValue(),
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          if (this.id) {
            this.toastr.success('Approval Route Edited Successfully');
          } else {
            this.toastr.success('Approval Route Created Successfully!');
          }
          this.router.navigate(['/approval-route-details', approvalRouteId]);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  back() {
    this.location.back();
  }
}
