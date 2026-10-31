import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DesktopInput,
  InputDropDownComponent,
  PageBody,
  Tab,
  UploadCard,
} from '@care-way/ui';
import moment from 'moment';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Observable, of, tap } from 'rxjs';
import { AdsDetailsCard } from '../ads-details-card/ads-details-card';
import { AdDeviceType, AppNames, ConversionService } from '@care-way/shared';
import { ApiService, ApprovalType } from '@care-way/api';
import { ApprovalButton } from '../approval-button/approval-button';
import { ApprovalTimeline } from '../approval-timeline/approval-timeline';
import { ApprovalQueries } from '../approval-queries/approval-queries';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'back-office-adds-details',
  imports: [
    PageBody,
    Tab,
    AdsDetailsCard,
    CommonModule,
    UploadCard,
    DesktopInput,
    InputDropDownComponent,
    TableModule,
    FormsModule,
    DatePickerModule,
    ApprovalButton,
    ApprovalTimeline,
    ApprovalQueries,
  ],
  templateUrl: './adds-details.html',
  styleUrl: './adds-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddsDetails implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  api = inject(ApiService);
  conversion = inject(ConversionService);
  approvalService = inject(ApprovalService);
  moment = moment;
  endDate: string;
  advertId: string;
  approvalDescription = '';
  activeTab = 0;
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Uploads', value: 1, content: 'Uploads' },
    { title: 'Counts', value: 2, content: 'Counts' },
  ];

  ad$: Observable<any>;
  uploads$: Observable<any>;

  totalCountRecords = 0;
  counts$: Observable<any>;

  deviceTypes: { key: string; value: string }[] = [];
  audiences: { key: string; value: string }[] = [];

  ngOnInit() {
    this.conversion.convert(AdDeviceType, this.deviceTypes);
    this.conversion.convert(AppNames, this.audiences);
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.advertId = params.advertId;
      this.getAd(this.advertId);
      this.approvalService.load(this.advertId, ApprovalType.Advert);
    });
  }

  getAd(advertId: string) {
    this.ad$ = this.api.getAdvert({ advertId }).pipe(
      tap((response: any) => {
        this.uploads$ = of(response.assets || []);
        this.endDate = moment(response.startDate)
          .add(response.durationInDays, 'days')
          .format('YYYY-MM-DD');
        this.approvalDescription = `Ad Owner: ${response.adOwner} | Start Date: ${moment(
          response.startDate
        ).format('MMM DD, YYYY')} | Duration: ${response.durationInDays} days`;
      })
    );
  }

  edit(item: any) {
    this.router.navigate(['add-ads'], {
      queryParams: { ...item, advertId: item.advertId },
    });
  }

  filterByDevice(event: any) {
    // TODO: wire up once the Ads endpoint exists
  }

  filterByCountDate(event: any) {
    // TODO: wire up once the Ads endpoint exists
  }

  filterByCountDeviceType(event: any) {
    // TODO: wire up once the Ads endpoint exists
  }

  filterByCountAudience(event: any) {
    // TODO: wire up once the Ads endpoint exists
  }

  loadCounts(event: any) {
    // TODO: replace with this.api.getAdCounts({ adId: this.adId, ...filters }) once the Ads endpoint exists
  }

  back() {
    this.router.navigate(['list-all-ads']);
  }
}
