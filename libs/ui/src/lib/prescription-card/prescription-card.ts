import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleCard } from '../schedule-card/schedule-card';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';

@Component({
  selector: 'ui-prescription-card',
  imports: [ButtonComponent, IonIcon, ScheduleCard],
  templateUrl: './prescription-card.html',
  styleUrl: './prescription-card.css',
})
export class PrescriptionCard implements OnInit, OnChanges {
  @Output() addPrescription = new EventEmitter<void>();
  @Output() requestCost = new EventEmitter<string[]>();
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  @Input() api: any;
  appointmentId: string;
  professionalId: string;
  @Input() documentStatus: any;
  @Input() drug: any[] = [];
  referralIds: string[] = [];
  disabled = true;
  @Input() isLoading = false;
  @Input() canAdd = true;
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;
  module: string;
  expandedIndex: number | null = null;

  constructor() {
    addIcons({
      chevronDown,
      chevronUp,
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.module = params.module;
    });
  }

  ngOnChanges(changes: any) {
    if (changes['drug'] && this.drug) {
      this.disabled = !this.drug.some((s: any) => s.status === 'Draft');
    }
  }

  showDropDown(index:number) {    
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  sendRequest() {
    this.referralIds = this.drug
      ?.filter((res: any) => res.status === 'Draft')
      .map((res: any) => res.referralId);
    this.requestCost.emit(this.referralIds);
  }

  edit(d: any) {
    switch (d.type) {
      case 'Vaccines and Biologics':
        if (this.router.url.includes('nurse-dashboard')) {
          this.router.navigate([
            '/nurse-dashboard',
            this.professionalId,
            'edit-vaccines',
            d.referralId,
          ]);
        } else if (this.professionalId) {
          this.router.navigate([
            '/doctor-dashboard',
            this.professionalId,
            'edit-vaccines',
            d.referralId,
          ]);
        } else {
          this.router.navigate([
            'dashboard/edit-vaccines',
            this.facilityType,
            this.facilityId,
            this.facilityTypeId,
            d.referralId,
          ]);
        }

        break;
      case 'Drugs':
        if (this.router.url.includes('nurse-dashboard')) {
          this.router.navigate([
            '/nurse-dashboard',
            this.professionalId,
            'edit-drugs',
            d.referralId,
          ]);
        } else if (this.professionalId) {
          this.router.navigate([
            '/doctor-dashboard',
            this.professionalId,
            'edit-drugs',
            d.referralId,
          ]);
        } else {
          this.router.navigate([
            'dashboard/edit-drugs',
            this.facilityType,
            this.facilityId,
            this.facilityTypeId,
            d.referralId,
          ]);
        }

        break;
      case 'Medical Devices':
        if (this.router.url.includes('nurse-dashboard')) {
          this.router.navigate([
            '/nurse-dashboard',
            this.professionalId,
            'edit-medical-devices',
            d.referralId,
          ]);
        } else if (this.professionalId) {
          this.router.navigate([
            '/doctor-dashboard',
            this.professionalId,
            'edit-medical-devices',
            d.referralId,
          ]);
        } else {
          this.router.navigate([
            'dashboard/edit-medical-devices',
            this.facilityType,
            this.facilityId,
            this.facilityTypeId,
            d.referralId,
          ]);
        }

        break;
      case 'Herbals and Nutraceuticals':
        if (this.router.url.includes('nurse-dashboard')) {
          this.router.navigate([
            '/nurse-dashboard',
            this.professionalId,
            'edit-herbals-and-nutraceuticals',
            d.referralId,
          ]);
        } else if (this.professionalId) {
          this.router.navigate([
            '/doctor-dashboard',
            this.professionalId,
            'edit-herbals-and-nutraceuticals',
            d.referralId,
          ]);
        } else {
          this.router.navigate([
            'dashboard/edit-herbals-and-nutraceuticals',
            this.facilityType,
            this.facilityId,
            this.facilityTypeId,
            d.referralId,
          ]);
        }

        break;
    }
  }

  remove() {
    console.log('Remove');
  }

  add() {
    this.addPrescription.emit();
  }
}
