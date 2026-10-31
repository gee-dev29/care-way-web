import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { Address } from '@care-way/ui';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  arrowForward,
  chevronBackOutline,
  location,
} from 'ionicons/icons';
import { Observable, of } from 'rxjs';
import { v4 } from 'uuid';
@Component({
  selector: 'app-dashboard-prescription-address',
  imports: [
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonSkeletonText,
    CommonModule,
  ],
  templateUrl: './dashboard-prescription-address.html',
  styleUrl: './dashboard-prescription-address.css',
})
export class DashboardPrescriptionAddress implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  public addressService = inject(Address);
  public auth = inject(AuthService);
  costFlow: string;
  memberId: string;
  serviceRequestId: string;
  addressId: string;

  referralType: any;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postCode: string;
  googlePlaceId: string;
  orderId: string;
  myAddress$: Observable<any>;

  loaded = false;
  constructor() {
    addIcons({ location, addCircleOutline, arrowForward, chevronBackOutline });
  }

  ngOnInit(): void {
    this.auth.userDetail(this.api, (auth) => {
      const id = auth?.jti;
      this.route.params.subscribe((params: any) => {
        this.costFlow = params.flow;
        this.serviceRequestId = params.serviceRequestId;
        this.orderId = params.orderId;
        this.myAddress$ = this.api.getAddresses({
          referencedDocumentId: id,
        } as any);
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }

  addAddress() {
    if (this.orderId) {
      return this.router.navigateByUrl(
        `/dashboard/add-address/${this.costFlow}/${this.serviceRequestId}/${this.orderId}`
      );
    } else {
      return this.router.navigateByUrl(
        `/dashboard/add-address/${this.costFlow}/${this.serviceRequestId}`
      );
    }
  }
  continue(addressSelected: any) {
    this.addressService.address = [];
    this.addressService.address.push(addressSelected);
    if (this.orderId) {
      this.api
        .changeServiceRequestOrderAddress({
          orderId: this.orderId,
          body: addressSelected as any,
        })
        .subscribe(() => {
          return this.router.navigateByUrl(
            `/dashboard/order-details/${this.orderId}`
          );
        });
    } else {
      this.api
        .addServiceRequestAddress({
          serviceRequestId: this.serviceRequestId,
          body: addressSelected as any,
        })
        .subscribe(() => {
          return this.router.navigateByUrl(
            `/dashboard/uploaded-and-address/${this.costFlow}/${this.serviceRequestId}`
          );
        });
    }
  }
  goBack() {
    if (this.orderId) {
      this.router.navigateByUrl(`/dashboard/order-details/${this.orderId}`);
    } else {
      this.router.navigateByUrl(
        `/dashboard/uploaded-and-address/${this.costFlow}/${this.serviceRequestId}`
      );
    }
  }
}
