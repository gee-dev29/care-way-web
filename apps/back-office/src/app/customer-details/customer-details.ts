import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  Member,
  ReferralType,
  Relationship,
  User,
  VitalSignType,
} from '@care-way/api';
import {
  PageBody,
  Tab,
  CustomerDetailsCard,
  PageHighlight,
  TabSecondary,
} from '@care-way/ui';
import { map, Observable, tap } from 'rxjs';
import { ListMembers } from '../list-members/list-members';
import { ListBloodPressure } from '../list-blood-pressure/list-blood-pressure';
import { ListTemperature } from '../list-temperature/list-temperature';
import { ListGlucose } from '../list-glucose/list-glucose';
import { ListHeight } from '../list-height/list-height';
import { ListWeight } from '../list-weight/list-weight';
import { ListOxygenSaturation } from '../list-oxygen-saturation/list-oxygen-saturation';
import { ServiceRequestTable } from '../service-request-table/service-request-table';
import { CommonModule } from '@angular/common';
import { AppointmentTable } from '../appointment-table/appointment-table';
import { OrderTable } from '../order-table/order-table';

@Component({
  selector: 'back-office-customer-details',
  imports: [
    CommonModule,
    PageBody,
    Tab,
    CustomerDetailsCard,
    ListMembers,
    PageHighlight,
    TabSecondary,
    ListBloodPressure,
    ListTemperature,
    ListGlucose,
    ListWeight,
    ListHeight,
    ListOxygenSaturation,
    ServiceRequestTable,
    AppointmentTable,
    OrderTable,
  ],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css',
})
export class CustomerDetails implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  activeTab = 0;
  totalRecords = 0;
  vitalActiveTab = 0;
  serviceRequestActiveTab = 0;
  customer$: Observable<any>;
  members$: Observable<any>;
  appointments$: Observable<any>;
  bloodPressure$: Observable<any>;
  temperature$: Observable<any>;
  glucose$: Observable<any>;
  weight$: Observable<any>;
  height$: Observable<any>;
  oxygenSaturation$: Observable<any>;
  membersTotalRecords: number;
  temperatureTotalRecords: number;
  bloodPressureTotalRecords: number;
  glucoseTotalRecords: number;
  weightTotalRecords: number;
  heightTotalRecords: number;
  oxygenSaturationTotalRecords: number;
  api = inject(ApiService);
  userName: string;
  userEmail: string | undefined;
  selfMemberId: string;
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Members', value: 1, content: 'Members' },
    { title: 'Vitals', value: 2, content: 'Vitals' },
    { title: 'Orders', value: 3, content: 'Orders' },
    { title: 'Appointments', value: 4, content: 'Appointments' },
    { title: 'Service Requests', value: 5, content: 'Service Requests' },
  ];
  vitalTabs = [
    { title: 'Blood Pressure', value: 0, content: 'Blood Pressure' },
    { title: 'Temperature', value: 1, content: 'Temperature' },
    { title: 'Glucose', value: 2, content: 'Glucose' },
    { title: 'Weight', value: 3, content: 'Weight' },
    { title: 'Height', value: 4, content: 'Height' },
    { title: 'Oxygen Saturation', value: 5, content: 'Oxygen Saturation' },
  ];
  serviceRequestTabs = [
    { title: 'Pharmacy', value: 0, content: 'Pharmacy' },
    { title: 'Laboratory', value: 1, content: 'Laboratory' },
    { title: 'Blood Bank', value: 2, content: 'Blood Bank' },
    { title: 'Radiology', value: 3, content: 'Radiology' },
  ];
  serviceRequests$: Observable<any>;
  serviceRequestsTotalRecords: number;
  type = ReferralType;
  activeReferralType: ReferralType;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.getCustomer(params.customerId);
      this.getMembers(params.customerId);
    });
  }

  back() {
    this.router.navigate(['list-all-customers']);
  }

  getCustomer(customerId: string) {
    this.customer$ = this.api.getUser({ userId: customerId }).pipe(
      tap((customer: User) => {
        this.userName = `${customer.firstName} ${customer.lastName}`;
        this.userEmail = customer.email;
      })
    );
  }

  getMembers(customerId: string) {
    this.members$ = this.api
      .getMembers({ referencedDocumentId: customerId })
      .pipe(
        map((response: any) => {
          const selfMember = response.data.find(
            (member: Member) => member.relationship === Relationship.Self
          );
          const nonSelfMembers = response.data.filter(
            (member: Member) => member.relationship !== Relationship.Self
          );

          if (selfMember) {
            this.selfMemberId = selfMember.memberId;
            this.getMemberVitalSignHistory(selfMember.memberId);
            this.activeReferralType = ReferralType.Pharmacy;
            this.loadServiceRequests(
              selfMember.memberId,
              this.activeReferralType
            );
          }
          this.getMemberVitalSignHistory(selfMember.memberId);
          this.membersTotalRecords = nonSelfMembers.length;
          return nonSelfMembers;
        })
      );
  }

  getMemberVitalSignHistory(customerId: string) {
    this.bloodPressure$ = this.api
      .getMemberVitalSignHistory({
        memberId: customerId,
        vitalSign: VitalSignType.BloodPressure,
      })
      .pipe(
        tap((response: any) => {
          this.bloodPressureTotalRecords = response.length;
        })
      );
    this.temperature$ = this.api
      .getMemberVitalSignHistory({
        memberId: customerId,
        vitalSign: VitalSignType.Temperature,
      })
      .pipe(
        tap((response: any) => {
          this.temperatureTotalRecords = response.length;
        })
      );
    this.glucose$ = this.api
      .getMemberVitalSignHistory({
        memberId: customerId,
        vitalSign: VitalSignType.Glucose,
      })
      .pipe(
        tap((response: any) => {
          this.glucoseTotalRecords = response.length;
        })
      );
    this.weight$ = this.api
      .getMemberVitalSignHistory({
        memberId: customerId,
        vitalSign: VitalSignType.Weight,
      })
      .pipe(
        tap((response: any) => {
          this.weightTotalRecords = response.length;
        })
      );
    this.height$ = this.api
      .getMemberVitalSignHistory({
        memberId: customerId,
        vitalSign: VitalSignType.Height,
      })
      .pipe(
        tap((response: any) => {
          this.heightTotalRecords = response.length;
        })
      );
    this.oxygenSaturation$ = this.api
      .getMemberVitalSignHistory({
        memberId: customerId,
        vitalSign: VitalSignType.OxygenSaturation,
      })
      .pipe(
        tap((response: any) => {
          this.oxygenSaturationTotalRecords = response.length;
        })
      );
  }

  onServiceRequestTabChange(tabIndex: number) {
    if (!this.selfMemberId) return;

    const referralTypes = [
      ReferralType.Pharmacy,
      ReferralType.Laboratory,
      ReferralType.BloodBank,
      ReferralType.Radiology,
    ];

    this.activeReferralType = referralTypes[tabIndex];
    this.loadServiceRequests(this.selfMemberId, this.activeReferralType);
  }

  loadServiceRequests(memberId: string, referralType: ReferralType) {
    this.serviceRequests$ = this.api
      .getServiceRequests({ memberId, referralType })
      .pipe(
        tap(
          (res: any) => (this.serviceRequestsTotalRecords = res.totalRecords)
        ),
        map(({ data }) => data)
      );
  }

  viewDetails(appointmentId: string) {
    this.router.navigate(['appointment-details', appointmentId]);
  }

  viewAppointmentDetails(appointmentId: string) {
    this.router.navigate(['appointment-details', appointmentId]);
  }
}
