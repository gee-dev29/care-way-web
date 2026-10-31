import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, DisplayLayout, PageLayout } from '@care-way/shared';
import { Sidebar } from '@care-way/ui';

@Component({
  imports: [CommonModule, RouterModule, Sidebar],
  selector: 'back-office-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'back-office';
  displayLayoutService = inject(DisplayLayout);
  api = inject(ApiService);
  auth = inject(AuthService);
  router = inject(Router);
  userName: string;
  readonly PageLayout = PageLayout;

  customersSidebarItem = {
    icon: '/icons/customers-sidebar-icon.svg',
    name: 'Customers',
    link: '/list-all-customers',
    id: 'customers',
  };

  appointmentsSidebarItem = {
    icon: '/icons/appointments-icon.svg',
    name: 'Appointments',
    link: '/appointments',
    id: 'appointments',
  };

  msaOrderSidebarItem = {
    icon: '/icons/msa-order.svg',
    name: 'MSA Order',
    link: '/msa-order',
    id: 'msa-order',
  };

  greenBookSidebarItem = {
    icon: '/icons/green-book.svg',
    name: 'Green Book',
    dropdownLinks: [
      {
        name: 'Drugs',
        link: 'green-book/drugs',
        id: 'drugs',
      },
      {
        name: 'Vaccines and Biologics',
        link: '/green-book/vaccines-biologics',
        id: 'vaccines-biologics',
      },
      {
        name: 'Medical Devices',
        link: '/green-book/medical-devices',
        id: 'medical-devices',
      },
      {
        name: 'Herbals and Nutraceuticals',
        link: '/green-book/herbals-nutraceuticals',
        id: 'herbals-nutraceuticals',
      },
    ],
  };

  ordersSidebarItem = {
    icon: '/icons/order-icon-black.svg',
    name: 'Orders',
    link: '/list-all-orders',
    id: 'orders',
  };

  msaRatesSidebarItem = {
    icon: 'icons/msa-rate-icon.svg',
    name: 'MSA Rates',
    dropdownLinks: [
      {
        name: 'Wallet',
        link: 'msa-rates/wallet',
        id: 'msa-rates',
      },
      {
        name: 'Target S',
        link: 'msa-rates/target-s',
        id: 'msa-rates',
      },
      {
        name: 'Target L',
        link: 'msa-rates/target-l',
        id: 'msa-rates',
      },
      {
        name: 'Target M',
        link: 'msa-rates/target-m',
        id: 'msa-rates',
      },
      {
        name: 'Investment',
        link: 'msa-rates/investment',
        id: 'msa-rates',
      },
      {
        name: 'Future',
        link: 'msa-rates/future',
        id: 'msa-rates',
      },
    ],
  };

  preferencesSidebarItem = {
    icon: '/icons/preference-icon.svg',
    name: 'Preferences',
    dropdownLinks: [
      {
        name: 'Hospital Specializations',
        link: '/preferences/hospital-specializations',
        id: 'hospital-specializations',
      },
      {
        name: 'Hospitals',
        link: 'preferences/list-all-hospitals',
        id: 'list-all-hospitals',
      },
      {
        icon: 'icons/bank-icon.svg',
        name: 'Banks',
        link: 'preferences/list-all-banks',
        id: 'banks',
      },
      {
        name: 'App version',
        link: '/preferences/app-version',
        id: 'app-version',
      },
      {
        name: 'MSA Rates',
        link: 'preferences/msa-rates',
        id: 'msa-rates',
      },
    ],
  };

  medicalFacilitiesSidebarItem = {
    icon: '/icons/medical-facility-icon.svg',
    name: 'Medical Facilities',
    dropdownLinks: [
      {
        name: 'Facilities',
        link: '/list-all-medical-facilities',
        id: 'medical-facilities',
      },
      {
        name: 'Hospitals',
        link: '/list-all-hospitals',
        id: 'medical-facilities',
      },
      {
        name: 'Pharmacies',
        link: '/list-all-pharmacies',
        id: 'medical-facilities',
      },
      {
        name: 'Laboratories',
        link: '/list-all-laboratories',
        id: 'medical-facilities',
      },
      {
        name: 'Blood Banks',
        link: '/list-all-blood-banks',
        id: 'medical-facilities',
      },
      {
        name: 'Radiology Centres',
        link: '/list-all-radiology-centres',
        id: 'medical-facilities',
      },
    ],
  };

  medicalProfessionalsSidebarItem = {
    icon: '/icons/medical-professional-icon.svg',
    name: 'Medical Professionals',
    dropdownLinks: [
      {
        name: 'Doctors',
        link: '/list-all-doctors',
        id: 'medical-professionals',
      },
      {
        name: 'Pharmacists',
        link: '/list-all-pharmacists',
        id: 'medical-professionals',
      },
      {
        name: 'Laboratory Professionals',
        link: '/list-all-laboratory-professionals',
        id: 'medical-professionals',
      },
      {
        name: 'Blood Bank Professionals',
        link: '/list-all-blood-bank-professionals',
        id: 'medical-professionals',
      },
      {
        name: 'Radiology Professionals',
        link: '/list-all-radiology-professionals',
        id: 'medical-professionals',
      },
    ],
  };

  agentsSidebarItem = {
    icon: 'icons/agent-black-icon.svg',
    name: 'Agents',
    link: 'list-all-agents',
    id: 'agents',
  };

  withdrawalsSidebarItem = {
    icon: 'icons/withdrawal.svg',
    name: 'Withdrawals',
    link: 'list-all-withdrawals',
    id: 'widthdrawals',
  };

  adsSidebarItem = {
    icon: 'icons/black-ads-icon.svg',
    name: 'Ads',
    link: 'list-all-ads',
    id: 'ads',
  };

  ridersSidebarItem = {
    icon: 'icons/rider-icon.svg',
    name: 'Riders',
    link: 'list-all-riders',
    id: 'riders',
  };

  approvalRoutesSidebarItems = {
    icon: 'icons/approval-icon.svg',
    name: 'Approval Routes',
    link: '/list-all-approval-routes',
    id: 'approval-routes',
  };

  approvalsSidebarItems = {
    icon: 'icons/approval-icon.svg',
    name: 'Approvals',
    id: 'approvals',
    dropdownLinks: [
      {
        name: 'My Pending Approvals',
        link: '/my-pending-approvals',
        id: 'approvals',
      },
      {
        name: 'My Approval History',
        link: '/my-approval-history',
        id: 'approvals',
      },
      {
        name: 'All Pending Approvals',
        link: '/list-all-pending-approvals',
        id: 'approvals',
      },
      {
        name: 'All Waiting Approvals',
        link: '/list-all-waiting-approvals',
        id: 'approvals',
      },
    ],
  };

  staffsSidebarItems = {
    icon: 'icons/staff-icon.svg',
    name: 'Staff',
    link: 'list-all-staffs',
    id: 'staff',
  };

  serviceRequestsSidebarItem = {
    icon: '/icons/service-request-icon.svg',
    name: 'Service Requests',
    dropdownLinks: [
      {
        name: 'Pharmacies',
        link: '/list-all-pharmacy-service-requests',
        id: 'service-requests',
      },
      {
        name: 'Laboratories',
        link: '/list-all-laboratory-service-requests',
        id: 'service-requests',
      },
      {
        name: 'Blood Banks',
        link: '/list-all-blood-bank-service-requests',
        id: 'service-requests',
      },
      {
        name: 'Radiology Centres',
        link: '/list-all-radiology-centre-service-requests',
        id: 'service-requests',
      },
    ],
  };

  hmoSidebarItem = {
    icon: 'icons/hmo-icon.svg',
    name: 'HMO',
    dropdownLinks: [
      {
        name: 'HMO',
        link: 'list-all-hmo',
        id: 'hmo',
      },
      {
        name: 'HMO Purchased List',
        link: 'all-hmo-purchased-list',
        id: 'hmo',
      },
    ],
  };

  sidebarItems = [
    this.appointmentsSidebarItem,
    this.serviceRequestsSidebarItem,
    this.ordersSidebarItem,
    this.hmoSidebarItem,
    this.withdrawalsSidebarItem,
    this.medicalFacilitiesSidebarItem,
    this.medicalProfessionalsSidebarItem,
    this.customersSidebarItem,
    this.agentsSidebarItem,
    this.ridersSidebarItem,
    this.adsSidebarItem,
    this.approvalRoutesSidebarItems,
    this.approvalsSidebarItems,
    this.msaOrderSidebarItem,
    this.msaRatesSidebarItem,
    this.staffsSidebarItems,
    this.greenBookSidebarItem,
    this.preferencesSidebarItem,
  ];
  unit = 'Back-Office';

  ngOnInit() {
    this.auth.currentAuth.subscribe(() => {
      this.auth.userDetail(this.api, (auth) => {
        this.userName = `${auth?.name}`;
      });
    });
  }

  logout() {
    this.auth.logout();
  }
}
