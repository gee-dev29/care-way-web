import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('memberId') || 'null')
  );

  user$ = this.userSubject.asObservable();

  setUser(data: any) {
    localStorage.setItem('memberId', JSON.stringify(data));
    this.userSubject.next(data);
  }

  getUser() {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('memberId');
  }

  refresh() {
    this.userSubject.next(this.getUser());
  }
}
