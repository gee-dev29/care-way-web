import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  Hmo,
  HmoProduct,
  Member,
  OrderStatus,
  User,
} from '@healbridge/api';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@healbridge/shared';
import {
  AmountFormatPipe,
  ButtonComponent,
  ToastService,
} from '@healbridge/ui';
import {
  IonAvatar,
  IonContent,
  IonDatetime,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  checkmarkCircle,
  chevronBackOutline,
} from 'ionicons/icons';
import moment from 'moment';
import { v4 } from 'uuid';

import {
  isPaid,
  statusColor,
  statusLabel,
  hospitalKey,
  hospitalLocation,
  splitToChips,
  HmoHospital,
  HmoJourneyService,
} from '@healbridge/shared';
type MemberRow = Member & { age?: number; profilePicture?: string | null };

@Component({
  selector: 'app-hmo-summary',
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonAvatar,
    IonModal,
    IonDatetime,
    ButtonComponent,
    AmountFormatPipe,
  ],
  templateUrl: './hmo-summary.html',
  styleUrl: './hmo-summary.css',
})
export class HmoSummary implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private journey = inject(HmoJourneyService);
  private toast = inject(ToastService);

  mode: 'checkout' | 'active' = 'checkout';
  hmo?: Hmo;
  product?: HmoProduct;
  members: MemberRow[] = [];
  hospital?: HmoHospital;
  startDate = '';
  endDate = '';
  status?: string;
  orderId?: string;

  inclusions: string[] = [];
  exclusions: string[] = [];
  datePickerOpen = false;
  draftDate = '';
  submitting = false;
  notFound = false;

  readonly location = hospitalLocation;

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
      'calendar-icon': calendarOutline,
      'check-icon': checkmarkCircle,
    });
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'] ?? 'checkout';
  }

  ionViewWillEnter() {
    if (this.mode === 'active') {
      this.loadPurchase();
    } else {
      this.loadCheckout();
    }
  }

  private loadCheckout() {
    const state = this.journey.state;
    this.hmo = state.hmo;
    this.product = state.hmoProduct;
    this.members = this.withAges(state.selectedMembers ?? []);
    this.hospital = state.selectedHospital;
    this.startDate = state.startDate || moment().format('YYYY-MM-DD');
    this.endDate = this.journey.deriveEndDate(
      this.startDate,
      this.product?.durationInMonths
    );
    this.journey.patch({ startDate: this.startDate, endDate: this.endDate });
    this.hydrateChips();
  }

  private loadPurchase() {
    const orderId = this.route.snapshot.paramMap.get('orderId') as string;
    const purchase = this.journey.getPurchase(orderId);
    if (!purchase) {
      this.notFound = true;
      return;
    }
    this.orderId = purchase.orderId;
    this.status = purchase.status;
    this.hmo = purchase.hmo;
    this.product = purchase.hmoProduct;
    this.members = this.withAges(purchase.selectedMembers ?? []);
    this.hospital = purchase.selectedHospital;
    this.startDate = purchase.startDate ?? '';
    this.endDate = purchase.endDate ?? '';
    this.hydrateChips();

    this.api.getHmoProductOrder({ orderId }).subscribe({
      next: (order) => {
        if (order?.status) this.status = order.status;
      },
      error: () => undefined,
    });

    if (this.hmo?.hmoId && this.product?.hmoProductId) {
      this.api
        .getHmoProduct({
          hmoId: this.hmo.hmoId,
          hmoProductId: this.product.hmoProductId,
        })
        .subscribe({
          next: (product) => {
            this.product = product;
            this.hydrateChips();
          },
          error: () => undefined,
        });
    }
  }

  private hydrateChips() {
    this.inclusions = splitToChips(this.product?.inclusions);
    this.exclusions = splitToChips(this.product?.exclusions);
  }

  private withAges(members: MemberRow[]): MemberRow[] {
    const rows = members.map((member) => ({
      ...member,
      age: member.dob ? moment().diff(moment(member.dob), 'years') : undefined,
    }));
    rows.forEach((member) => this.loadPicture(member));
    return rows;
  }

  private loadPicture(member: MemberRow) {
    if (!member.memberId) return;
    this.api.getUploads({ referencedDocumentId: member.memberId }).subscribe({
      next: (uploads: any[]) =>
        (member.profilePicture = uploads?.length
          ? uploads[uploads.length - 1].url
          : null),
      error: () => undefined,
    });
  }

  get coverageSubtitle() {
    const count = this.members.length;
    const plural = count === 1 ? '' : 's';
    const duration = this.product?.durationInMonths ?? 0;
    return `${count} Member${plural} · ${duration} Months Duration`;
  }

  format(date?: string) {
    return date ? moment(date).format('MMM D, YYYY') : '';
  }

  initials(member: MemberRow) {
    return `${member.firstName?.[0] ?? ''}${member.lastName?.[0] ?? ''}`;
  }

  openDatePicker() {
    if (this.mode === 'active') return;
    this.draftDate = this.startDate;
    this.datePickerOpen = true;
  }

  closeDatePicker() {
    this.datePickerOpen = false;
  }

  confirmDate() {
    this.startDate = moment(this.draftDate).format('YYYY-MM-DD');
    this.endDate = this.journey.deriveEndDate(
      this.startDate,
      this.product?.durationInMonths
    );
    this.journey.patch({ startDate: this.startDate, endDate: this.endDate });
    this.datePickerOpen = false;
  }

  proceedToPayment() {
    if (this.submitting) return;
    this.submitting = true;

    this.auth.userDetail(this.api, (auth: any) => {
      this.api.getUser({ userId: auth?.jti }).subscribe({
        next: (user) => this.handOffToPayment(auth, user),
        error: () => {
          this.submitting = false;
          this.toast.show('We could not start your payment.', 'error');
        },
      });
    });
  }

  private handOffToPayment(auth: any, user: User) {
    const payer = {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };

    if (this.mode === 'active' && this.orderId) {
      this.submitting = false;
      this.router.navigateByUrl(
        this.journey.paymentCardsUrl(this.orderId, payer)
      );
      return;
    }

    const orderId = v4();
    this.api
      .createHmoProductOrder({
        orderId,
        body: {
          orderId,
          userId: auth?.jti,
          productId: this.product?.hmoProductId,

          hmoHospitalId: hospitalKey(this.hospital),
          memberIds: this.members.map((member) => member.memberId),
          startDate: this.startDate,
          status: OrderStatus.PaymentInitiated,
        },
      })
      .subscribe({
        next: () => {
          this.journey.recordPurchase({
            orderId,
            status: OrderStatus.PaymentInitiated,
            hmo: this.hmo,
            hmoProduct: this.product,
            selectedMembers: this.members,
            selectedHospital: this.hospital,
            startDate: this.startDate,
            endDate: this.endDate,
          });
          this.submitting = false;

          this.router.navigateByUrl(
            this.journey.paymentCardsUrl(orderId, payer)
          );
        },
        error: () => {
          this.submitting = false;
          this.toast.show('We could not create your order.', 'error');
        },
      });
  }

  askFamilyAndFriend() {
    // TODO(product): behaviour for this button is not defined yet.
    this.toast.show('Ask Family & Friend is coming soon.');
  }

  get paid() {
    return isPaid(this.status);
  }

  get statusText() {
    return statusLabel(this.status);
  }

  get statusTint() {
    return statusColor(this.status);
  }

  get showPayAction() {
    return this.mode === 'checkout' || !this.paid;
  }

  get canRenew() {
    return (
      this.paid &&
      !!this.endDate &&
      moment().isSameOrAfter(moment(this.endDate), 'day')
    );
  }

  get renewHint() {
    return this.canRenew
      ? ''
      : `Renewal available from ${this.format(this.endDate)}`;
  }

  renew() {
    if (!this.canRenew) return;
    // TODO(product): renewal flow is undefined — re-run selection, or re-charge as is?
    this.toast.show('Renewal is coming soon.');
  }

  back() {
    this.router.navigateByUrl(
      this.mode === 'active'
        ? '/dashboard/hmo-purchase-history'
        : '/dashboard/hmo-preferred-hospital'
    );
  }
}
