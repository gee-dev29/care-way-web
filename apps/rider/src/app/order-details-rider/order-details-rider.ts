import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { ButtonComponent, PickupAddressCard } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, locationOutline } from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'rider-order-details-rider',
  imports: [
    IonContent,
    IonIcon,
    PickupAddressCard,
    ButtonComponent,
    IonSkeletonText,
  ],
  templateUrl: './order-details-rider.html',
  styleUrl: './order-details-rider.css',
})
export class OrderDetailsRider implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  skeleton = true;
totalItems = 0;
  loading = false;
  order: any;
  items: any;
  orderId!: string;
  status = true;
  moment = moment;

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'location-outline': locationOutline,
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = params['serviceRequestId'];
      this.loadOrderDetails();
    });
  }

  ionViewWillEnter() {
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  loadOrderDetails() {
    this.api
      .getServiceRequestOrderFulfilments({ orderId: this.orderId })
      .subscribe({
        next: (res: any) => {
          this.items = res;
        },
      });

    this.api.getServiceRequestOrder({ orderId: this.orderId }).subscribe({
      next: (res: any) => {
        this.order = res;
        this.totalItems = this.order?.items?.length || 0;
        this.status = this.order?.status?.toLowerCase() !== 'shipped';
        this.skeleton = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['dashboard/all-orders']);
  }

  proceed() {
    this.router.navigate(['/dashboard/capture-order', this.orderId]);
  }
}
