import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  FacilityType,
  MedicalAppointmentStatus,
} from '@healbridge/api';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { AgencyOrderListCard } from '../agency-order-list-card/agency-order-list-card';
import { AppointmentCard } from '../appointment-card/appointment-card';
import { MedFacilityDetailCard } from '../med-facility-detail-card/med-facility-detail-card';

@Component({
  selector: 'agency-med-facility-details',
  imports: [
    IonIcon,
    IonContent,
    IonText,
    MedFacilityDetailCard,
    AgencyOrderListCard,
    AppointmentCard,
    AsyncPipe,
  ],
  templateUrl: './med-facility-details.html',
  styleUrl: './med-facility-details.css',
})
export class MedFacilityDetails implements OnInit {
  private router = inject(Router);
  private actRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  FacilityType = FacilityType;
  facilityId!: string;
  facilityTypes: any[] = [];
  medDetails$!: Observable<any>;
  activeTab: any = 'Hospital';
  facilityTypeId!: string;
  orders: any[] = [];
  appointments: any[] = [];
  tabsText: Tab[] = [
    { key: 'Hospital', label: 'Hospital' },
    { key: 'Pharmacy', label: 'Pharmacy' },
    { key: 'Laboratory', label: 'Laboratory' },
    { key: 'Radiology', label: 'Imaging/Radiology' },
    { key: 'Blood Bank', label: 'Blood Bank' },
  ];

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.getFacility();
      this.loadFacilityTypes();
    });
  }

  loadFacilityTypes() {
    this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId })
      .subscribe((res: any) => {
        this.facilityTypes = res;
        this.setActiveTab(this.activeTab);
      });
  }

  getFacility() {
    this.medDetails$ = this.api.getFacility({
      facilityId: this.facilityId,
    });
  }

  setActiveTab(tab: any) {
    this.activeTab = tab;
    const facility = this.facilityTypes.find((f) => f.facilityType === tab);
    if (!facility) {
      this.orders = [];
      return;
    }
    switch (tab) {
      case this.FacilityType.BloodBank:
        this.facilityTypeId = facility.bloodBankId;
        break;
      case this.FacilityType.Radiology:
        this.facilityTypeId = facility.radiologyId;
        break;
      case this.FacilityType.Laboratory:
        this.facilityTypeId = facility.laboratoryId;
        break;
      case this.FacilityType.Pharmacy:
        this.facilityTypeId = facility.pharmacyId;
        break;
      case this.FacilityType.Hospital:
        this.facilityTypeId = facility.hospitalId;
        break;
      default:
        this.facilityTypeId = '';
    }
    if (tab === this.FacilityType.Hospital && this.facilityTypeId) {
      this.getMedicalAppointments(this.facilityTypeId);
    }
    this.loadOrders(this.facilityTypeId);
  }

  getMedicalAppointments(facilityTypeId: string) {
    this.api
      .getMedicalAppointments({
        facilityTypeId: facilityTypeId,
        status: MedicalAppointmentStatus.Confirmed,
        limit: 1000,
      })
      .subscribe((response: any) => {
        this.appointments = response?.data.slice(0, 6) ?? [];
      });
  }

  loadOrders(facilityTypeId: string) {
    if (!facilityTypeId) return;
    this.api
      .getFulfilmentOrders({
        facilityTypeId: facilityTypeId,
      })
      .subscribe((res: any) => {
        this.orders = res.data
          .filter((item: any) => item.status === 'Paid')
          .slice(0, 6);
      });
  }

  viewAll(url: string): void {
    this.router.navigate([url, this.facilityId, this.facilityTypeId]);
  }

  routeTo(url: string) {
    this.router.navigateByUrl(url);
  }
}

export interface Order {
  id: string;
  time: string;
  amount: string;
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'Processing';
}

type TabKey =
  | 'Hospital'
  | 'Pharmacy'
  | 'Laboratory'
  | 'Radiology'
  | 'Blood Bank';

interface Tab {
  key: TabKey;
  label: string;
}
