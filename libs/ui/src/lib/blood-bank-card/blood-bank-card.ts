import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ui-blood-bank-card',
  imports: [IonImg, IonIcon, ButtonComponent],
  templateUrl: './blood-bank-card.html',
  styleUrl: './blood-bank-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BloodBankCard implements OnInit, OnChanges {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() requestCost = new EventEmitter<string[]>();
  private activatedRoute = inject(ActivatedRoute);
  @Input() api: any;
  @Input() documentStatus: any;
  appointmentId: string;
  professionalId: string;
  disabled = true;
  module: string;
  @Input() isLoading = false;
  @Input() bloodBank: any;
  referralIds: string[] = [];
  constructor() {
    addIcons({
      closeCircleOutline,
    });
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.module = params.module;
    });
  }
  ngOnChanges(changes: any) {
    if (changes['bloodBank'] && this.bloodBank) {
      this.disabled = !this.bloodBank.some((s: any) => s.status === 'Draft');
    }
  }

  editBlood(blood: any) {
    this.edit.emit(blood);
  }
  deleteBlood(blood: any) {
    this.delete.emit(blood);
  }

  proceed() {
    this.referralIds = this.bloodBank
      ?.filter((res: any) => res.status === 'Draft')
      .map((res: any) => res.referralId);
    this.requestCost.emit(this.referralIds);
  }
}
