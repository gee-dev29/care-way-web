import { Injectable } from '@angular/core';
import {
  Hmo,
  HmoProduct,
  MedicalFacilityHospital,
  Member,
  OrderType,
} from '@healbridge/api';
import moment from 'moment';

export type HmoHospital = MedicalFacilityHospital & {
  hospitalId?: string;
  medicalFacilityHospitalId?: string;
  id?: string;
};

export interface HmoJourneyState {
  hmo?: Hmo;
  hmoProduct?: HmoProduct;
  selectedMembers?: Member[];
  selectedHospital?: HmoHospital;
  startDate?: string;
  endDate?: string;
}

export interface MyHmoPurchase extends HmoJourneyState {
  orderId: string;
  orderCode?: string;
  status?: string;
}

const STATE_KEY = 'hmoJourney';
const PURCHASES_KEY = 'hmoPurchases';

@Injectable({ providedIn: 'root' })
export class HmoJourneyService {
  private read<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  }

  private write(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get state(): HmoJourneyState {
    return this.read<HmoJourneyState>(STATE_KEY, {});
  }

  patch(value: Partial<HmoJourneyState>) {
    this.write(STATE_KEY, { ...this.state, ...value });
  }

  clear() {
    localStorage.removeItem(STATE_KEY);
  }

  deriveEndDate(startDate: string, durationInMonths = 0): string {
    const end = moment(startDate).add(durationInMonths, 'months');
    if (durationInMonths > 0) end.subtract(1, 'day');
    return end.format('YYYY-MM-DD');
  }

  getMyHmoPurchases(): MyHmoPurchase[] {
    return this.read<MyHmoPurchase[]>(PURCHASES_KEY, []);
  }

  getPurchase(orderId: string): MyHmoPurchase | undefined {
    return this.getMyHmoPurchases().find((p) => p.orderId === orderId);
  }

  recordPurchase(purchase: MyHmoPurchase) {
    const purchases = this.getMyHmoPurchases().filter(
      (p) => p.orderId !== purchase.orderId
    );
    this.write(PURCHASES_KEY, [purchase, ...purchases]);
  }

  paymentCardsUrl(
    orderId: string,
    payer: { email?: string; firstName?: string; lastName?: string }
  ): string {
    const segments = [
      OrderType.HmoProductOrder,
      orderId,
      payer.email || '-',
      payer.firstName || '-',
      payer.lastName || '-',
      'removeSome',
      'hmo-purchase-history',
    ].map((segment) => encodeURIComponent(segment));
    return `/dashboard/list-all-cards/${segments.join('/')}`;
  }
}
