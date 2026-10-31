import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacilityTypeService {
  private facilityTypeSubject = new BehaviorSubject<any | null>(
    this.getStored()
  );
  currentValue: any;
  facilityType$ = this.facilityTypeSubject.asObservable();

  private getStored() {
    const data = localStorage.getItem('facilityType');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      localStorage.removeItem('facilityType');
      return null;
    }
  }

  private store(value: any) {
    localStorage.setItem('facilityType', JSON.stringify(value));
  }

  setFacilityType(value: any) {
    this.store(value);
    this.facilityTypeSubject.next(value);
  }

  getFacilityType() {
    return this.facilityTypeSubject.value;
  }

  clear() {
    localStorage.removeItem('facilityTypeId');
    localStorage.removeItem('facilityType');
    this.facilityTypeSubject.next(null);
  }

  refresh() {
    this.facilityTypeSubject.next(this.getStored());
  }
}
