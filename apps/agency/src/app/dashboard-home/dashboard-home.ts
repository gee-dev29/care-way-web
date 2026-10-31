import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import {
  AddNewEntryCard,
  CardIdentityType,
  ReuseableWalletCard,
} from '@care-way/ui';
import { IonCard, IonContent } from '@ionic/angular/standalone';
import { map, Observable } from 'rxjs';
import { MedFacilityHomeCard } from '../med-facility-home-card/med-facility-home-card';

@Component({
  selector: 'agency-dashboard-home',
  imports: [
    IonContent,
    MedFacilityHomeCard,
    AddNewEntryCard,
    AsyncPipe,
    IonCard,
    ReuseableWalletCard,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {
  private api = inject(ApiService);
  public auth = inject(AuthService);
  public router = inject(Router);
  agentId: string;
  users$: Observable<any>;
  memberId: string;
  requests: any;
  filters: any;
  usersTotalRecord: number;
  type = CardIdentityType;
  requestTotalRecords: number;
  balance: number | undefined = 0;

  @ViewChild('tabs', { static: false }) tabs?: ElementRef<HTMLElement>;

  ionViewWillEnter() {
    this.getAllUsers();
    this.getFacilities();
    this.agentId = this.auth.getUserId();

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }

  viewIt(item: any) {
    this.router.navigateByUrl(`/dashboard/med-facilities/${item?.facilityId}`);
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }

  getAllUsers() {
    this.users$ = this.api
      .getAllUsers({
        agentId: this.auth.getUserId(),
      })
      .pipe(
        map((res: any) => {
          this.usersTotalRecord = res.totalRecords;
          return res.data;
        })
      );
  }

  getFacilities() {
    this.filters = {
      skip: 0,
      limit: 100,
      agentId: this.auth.getUserId(),
    };
    this.api.getFacilities(this.filters).subscribe((res: any) => {
      this.requestTotalRecords = res.totalRecords;
      return (this.requests = res.data[0]);
    });
  }

  routeTo(url: string) {
    this.router.navigateByUrl(url);
  }
  navigateTo() {
    this.router.navigate(['dashboard/wallet-history']);
  }
}
