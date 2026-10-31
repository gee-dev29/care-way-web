import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { Export } from '@care-way/shared';
import { DesktopButton, PageBody } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { UserTable } from '../user-table/user-table';

@Component({
  selector: 'back-office-list-all-riders',
  imports: [CommonModule, PageBody, DesktopButton, TableModule, UserTable],
  templateUrl: './list-all-riders.html',
  styleUrl: './list-all-riders.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllRiders implements OnInit {
  api = inject(ApiService);
  exportService = inject(Export);
  router = inject(Router);
  totalRecords = 0;
  riders$: Observable<any>;
  filters: object;

  ngOnInit(): void {}

  load(event: any) {
    this.filters = {
      ...this.filters,
      userType: NonProfessionalUserType.Rider,
      skip: event.first,
      limit: event.rows,
      firstName: event.filters.firstName?.value || undefined,
      lastName: event.filters.lastName?.value || undefined,
      email: event.filters.email?.value || undefined,
      phone: event.filters.phone?.value || undefined,
    };
    this.getAllRiders();
  }

  getAllRiders() {
    this.riders$ = this.api.getAllUsers({ ...this.filters }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }

  view(event: any) {
    this.router.navigate(['rider-details', event.userId]);
  }
  export() {
    this.api
      .getAllUsers({ ...this.filters, limit: this.totalRecords })
      .subscribe((riders: any) => {
        this.exportService.exportExcel(riders.data, 'Riders');
      });
  }
}
