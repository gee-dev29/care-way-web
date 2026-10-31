import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ProductType } from '@healbridge/api';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, skip, tap } from 'rxjs';
import { InputDropDownComponent } from '@healbridge/ui';
import { ConversionService } from '@healbridge/shared';

@Component({
  selector: 'back-office-medical-product-table',
  imports: [CommonModule, TableModule, InputDropDownComponent],
  templateUrl: './medical-product-table.html',
  styleUrl: './medical-product-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalProductTable implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  conversion = inject(ConversionService);

  @Input() facilityTypeId: string;
  totalRecords = 0;
  filters: object;
  productTypes: { key: string; value: string }[] = [];
  productTypeFilter = new BehaviorSubject<any>('');

  medicalProducts$: Observable<any>;

  ngOnInit(): void {
    this.conversion.convert(ProductType, this.productTypes);
  }

  filterByProductType(event: any) {
    this.productTypeFilter.next(event);
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
    };
    this.productTypeFilter.subscribe((productType) => {
      this.filters = {
        ...this.filters,
        productType: productType?.value || undefined,
      };
      this.getMedicalProducts()
    });
    this.getMedicalProducts();
  }
  getMedicalProducts() {
    this.medicalProducts$ = this.api
      .getMedicalProducts({
        ...this.filters,
        facilityTypeId: this.facilityTypeId,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map(({ data }) => data)
      );
  }
}
