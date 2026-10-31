import { Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  pauseCircleOutline,
  play,
  playCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'ui-preview-video',
  imports: [IonContent, IonIcon],
  templateUrl: './preview-video.html',
  styleUrl: './preview-video.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PreviewVideo {
  private router = inject(Router);
  private location = inject(Location);
  @ViewChild('videoPlayer', { static: false })
  video!: ElementRef<HTMLVideoElement>;

  showCenterPlay = true;
  showPauseBtn = false;

  constructor() {
    addIcons({
      playCircleOutline,
      pauseCircleOutline,
      play,
      chevronBackOutline,
    });
  }

  playVideo(event: Event) {
    event.stopPropagation();
    this.video.nativeElement.play();
  }

  pauseVideo(event: Event) {
    event.stopPropagation();
    this.video.nativeElement.pause();
  }

  onPlay() {
    this.showCenterPlay = false;
    this.showPauseBtn = false;
  }

  onPause() {
    this.showCenterPlay = true;
    this.showPauseBtn = false;
  }

  onScreenTap() {
    const videoEl = this.video.nativeElement;
    if (videoEl.paused) {
      videoEl.play();
      this.showPauseBtn = false;
      return;
    }
    this.showPauseBtn = true;
    setTimeout(() => {
      this.showPauseBtn = false;
    }, 3000);
  }

  goBack() {
    this.location.back();
  }
}
