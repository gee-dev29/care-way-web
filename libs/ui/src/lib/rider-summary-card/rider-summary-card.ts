import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline } from 'ionicons/icons';
import { AddNewEntryCard } from '../add-new-entry-card/add-new-entry-card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-rider-summary-card',
  imports: [
    CommonModule,
    IonIcon,
    AddNewEntryCard,
    IonModal,
    IonCardContent,
    IonImg,
    IonText,
    IonCard,
  ],
  templateUrl: './rider-summary-card.html',
  styleUrl: './rider-summary-card.css',
})
export class RiderSummaryCard {
  private router = inject(Router);
  @Input() profile: any;
  @Input() license: any;
  @Input() bank: any;
  @Output() eyeClick = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Input() riderId: string;
  @Input() api: any;
  displayFile = false;
  canDismiss = false;
  @ViewChild('modal') modal: IonModal;
  picture: any;

  eyeClicked() {
    this.eyeClick.emit();
  }

  addNew(route: any) {
    this.router.navigate([route, this.riderId]);
  }
  async viewLicense(licenseId: string) {
    this.api
      .getUploads({ referencedDocumentId: licenseId })
      .subscribe((res: any) => {
        this.canDismiss = true;
        this.modal.dismiss(null, 'close');
        this.picture = res[res.length - 1].url;
        this.canDismiss = false;
        this.displayFile = true;
      });
  }

  closeSave() {
    this.displayFile = false;
    this.canDismiss = true;

    setTimeout(() => {
      this.modal.dismiss(null, 'close');
      this.canDismiss = false;
    }, 0);
  }
}
