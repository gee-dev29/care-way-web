import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonText,
  IonIcon,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  documentOutline,
} from 'ionicons/icons';
import { ReuseableWalletCard } from '../reuseable-wallet-card/reuseable-wallet-card';
import { ButtonComponent } from '../button/button.component';
import moment from 'moment';

@Component({
  selector: 'ui-wallet-history',
  imports: [
    IonText,
    IonIcon,
    DecimalPipe,
    ReuseableWalletCard,
    ButtonComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './wallet-history.html',
  styleUrl: './wallet-history.css',
})
export class WalletHistory implements OnInit {
  moment = moment;
  @Input() api: any;
  @Input() auth: any;
  @Input() balance: number | undefined = 0;
  @Input() currency = 'NGN';
  @Output() withdraw = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() viewOrder = new EventEmitter<any>();

  orders: any[] = [];
  filteredOrders: any[] = [];
  skip = 0;
  limit = 20;
  totalRecords = 0;
  hasMore = true;
  isLoading = false;

  activeTab: TabKey = 'All';
  tabsText: Tab[] = [
    { key: 'All', label: 'All' },
    { key: 'Inflow', label: 'Inflows' },
    { key: 'Outflow', label: 'OutFlows' },
    { key: 'Declined', label: 'Declined' },
  ];

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline, documentOutline });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  setActiveTab(tab: TabKey): void {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.skip = 0;
    this.totalRecords = 0;
    this.hasMore = true;
    this.orders = [];
    this.filteredOrders = [];
    this.loadTransactions();
  }

  loadMore(event?: InfiniteScrollCustomEvent): void {
    if (!this.hasMore || this.isLoading) {
      event?.target.complete();
      return;
    }

    this.skip += this.limit;
    this.loadTransactions(event);
  }

  private loadTransactions(infiniteEvent?: InfiniteScrollCustomEvent): void {
    this.isLoading = true;
    const params: any = {
      userId: this.auth.getUserId(),
      skip: this.skip,
      limit: this.limit,
    };

    if (this.activeTab !== 'All' && this.activeTab !== 'Declined') {
      params.type = this.activeTab;
    }

    this.api.getWalletTransactions(params).subscribe({
      next: (res: any) => {
        const data = res?.data ?? [];
        this.totalRecords = res?.totalRecords ?? this.totalRecords;
        this.orders = this.skip === 0 ? data : [...this.orders, ...data];
        this.filterOrders();
        this.hasMore = this.orders.length < this.totalRecords;
        this.isLoading = false;
        infiniteEvent?.target.complete();
      },
      error: () => {
        this.isLoading = false;
        infiniteEvent?.target.complete();
      },
    });
  }

  private filterOrders(): void {
    this.filteredOrders =
      this.activeTab === 'All'
        ? this.orders
        : this.orders.filter((order) => order.type === this.activeTab);
  }
  statusLabel(status: TabKey): string {
    return status === 'Outflow'
      ? 'Outflow'
      : status === 'Inflow'
      ? 'Inflow'
      : 'Declined';
  }

  statusClass(status: TabKey): string {
    if (status === 'Inflow') return 'inflow';
    if (status === 'Outflow') return 'outflow';
    if (status === 'Declined') return 'declined';
    return status;
  }
}
type TabKey = 'All' | 'Outflow' | 'Inflow' | 'Declined';

interface Tab {
  key: TabKey;
  label: string;
}
