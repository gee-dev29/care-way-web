import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, StreamActor } from '@care-way/api';
import { AgoraService, ToastService } from '@care-way/shared';
import { catchError, delay, retryWhen, take, throwError } from 'rxjs';
import moment from 'moment';
import { CountdownComponent } from 'ngx-countdown';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-appointment-video-call-doctor',
  imports: [CountdownComponent, CommonModule, IonIcon],
  templateUrl: './appointment-video-call-doctor.html',
  styleUrl: './appointment-video-call-doctor.css',
})
export class AppointmentVideoCallDoctor {
  private api = inject(ApiService);
  private router = inject(Router);
  private toastr = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  private callService = inject(AgoraService);
  private destroyRef = inject(DestroyRef);
  @ViewChild('local', { static: true }) localFeed: ElementRef;
  @ViewChild('remote', { static: true }) remoteFeed: ElementRef;
  timeLeft = 0;
  muted = false;
  appointmentId: string;
  professionalId: string;
  loading$ = this.callService.loading$;

  constructor() {
    effect(() => {
      if (this.callService.uidConflict()) {
        this.handleUidConflict();
      }
    });
  }

  handleUidConflict() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.api
        .getStreamByReferencedDocumentId({
          referencedDocumentId: params.appointmentId,
        })
        .subscribe((stream: any) => {
          this.api
            .kickActorOut({ streamId: stream.id, actor: StreamActor.Doctor })
            .subscribe(() => {
              this.startCall();
            });
        });
    });
  }

  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
      this.muted = false;
      if (this.callService.isCallOn()) {
        this.callService.replayLocalTrack(this.localFeed.nativeElement);
        this.callService.replayRemoteTrack(this.remoteFeed.nativeElement);
        return;
      } else {
        this.startCall();
      }
    });
  }

  async startCall() {
    this.api
      .getStreamByReferencedDocumentId({
        referencedDocumentId: this.appointmentId,
      })
      .subscribe((stream: any) => {
        const streamId = stream.id;
        this.api
          .getVideoStreamDetails({ streamId, actor: StreamActor.Doctor })
          .pipe(
            catchError((error) => throwError(error)),
            retryWhen((errors) => errors.pipe(delay(1000), take(3))),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(async (streamDetails: any) => {
            const agoraConfig = {
              appId: streamDetails.appID,
              channel: streamId,
              token: streamDetails.token,
              uid: streamDetails.uid,
              mode: streamDetails.mode,
              codec: streamDetails.codec,
            };
            await this.callService.startCall(
              agoraConfig,
              this.localFeed,
              this.remoteFeed,
              StreamActor.Doctor,
              this.appointmentId,
              this.professionalId
            );
            const now = moment.utc().unix();
            this.timeLeft = Math.max(streamDetails.ttl - now, 0);
          });
      });
  }

  timerEvent(event: any) {
    if (event.action === 'notify' && event.left <= 60 * 1000) {
      this.toastr.show('You have 1 minute left!', 'error');
    }
    if (event.action === 'notify' && event.left <= 300 * 1000) {
      this.toastr.show('You have 5 minutes left!', 'error');
    }
  }

  async leave() {
    await this.callService.leave();
    this.router.navigate(
      [
        '/doctor-dashboard',
        this.professionalId,
        'doctor-available-appointments',
      ],
      {
        queryParams: {
          tab: 'Ongoing',
        },
      }
    );
  }

  toggleMic() {
    this.muted = !this.muted;
    this.callService.toggleAudio(!this.muted);
  }

  switchCamera() {
    this.callService.switchCamera();
  }
}
