import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import videojs from 'video.js';

@Component({
  selector: 'ui-recording-player',
  imports: [IonIcon],
  templateUrl: './recording-player.html',
  styleUrl: './recording-player.css',
})
export class RecordingPlayer implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoPlayer', { static: false }) videoRef: ElementRef;
  @Input() src: string;
  @Input() closeVideoIcon: boolean = false;
  @Output() videoPlayer = new EventEmitter<void>();
  player: any;

  constructor() {
    addIcons({
      close,
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initPlayer(), 0);
  }

  initPlayer() {
    if (!this.videoRef?.nativeElement || !this.src) return;
    this.player = videojs(this.videoRef.nativeElement, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      fluid: true,
      sources: [{ src: this.src, type: 'application/x-mpegURL' }],
    });

    this.player.on('useractive', () => {
      this.closeVideoIcon = true;
    });

    this.player.on('userinactive', () => {
      setTimeout(() => {
        this.closeVideoIcon = false;
      }, 400);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] && !changes['src'].firstChange) {
      this.destroyPlayer();
      setTimeout(() => this.initPlayer(), 0);
    }
  }

  closeVideo() {
    this.destroyPlayer();
    this.videoPlayer.emit();
  }

  ngOnDestroy() {
    this.destroyPlayer();
  }

  destroyPlayer() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }
}
