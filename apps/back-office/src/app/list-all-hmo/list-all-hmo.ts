import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { PageBody, DesktopButton } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-list-all-hmo',
  imports: [CommonModule, PageBody, DesktopButton, TableModule],
  templateUrl: './list-all-hmo.html',
  styleUrl: './list-all-hmo.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllHmo implements OnInit {
  api = inject(ApiService);
  router = inject(Router);

  hmo$: Observable<any>;
  totalRecords = 0;
  filters: object;

  ngOnInit(): void {}

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      name: event.filters.name?.value || undefined,
      contactEmail: event.filters.contactEmail?.value || undefined,
      contactPhone: event.filters.contactPhone?.value || undefined,
    };
    this.getAllHmo();
  }
  getAllHmo() {
    this.hmo$ = this.api.getHmOs(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }
  view(item: any) {
    this.router.navigate(['hmo-details', item.hmoId]);
  }

  addHmo() {
    this.router.navigate(['create-hmo']);
  }
}
