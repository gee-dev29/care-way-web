import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  MedicalAppointmentStatus,
  OrderStatus,
} from '@care-way/api';
import { AuthService } from '@care-way/shared';

import {
  IonContent,
  IonIcon,
  IonImg,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chevronBackOutline,
  desktopOutline,
  locationOutline,
} from 'ionicons/icons';
import { map, Observable, Subject } from 'rxjs';
import { AgencyOrderListCard } from '../agency-order-list-card/agency-order-list-card';
import { AppointmentCard } from '../appointment-card/appointment-card';

@Component({
  selector: 'agency-customer-details',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    IonImg,
    AgencyOrderListCard,
    AppointmentCard,
  ],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css',
})
export class CustomerDetails implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private router = inject(Router);
  private actRoute = inject(ActivatedRoute);
  private auth = inject(AuthService);
  users$: Observable<any>;
  orders: any[] = [];
  appointments: any[] = [];
  private destroy$ = new Subject<void>();
  skip = 0;
  limit = 1000;
  activeTab: any = 'Orders';
  profilePicture: string;
  users: any;
  userId: string;

  constructor() {
    addIcons({
      chevronBackOutline,
      calendarOutline,
      locationOutline,
      desktopOutline,
    });
  }

  tabsText: Tab[] = [
    { key: 'Orders', label: 'Orders' },
    { key: 'Appointments', label: 'Appointments' },
  ];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe((params: any) => {
      this.userId = params.userId;
      const agentId = params.userId;
      this.getAllUsers(agentId);
    });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth) => {
      this.api
        .getMembers({
          referencedDocumentId: this.userId,
        })
        .subscribe((response: any) => {
          this.users = response.data[0];
          this.getProfilePicture(this.users.memberId).subscribe((url: any) => {
            this.profilePicture = url;
          });
          this.getOrders(this.users.memberId);
          this.getAllApppointments(this.users.memberId);
        });
    });
  }

  getProfilePicture(referencedDocumentId: string) {
    return this.api
      .getUploads({ referencedDocumentId })
      .pipe(
        map((response: any[]) =>
          response?.length ? response[response.length - 1].url : null
        )
      );
  }

  getAllUsers(userTypeId: string) {
    this.users$ = this.api
      .getAllUsers({
        userTypeId: userTypeId,
      })
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  getAllApppointments(memberId: string) {
    this.api
      .getMedicalAppointments({
        memberId,
        status: MedicalAppointmentStatus.Confirmed,
        skip: this.skip,
        limit: this.limit,
      })
      .subscribe((res: any) => {
        this.appointments = res?.data ?? [];
      });
  }

  getOrders(memberId: any) {
    this.api
      .getServiceRequestOrders({
        memberId,
        status: OrderStatus.FulfilmentCreated,
        skip: this.skip,
        limit: this.limit,
      } as any)
      .subscribe((response: any) => {
        this.orders = response.data ?? [];
      });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'Orders') {
      this.getOrders(this.users.memberId);
    } else if (tab === 'Appointments') {
      this.getAllApppointments(this.users.memberId);
    }
  }

  routeTo(url: string, id?: string) {
    if (id) {
      return this.router.navigateByUrl(url + `/${id}`);
    }
    return this.router.navigateByUrl(url);
  }
}

type TabKey = 'Orders' | 'Appointments';

interface Tab {
  key: TabKey;
  label: string;
}
