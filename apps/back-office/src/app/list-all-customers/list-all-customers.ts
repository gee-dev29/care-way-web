import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { PageBody, DesktopButton } from '@healbridge/ui';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import { Export } from '@healbridge/shared';
import { UserTable } from '../user-table/user-table';

@Component({
  selector: 'back-office-list-all-customers',
  imports: [
    CommonModule,
    TableModule,
    PageBody,
    PaginatorModule,
    DesktopButton,
    UserTable,
  ],
  templateUrl: './list-all-customers.html',
  styleUrl: './list-all-customers.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllCustomers {
  totalRecords: number;
  customers$: Observable<any>;
  filters: object;
  api = inject(ApiService);
  router = inject(Router);
  exportService = inject(Export);

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

  getAllCustomers() {
    this.customers$ = this.api.getAllUsers(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response) => response.data)
    );
  }

  view(item: any) {
    this.router.navigate(['/customer-details', item.userId]);
  }

  export() {
    this.api
      .getAllUsers({ ...this.filters, limit: this.totalRecords })
      .subscribe((users: any) => {
        this.exportService.exportExcel(users.data, 'Customers');
      });
  }
}
