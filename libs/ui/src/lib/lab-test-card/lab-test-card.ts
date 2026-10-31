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
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ui-lab-test-card',
  imports: [IonIcon, IonImg, ButtonComponent],
  templateUrl: './lab-test-card.html',
  styleUrl: './lab-test-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LabTestCard implements OnInit, OnChanges {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() requestCost = new EventEmitter<string[]>();
  private activatedRoute = inject(ActivatedRoute);
  @Input() documentStatus: any;
  @Input() api: any;
  module: string;
  referralIds: string[] = [];
  disabled = true;
  @Input() labTests: any;
  @Input() isLoading = false;
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
    if (changes['labTests'] && this.labTests) {
      this.disabled = !this.labTests.some((s: any) => s.status === 'Draft');
    }
  }

  editLab(lab: any) {
    this.edit.emit(lab);
  }
  deleteLab(lab: any) {
    this.delete.emit();
  }
  proceed() {
    this.referralIds = this.labTests
      ?.filter((res: any) => res.status === 'Draft')
      .map((res: any) => res.referralId);

    this.requestCost.emit(this.referralIds);
  }
}
