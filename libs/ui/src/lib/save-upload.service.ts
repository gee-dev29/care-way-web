import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaveUploadService {
  public upload$ = new BehaviorSubject<UploadImage[]>([]);
  public prescriptionSubject = new BehaviorSubject<any[]>([]);
  prescription$ = this.prescriptionSubject.asObservable();

  setPrescriptions(data: any[]) {
    this.prescriptionSubject.next(data);
  }

  getPrescriptionsSnapshot() {
    return this.prescriptionSubject.value;
  }
}

interface UploadImage {
  id: number;
  image: string;
}
