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
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ui-rad-imaging-card',
  imports: [ButtonComponent, IonIcon, IonImg],
  templateUrl: './rad-imaging-card.html',
  styleUrl: './rad-imaging-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RadImagingCard implements OnInit, OnChanges {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() requestCost = new EventEmitter<string[]>();
  private activatedRoute = inject(ActivatedRoute);
  @Input() api: any;
  module: string;
  @Input() rads: any;
  @Input() documentStatus: any;
  referralIds: string[] = [];
  disabled = true;
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
    if (changes['rads'] && this.rads) {
      this.disabled = !this.rads.some((s: any) => s.status === 'Draft');
    }
  }

  deleteRad(rad: any) {
    this.delete.emit();
  }
  editRad(rad: any) {
    this.edit.emit(rad);
  }
  proceed() {
    this.referralIds = this.rads
      ?.filter((res: any) => res.status === 'Draft')
      .map((res: any) => res.referralId);

    this.requestCost.emit(this.referralIds);
  }
}
