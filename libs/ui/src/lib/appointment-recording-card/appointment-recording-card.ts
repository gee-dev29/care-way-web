import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, play } from 'ionicons/icons';
import { RecordingPlayer } from '../recording-player/recording-player';

@Component({
  selector: 'ui-appointment-recording-card',
  imports: [CommonModule, IonIcon, RecordingPlayer],
  templateUrl: './appointment-recording-card.html',
  styleUrl: './appointment-recording-card.css',
})
export class AppointmentRecordingCard {
  @Input() recordingUrls$: Observable<any>;
  @Input() selectedId: any;
  isVideo: boolean = false;
  selectedRecordingUrl: string | null = null;

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
      play,
    });
  }

  closeVideo() {
    this.isVideo = false;
    this.selectedRecordingUrl = null;
  }

  selectItem(item: any) {
    this.isVideo = true;
    this.selectedRecordingUrl = item;
  }
}
