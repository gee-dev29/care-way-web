import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ApiService } from '@care-way/api';
import {
  PageBody,
  DesktopButton,
  InputDropDownComponent,
} from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-hospitals',
  imports: [
    CommonModule,
    PageBody,
    DesktopButton,
    TableModule,
    InputDropDownComponent,
  ],
  templateUrl: './hospitals.html',
  styleUrl: './hospitals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Hospitals implements OnInit{
  api = inject(ApiService);

  hospital$: Observable<any>;

  stateFilter = new BehaviorSubject<any>('');
  lgaFilter = new BehaviorSubject<any>('');
  wardFilter = new BehaviorSubject<any>('');

  states: { key: string; value: string }[] = [];
  lgas: { key: string; value: string }[] = [];
  wards: { key: string; value: string }[] = [];

  totalRecords = 0;
  filters: object;

  ngOnInit(): void {
    this.getStates();
    this.getLgas();
    this.getWards();
  }
  filterByStates(event: any) {
    this.stateFilter.next(event);
  }
  filterByLga(event: any) {
    this.lgaFilter.next(event);
  }
  filterByWards(event: any) {
    this.wardFilter.next(event);
  }


  getStates() {
    this.api
      .getMedicalFacilityHospitalGroupsByFilters({
        filterType: 'State',
      } as any)
      .subscribe((res: string[]) => {
        this.states = res.map((item) => ({ key: item, value: item }));
      });
  }

  getLgas() {
    this.api
      .getMedicalFacilityHospitalGroupsByFilters({
        filterType: 'LGA',
      } as any)
      .subscribe((res: string[]) => {
        this.lgas = res.map((item) => ({ key: item, value: item }));
      });
  }

  getWards() {
    this.api
      .getMedicalFacilityHospitalGroupsByFilters({
        filterType: 'Ward',
      } as any)
      .subscribe((res: string[]) => {
        this.wards = res.map((item) => ({ key: item, value: item }));
      });
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      facilityName: event.filters.facilityName?.value || undefined
    };

    this.stateFilter.subscribe((state) => {
      this.filters = {
        ...this.filters,
        state: state?.value || undefined,
      };
      this.getHospitals();
    });

    this.lgaFilter.subscribe((lga) => {
      this.filters = {
        ...this.filters,
        lga: lga?.value || undefined,
      };
      this.getHospitals();
    });

    this.wardFilter.subscribe((ward) => {
      this.filters = {
        ...this.filters,
        ward: ward?.value || undefined,
      };
      this.getHospitals();
    });

    this.getHospitals();
  }

  getHospitals() {
    this.hospital$ = this.api.getMedicalFacilityHospitals(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }

  onboardHospital() {}
}
