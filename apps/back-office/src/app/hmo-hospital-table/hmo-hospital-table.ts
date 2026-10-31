import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ApiService } from '@care-way/api';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { DesktopButton, ConfirmationModalDesktop, InputDropDownComponent } from '@care-way/ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'back-office-hmo-hospital-table',
  imports: [CommonModule, TableModule, DesktopButton, ConfirmationModalDesktop, InputDropDownComponent],
  templateUrl: './hmo-hospital-table.html',
  styleUrl: './hmo-hospital-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HmoHospitalTable implements OnInit {
  api = inject(ApiService);
  taostr = inject(ToastrService);
  @Input() hmoId: string;

  hmoHospital$: Observable<any>;
  facilityTypeFilter = new BehaviorSubject<any>('');
  stateFilter = new BehaviorSubject<any>('');
  lgaFilter = new BehaviorSubject<any>('');
  wardFilter = new BehaviorSubject<any>('');

  filterTypes: { key: string; value: string }[] = [];
  states: { key: string; value: string }[] = [];
  lgas: { key: string; value: string }[] = [];
  wards: { key: string; value: string }[] = [];

  totalRecords = 0;
  filters: object;
  isHmoHospitalModal = false;
  id: any;

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
    };
   

    this.stateFilter.subscribe((state) => {
      this.filters = {
        ...this.filters,
        state: state?.value || undefined,
      };
      this.getHmoHospital(this.filters);
    });

    this.lgaFilter.subscribe((lga) => {
      this.filters = {
        ...this.filters,
        lga: lga?.value || undefined,
      };
      this.getHmoHospital(this.filters);
    });

    this.wardFilter.subscribe((ward) => {
      this.filters = {
        ...this.filters,
        ward: ward?.value || undefined,
      };
      this.getHmoHospital(this.filters);
    });
    this.getHmoHospital(this.filters);
  }

  getHmoHospital(filters: any) {
    this.hmoHospital$ = this.api
      .getHmoMedicalFacilityHospitals({ ...filters, hmoId: this.hmoId })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response: any) => response.data)
      );
  }

  showHmoHospitalModal(item: any) {
    this.id = item.id;
    this.isHmoHospitalModal = true;
  }

  delete() {
    this.api
      .removeHmoMedicalFacilityHospital({
        hmoId: this.hmoId,
        body: {
          hospitalId: this.id,
        },
      })
      .subscribe(() => {
        this.taostr.success('HMO Hospital Deleted Successfully');
        this.isHmoHospitalModal = false;
        this.getHmoHospital(this.hmoId);
      });
  }
}
