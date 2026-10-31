import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { DesktopButton } from '@healbridge/ui';

@Component({
  selector: 'back-office-hmo-product-table',
  imports: [CommonModule, TableModule, DesktopButton],
  templateUrl: './hmo-product-table.html',
  styleUrl: './hmo-product-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HmoProductTable implements OnChanges {
  api = inject(ApiService);
  router = inject(Router);
  @Input() hmoId: string;
  @Input() reloadProducts = false;
  @Output() editHmoProduct = new EventEmitter<any>();
  @Output() productsLoaded = new EventEmitter<any>();

  hmoProduct$: Observable<any>;

  totalRecords = 0;
  filters: object;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadProducts']?.currentValue === true) {
      this.getHmoProducts(this.hmoId);
    }
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      productName: event.filters.productName?.value || undefined,
    };
    this.getHmoProducts(this.hmoId);
  }

  getHmoProducts(hmoId: any) {
    this.hmoProduct$ = this.api.getHmoProducts({...this.filters, hmoId: hmoId }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
        this.productsLoaded.emit();
      }),
      map((response: any) => response.data)
    );
  }

  edit(item: any) {
    this.editHmoProduct.emit(item);
  }

  view(item: any) {
    this.router.navigate([
      'hmo-product-details',
      'hmo',
      item.hmoId,
      'product',
      item.hmoProductId,
    ]);
  }
}
