import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VitalsRefresh {
  private VitalSubject = new BehaviorSubject<any | null>(this.getStored());
  currentValue: any;
  vital$ = this.VitalSubject.asObservable();

  private getStored() {
    const data = localStorage.getItem('vital');
    return data ? JSON.parse(data) : null;
  }

  private store(value: any) {
    localStorage.setItem('vital', JSON.stringify(value));
  }

  setVital(value: any) {
    this.store(value);
    this.VitalSubject.next(value);
  }

  getVital() {
    return this.VitalSubject.value;
  }

  clear() {
    localStorage.removeItem('vital');
    this.VitalSubject.next(null);
  }

  refresh() {
    this.VitalSubject.next(this.getStored());
  }
}
