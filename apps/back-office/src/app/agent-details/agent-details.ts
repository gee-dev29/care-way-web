import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  InflowCategory,
  NonProfessionalUserType,
  OrderType,
} from '@healbridge/api';
import {
  PageBody,
  Tab,
  PageHighlight,
  RiderDetailsCard,
  PaymentTypes,
} from '@healbridge/ui';
import { BehaviorSubject, forkJoin, map, Observable, tap } from 'rxjs';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { UserTable } from '../user-table/user-table';
import { Wallet } from '../wallet/wallet';
import { MedicalFacilities } from '../medical-facilities/medical-facilities';
import { ConversionService } from '@healbridge/shared';
import moment from 'moment';

@Component({
  selector: 'back-office-agent-details',
  imports: [
    CommonModule,
    PageBody,
    Tab,
    PageHighlight,
    BankDetailsCard,
    UserTable,
    Wallet,
    MedicalFacilities,
    RiderDetailsCard,
  ],
  templateUrl: './agent-details.html',
  styleUrl: './agent-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AgentDetails implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  router = inject(Router);
  api = inject(ApiService);
  agentDetails$: Observable<any>;
  bankDetails$: Observable<any>;
  customers$: Observable<any>;
  medicalFacilities$: Observable<any>;
  activeTab = 0;
  agentName: string;
  agentEmail: string;
  totalRecords = 0;
  agentId: string;
  filters: object;
  moment = moment;

  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Referrals', value: 1, content: 'Referrals' },
    { title: 'Wallet Transactions', value: 2, content: 'Wallet Transactions' },
  ];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.agentId = params.agentId;
      this.getAgentDetails(this.agentId);
      this.getBankDetails();
    });
  }

 

  load(event: any) {
    this.filters = {
      ...this.filters,
      userType: NonProfessionalUserType.Default,
      skip: event.first,
      limit: event.rows,
      firstName: event.filters.firstName?.value || undefined,
      lastName: event.filters.lastName?.value || undefined,
      email: event.filters.email?.value || undefined,
      phone: event.filters.phone?.value || undefined,
    };

    this.getAllCustomers();
  }

  onLoad(event: any) {
    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
      name: event.filters.name?.value || undefined,
      email: event.filters.email?.value || undefined,
      phoneNumber: event.filters.phoneNumber?.value || undefined,
    };
    this.getMedicalFacilities();
  }

  getMedicalFacilities() {
    this.medicalFacilities$ = this.api
      .getFacilities({
        ...this.filters,
        agentId: this.agentId,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map(({ data }) => data)
      );
  }

  getAllCustomers() {
    this.customers$ = this.api
      .getAllUsers({ ...this.filters, agentId: this.agentId })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response) => response.data)
      );
  }


  getAgentDetails(userId: string) {
    this.agentDetails$ = this.api
      .getUser({
        userId,
      })
      .pipe(
        tap((response: any) => {
          this.agentName = `${response.firstName} ${response.lastName}`;
          this.agentEmail = response.email;
        })
      );
  }

  getBankDetails() {
    this.bankDetails$ = this.api
      .getBankAccount({
        referencedDocumentId: this.agentId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  viewDetails(item: any) {
    this.router.navigate(['medical-facility-details', item.facilityId]);
  }

  view(item: any) {
    this.router.navigate(['customer-details', item.userId]);
  }

  back() {
    this.router.navigate(['list-all-agents']);
  }
}
