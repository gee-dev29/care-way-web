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
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApiService,
  ApprovalType,
  NonProfessionalUserType,
} from '@healbridge/api';
import { AuthService, ConversionService, Export } from '@healbridge/shared';
import {
  InputDropDownComponent,
  DesktopButton,
  LimitSize,
  Modal,
  FormBody,
  ConfirmationModalDesktop,
} from '@healbridge/ui';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Table, TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'back-office-approval-table',
  imports: [
    DesktopButton,
    InputDropDownComponent,
    CommonModule,
    TableModule,
    DatePicker,
    Modal,
    FormBody,
    ConfirmationModalDesktop,
  ],
  templateUrl: './approval-table.html',
  styleUrl: './approval-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApprovalTable implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  conversion = inject(ConversionService);
  auth = inject(AuthService);
  exportService = inject(Export);

  @Input() approvalListType: 'pending' | 'waiting' = 'pending';
  @Input() heading: string;
  @Input() showCheckbox = false;
  @Input() showStaffName = false;
  @Input() showViewButton = false;

  @ViewChild('dt1') dt1: Table;

  approvals$: Observable<any>;
  users$: Observable<
    {
      userId?: string;
      email?: string;
      name?: string;
      phone?: string;
    }[]
  >;

  totalRecords = 0;

  switchApprovalModal = false;
  loading = false;
  form: FormGroup;

  userId = new FormControl('', [Validators.required]);

  tableEvent$ = new BehaviorSubject<any>('');

  exportData$: Observable<any>;

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
    this.form.setControl('userId', this.userId);

    this.users$ = this.api
      .getAllUsers({
        skip: 0,
        limit: LimitSize.DropDown,
        userType: NonProfessionalUserType.Staff as any,
      })
      .pipe(
        map((response: any) =>
          response.data.map((user: any) => ({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          }))
        )
      );
  }

  view(item: any) {
    const path = new URL(item.path).pathname.substring(1);
    this.router.navigateByUrl(path);
  }

  filterByType(type: any) {
    this.approvalTypeFilter.next(type?.value || '');
  }

  filterByDate(event: any) {
    const date = event ? moment(event).format('YYYY-MM-DD') : '';
    this.dateFilter.next(date);
  }

  filterByStaff(type: any) {
    this.staffFilter.next(type?.value || '');
  }

  load(event: any) {
    this.tableEvent$.next(event);

    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
      description: event.filters?.description?.value || undefined,
    };
    this.staffFilter.subscribe((staff) => {
      this.filters = {
        ...this.filters,
        userId: staff || undefined,
      };
      this.getAllPendingApproval(this.filters);
    });
    this.dateFilter.subscribe((date: any) => {
      this.filters = {
        ...this.filters,
        date: date || undefined,
      };
      if (this.approvalListType === 'waiting') {
        this.getAllWaitingApproval(this.filters);
      } else {
        this.getAllPendingApproval(this.filters);
      }
    });
    this.approvalTypeFilter.subscribe((approvalType: any) => {
      this.filters = {
        ...this.filters,
        approvalType: approvalType || undefined,
      };
      if (this.approvalListType === 'waiting') {
        this.getAllWaitingApproval(this.filters);
      } else {
        this.getAllPendingApproval(this.filters);
      }
    });

    if (this.approvalListType === 'waiting') {
      this.getAllWaitingApproval(this.filters);
    } else {
      this.getAllPendingApproval(this.filters);
    }
  }

  getAllPendingApproval(filter: any) {
    this.approvals$ = this.api.getAllPendingApprovals({ ...filter }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;

        this.exportData$ = this.api.getAllPendingApprovals({
          ...filter,
          skip: 0,
          limit: response.totalRecords,
        });
      }),
      map(({ data }) => data)
    );
  }

  getAllWaitingApproval(filter: any) {
    this.approvals$ = this.api.getAllApprovalLists({ ...filter }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;

        this.exportData$ = this.api.getAllApprovalLists({
          ...filter,
          skip: 0,
          limit: response.totalRecords,
        });
      }),
      map(({ data }) => data)
    );
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
    if (this.approvalListType == 'pending') {
      this.api
        .getAllPendingApprovals({
          ...this.filters,
          limit: this.totalRecords,
        })
        .subscribe((approvals: any) => {
          this.exportService.exportExcel(
            approvals.data,
            'All Pending Approvals'
          );
        });
    } else {
      this.api
        .getAllApprovalLists({
          ...this.filters,
          limit: this.totalRecords,
        })
        .subscribe((approval: any) => {
          this.exportService.exportExcel(
            approval.data,
            'All Waiting Approvals'
          );
        });
    }
  }

  openSwitchModal() {
    this.switchApprovalModal = true;
  }

  switch() {
    const approvalIds = [...this.selected.values()];

    this.loading = true;

    if (this.approvalListType === 'pending') {
      this.api
        .switchUserPendingApproval({
          body: {
            approvalIds: approvalIds,
            userId: this.form.value.userId,
          },
        })
        .subscribe({
          next: () => {
            this.loading = false;

            this.selected.clear();
            if (this.dt1) {
              this.dt1.selection = [];
              this.dt1.updateSelectionKeys();
            }
            this.userId.reset();
            this.switchApprovalModal = false;
            this.toastr.success('Approval Switch Done Successfully');
            this.load(this.tableEvent$.getValue());
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.api
        .switchUserApprovalList({
          body: {
            approvalListIds: approvalIds,
            userId: this.form.value.userId,
          },
        })
        .subscribe({
          next: () => {
            this.loading = false;

            this.selected.clear();
            if (this.dt1) {
              this.dt1.selection = [];
              this.dt1.updateSelectionKeys();
            }
            this.userId.reset();
            this.switchApprovalModal = false;
            this.toastr.success('Approval Switch Done Successfully');
            this.load(this.tableEvent$.getValue());
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }
}
