import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonText,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonList,
} from '@ionic/angular/standalone';
import { DatetimePicker } from '../datetime-picker/datetime-picker';

@Component({
  selector: 'ui-measurement-picker',
  imports: [
    FormsModule,
    CommonModule,
    DatetimePicker,
    IonHeader,
    IonText,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonList,
  ],
  templateUrl: './measurement-picker.html',
  styleUrl: './measurement-picker.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeasurementPicker implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() title: string;
  @Input() toggleText: string;
  @Input() unit1: string;
  @Input() unit2: string;
  @Input() unitMin: number;
  @Input() unitMax: number;
  @Input() cancelRoute: string;
  @Input() saveRoute: string;
  module: string | null;

  selectedDate = '';
  selectedTime = '';

  height = 70;
  toggleBtn = false;

  currentValue: any;
  options: any = [];

  ngOnInit() {
    for (let i = 1; i <= 100; i++) {
      this.options.push({
        label: i.toString(),
        value: i,
      });
    }
    this.route.paramMap.subscribe((params) => {
      this.module = params.get('module');
    });
  }

  cancel() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals' + this.cancelRoute + '/' + this.module
      );
      return;
    }
   this.router.navigateByUrl('/view-appointment');
  }

  save() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals' + this.saveRoute + '/' + this.module
      );
      return;
    }
    this.router.navigateByUrl('/view-appointment');
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
    this.height = event.detail.value;
  }
}
