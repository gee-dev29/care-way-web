import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DesktopButton,
  DesktopInput,
  InputDropDownComponent,
  PageBody,
  ConfirmationModal,
  Modal,
  ConfirmationModalDesktop,
} from '@care-way/ui';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import moment from 'moment';
import { DatePickerModule } from 'primeng/datepicker';
import { Table, TableModule } from 'primeng/table';
import {
  AdDeviceType,
  AdStatus,
  AppNames,
  ConversionService,
  Status,
} from '@care-way/shared';
import { ApiService, ApprovalType } from '@care-way/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'back-office-list-all-ads',
  imports: [
    PageBody,
    DesktopButton,
    TableModule,
    CommonModule,
    FormsModule,
    DatePickerModule,
    ConfirmationModalDesktop,
  ],
  templateUrl: './list-all-ads.html',
  styleUrl: './list-all-ads.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllAds {
  router = inject(Router);
  api = inject(ApiService);
  toastr = inject(ToastrService);
  conversion = inject(ConversionService);
  totalRecords = 0;
  ads$: Observable<any>;
  moment = moment;
  filters: object;
  isAdvertModal = false;
  advertId: string;
  endDate: string;
  bulkApprovalInitiationConfirmationModal: boolean;
  bulkApprovalMessage: string;
  event: any;
  selected = new Map();
  selectedAds: any[] = [];

  dateFilter = new BehaviorSubject<any>('');

  ngOnInit(): void {}

  createAd() {
    this.router.navigateByUrl('add-ads');
  }

  filterByDate(value: any) {
    const date = value ? moment(value).format('YYYY-MM-DD') : '';
    this.dateFilter.next(date);
  }

  load(event: any) {
    this.event = event;
    this.filters = {
      skip: event.first,
      limit: event.rows,
    };
    this.dateFilter.subscribe((date) => {
      this.filters = {
        ...this.filters,
        date: date || undefined,
      };
      this.getAllAds();
    });
    this.getAllAds();
  }

  getEndDate(startDate: string, durationInDays: number) {
    if (!startDate || !durationInDays) return '';
    return moment(startDate).add(durationInDays, 'days').format('MMM DD, YYYY');
  }

  getAllAds() {
    this.ads$ = this.api.getAdverts({ ...this.filters }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }

  view(item: any) {
    this.router.navigate(['adds-details', item.advertId]);
  }

  showDeleteModal(item: any) {
    this.advertId = item.advertId;
    this.isAdvertModal = true;
  }

  delete() {
    this.api.deleteAdvert({ advertId: this.advertId }).subscribe(() => {
      this.toastr.success('Advert Deleted Successfully');
      this.getAllAds();
      this.isAdvertModal = false;
    });
  }
  onRowSelect(event: any) {
    this.selected.set(event.data.advertId, event.data.advertId);
  }

  onRowUnselect(event: any) {
    this.selected.delete(event.data.advertId);
  }

  onHeaderCheckboxToggle(eventData: { $event: any; dt1: Table }) {
    if (eventData.$event.checked) {
      eventData.dt1._selection
        .map((item: any) => ({
          advertId: item.advertId,
          status: item.status,
        }))
        .forEach((element: any) => {
          if (element.status === 'Draft' || element.status === 'Rejected') {
            this.selected.set(element.advertId, element.advertId);
          }
        });
    } else {
      this.selected.clear();
    }
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
    const path = `adds-details/${this.advertId}`;

    const payload = approvalIds.map((advertId: string) => ({
      path,
      description: 'Approvals for Advert',
      approvalDocumentId: advertId,
      approvalType: ApprovalType.Advert,
    }));

    this.api.bulkAutoInitiateApproval({ body: payload }).subscribe({
      next: () => {
        this.selected.clear();
        this.selectedAds = [];
        this.toastr.success('Bulk Approval successful!');
        this.load(this.event);
      },
      error: () => {
        this.toastr.error('Bulk Approval failed!');
      },
    });
  }
}
