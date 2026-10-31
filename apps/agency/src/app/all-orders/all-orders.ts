import { Component, inject } from '@angular/core';
import { MedFacilityDetailCard } from '../med-facility-detail-card/med-facility-detail-card';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyOrderListCard } from '../agency-order-list-card/agency-order-list-card';
import { ApiService } from '@care-way/api';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'agency-all-orders',
  imports: [
    MedFacilityDetailCard,
    IonIcon,
    IonContent,
    AgencyOrderListCard,
    AsyncPipe,
  ],
  templateUrl: './all-orders.html',
  styleUrl: './all-orders.css',
})
export class AllOrders {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);

  orders: any[] = [];
  facilityTypeId: string;
  facilityId: string;
  medDetails$!: Observable<any>;

  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityTypeId = params.facilityTypeId;
      this.facilityId = params.facilityId;
      this.getFacility(this.facilityId);
      this.loadOrders(this.facilityTypeId);
    });
  }

  routeTo() {
    this.router.navigate(['/dashboard/med-facilities', this.facilityId]);
  }

  getFacility(facilityId: string) {
    this.medDetails$ = this.api.getFacility({
      facilityId: facilityId,
    });
  }

  loadOrders(facilityTypeId: string) {
    if (!facilityTypeId) return;

    this.api
      .getFulfilmentOrders({
        facilityTypeId: facilityTypeId,
      })
      .subscribe((res: any) => {
        this.orders = res.data || [];
      });
  }
}
