import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { Export } from '@care-way/shared';
import { PageBody, DesktopButton } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { UserTable } from '../user-table/user-table';

@Component({
  selector: 'back-office-list-all-agents',
  imports: [CommonModule, PageBody, DesktopButton, TableModule, UserTable],
  templateUrl: './list-all-agents.html',
  styleUrl: './list-all-agents.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllAgents {
  api = inject(ApiService);
  router = inject(Router);
  exportService = inject(Export);
  agents$: Observable<any>;
  totalRecords: number;
  filters: object;

  load(event: any) {
    this.filters = {
      ...this.filters,
      userType: NonProfessionalUserType.Agent,
      skip: event.first,
      limit: event.rows,
      firstName: event.filters.firstName?.value || undefined,
      lastName: event.filters.lastName?.value || undefined,
      email: event.filters.email?.value || undefined,
      phone: event.filters.phone?.value || undefined,
    };
    this.getAllAgents();
  }

  getAllAgents() {
    this.agents$ = this.api.getAllUsers(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response) => response.data)
    );
  }

  view(item: any) {
    this.router.navigate(['/agent-details', item.userId]);
  }

  export() {
    this.api
      .getAllUsers({ ...this.filters, limit: this.totalRecords })
      .subscribe((agents: any) => {
        this.exportService.exportExcel(agents.data, 'Agents');
      });
  }
}
