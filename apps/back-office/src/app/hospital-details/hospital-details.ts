import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  FacilityType,
} from '@healbridge/api';
import {
  PageBody,
  PageHighlight,
  Tab,
  MedicalProfessionalHospitalTable,
  PaymentTypes,
} from '@healbridge/ui';
import { BehaviorSubject, forkJoin, map, Observable, pipe, tap } from 'rxjs';
import { MedicalFacilityDetailsCard } from '../medical-facility-details-card/medical-facility-details-card';
import { AppointmentTable } from '../appointment-table/appointment-table';
import { CommonModule, Location } from '@angular/common';
import { MembershipCardTable } from '../membership-card-table/membership-card-table';
import { ListAllPatients } from '../list-all-patients/list-all-patients';
import { Wallet } from '../wallet/wallet';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { LicenseDetailsCard } from '../license-details-card/license-details-card';
import { ConversionService, Status } from '@healbridge/shared';
import moment from 'moment';
import { MedicalProductTable } from '../medical-product-table/medical-product-table';

@Component({
  selector: 'back-office-hospital-details',
  imports: [
    PageBody,
    Tab,
    MedicalFacilityDetailsCard,
    CommonModule,
    PageHighlight,
    AppointmentTable,
    MembershipCardTable,
    MedicalProfessionalHospitalTable,
    ListAllPatients,
    Wallet,
    BankDetailsCard,
    LicenseDetailsCard,
    MedicalProductTable
],
  templateUrl: './hospital-details.html',
  styleUrl: './hospital-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalDetails implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedroute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  location = inject(Location);

  cardHeading = 'Hospital';
  activeTab = 0;
  hospital$: Observable<any>;
  membershipCard$: Observable<any>;
  medicalProfessionalFees$: Observable<any>;
  doctorsCharge$: Observable<any>;
  patients$: Observable<any>;
  bankDetails$: Observable<any>;
  license$: Observable<any>;
  totalRecords: number;
  facilityId: string;
  facilityTypeId: string;
  professionalId: string;
  facilityName: string;
  category: string;
  cardCharge: number;
  filters: object;
  virtualConsultationCharge: number;
  physicalConsultationCharge: number;
  moment = moment;

  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Patients', value: 1, content: 'Patients' },
    { title: 'Doctors', value: 2, content: 'Doctors' },
    { title: 'Appointments', value: 3, content: 'Appointments' },
    { title: 'Membership Cards', value: 4, content: 'Membership Cards' },
    { title: 'Bank Details', value: 5, content: 'Bank Details' },
    { title: 'License Details', value: 6, content: 'License Details' },
    { title: 'Wallet Transactions', value: 7, content: 'Wallet Transactions' },
    { title: 'Medical Products', value: 8, content: 'Medical Products' },
  ];

  ngOnInit() {
    this.activatedroute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.getHospitalDetails(this.facilityId, this.facilityTypeId);
      this.getMemberShipDetails(this.facilityTypeId);
      this.getMedicalProfessionalFee(this.facilityTypeId);
      this.getAllPatients(this.facilityTypeId);
      this.getBankDetails();
      this.getLicense();
    });
  }

  getBankDetails() {
    this.bankDetails$ = this.api
      .getBankAccount({
        referencedDocumentId: this.facilityTypeId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  getLicense() {
    this.license$ = this.api
      .getPracticeLicenses({
        referencedDocumentId: this.facilityTypeId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  getHospitalDetails(facilityId: string, facilityTypeId: string) {
    this.hospital$ = this.api
      .getFacilityTypeById({
        facilityId,
        facilityTypeId,
        facilityType: FacilityType.Hospital,
      })
      .pipe(
        tap((response: any) => {
          this.facilityName = response.name;
          this.category = response.category;
          this.cardCharge = response.charge?.cardCharge;
          this.virtualConsultationCharge =
            response.charge?.virtualConsultationCharge;
          this.physicalConsultationCharge =
            response.charge?.physicalConsultationCharge;
        })
      );
    this.doctorsCharge$ = this.hospital$.pipe(map((res: any) => [res]));
  }

  getAllPatients(facilityTypeId: string) {
    this.patients$ = this.api
      .getMembersInFacilityType({
        facilityTypeId,
      })
      .pipe(
        tap((res: any) => {
          this.totalRecords = res.length;
        })
      );
  }

  getMedicalProfessionalFee(facilityTypeId: string) {
    this.medicalProfessionalFees$ = this.api
      .getMedicalProfessionalFee({
        facilityTypeId,
      } as any)
      .pipe(
        tap((res: any) => {
          this.totalRecords = res.length;
        })
      );
  }

  getMemberShipDetails(facilityTypeId: string) {
    this.membershipCard$ = this.api
      .getFacilityTypeMembershipCardTypes({
        facilityTypeId,
      } as any)
      .pipe(
        tap((res: any) => {
          this.totalRecords = res.length;
        })
      );
  }

  viewAppointmentDetails(appointmentId: string) {
    this.router.navigate(['appointment-details', appointmentId]);
  }

  goBack() {
    this.location.back();
  }
}
