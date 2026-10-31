import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NurseActiveFacility {
  private activeFacilityTypeIdSubject = new BehaviorSubject<string | null>(
    this.getStoredFacilityTypeId()
  );
  activeFacilityTypeId$ = this.activeFacilityTypeIdSubject.asObservable();

  private activeFacilityIdSubject = new BehaviorSubject<string | null>(
    this.getStoredFacilityId()
  );
  activeFacilityId$ = this.activeFacilityIdSubject.asObservable();

  private getStoredFacilityTypeId() {
    return localStorage.getItem('nurseFacilityTypeId');
  }

  private getStoredFacilityId() {
    return localStorage.getItem('nurseFacilityId');
  }

  setActiveFacilityTypeId(value: string) {
    localStorage.setItem('nurseFacilityTypeId', value);
    this.activeFacilityTypeIdSubject.next(value);
  }

  getActiveFacilityTypeId() {
    return this.activeFacilityTypeIdSubject.value;
  }

  setActiveFacilityId(value: string) {
    localStorage.setItem('nurseFacilityId', value);
    this.activeFacilityIdSubject.next(value);
  }

  getActiveFacilityId() {
    return this.activeFacilityIdSubject.value;
  }

  clear() {
    localStorage.removeItem('nurseFacilityTypeId');
    localStorage.removeItem('nurseFacilityId');
    this.activeFacilityTypeIdSubject.next(null);
    this.activeFacilityIdSubject.next(null);
  }
}
