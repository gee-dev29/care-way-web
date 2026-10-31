import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, OrderType, ReferralType } from '@care-way/api';
import { ButtonComponent, StorageService } from '@care-way/ui';
import { IonContent, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  notificationsOutline,
  returnUpForwardOutline,
} from 'ionicons/icons';
import { Observable } from 'rxjs';
import { PaymentService } from '../payment-service';

@Component({
  selector: 'app-medical-service-details',
  imports: [CommonModule, IonContent, IonIcon, IonModal, ButtonComponent],
  templateUrl: './medical-service-details.html',
  styleUrl: './medical-service-details.css',
})
export class MedicalServiceDetails implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private storageService = inject(StorageService);
  private paymentService = inject(PaymentService);
  orderType = OrderType;

  requestId: string;
  summary = {
    patientName: '—',
    hospitalName: '—',
    date: '—',
  };

  product$: Observable<any>;
  quantity: number;
  deliveryFee: number;

  subtotal: number;
  serviceCharge: number;

  memberId: string;
  member: any;
  loading = false;

  showPaymentConfirmation = false;

  constructor() {
    addIcons({ chevronBackOutline, returnUpForwardOutline, notificationsOutline });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.requestId = params.requestId;
      this.product$ = this.api.getMedicalProduct({
        medicalProductId: this.requestId,
      });
    });

    this.storageService.user$.subscribe((memberId: any) => {
      this.memberId = memberId;
    });

    this.api.getMember({ memberId: this.memberId }).subscribe((member: any) => {
      this.member = member;
    });

    this.api
      .getServiceRequest({
        memberId: this.memberId,
        serviceRequestId: this.requestId,
        referralType: ReferralType.MedicalProduct,
      })
      .subscribe((serviceRequest: any) => {
      });
  }

  get total() {
    return this.subtotal + this.serviceCharge + (this.deliveryFee ?? 0);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/requests?activeTab=medicalservice');
  }

  proceedToPayment() {
    this.showPaymentConfirmation = true;
  }

  confirmProceedToPayment() {
    this.showPaymentConfirmation = false;
    this.routeToCard();
  }

  closePaymentConfirmation() {
    this.showPaymentConfirmation = false;
  }

  routeToCard() {
    this.loading = true;
    this.api.getPaymentAuthorizations({} as any).subscribe((response: any) => {
      if (response.length) {
        this.loading = false;
        this.router.navigateByUrl(
          `dashboard/list-all-cards/${OrderType.ServiceRequestOrder}/${this.requestId}/${this.member.email}/${this.member?.firstName}/${this.member?.lastName}/removeSome/requests`
        );
      } else {
        this.loading = false;
        this.paymentService.proceedToPayment(
          OrderType.ServiceRequestOrder,
          this.requestId,
          this.member,
          this.api,
          `${this.member?.firstName} ${this.member?.lastName}`,
          `/dashboard/requests`
        );
      }
    });
  }

  askFamilyAndFriends() {
    this.router.navigateByUrl(
      `/dashboard/share-order-payment-link/${this.requestId}`
    );
  }
}
