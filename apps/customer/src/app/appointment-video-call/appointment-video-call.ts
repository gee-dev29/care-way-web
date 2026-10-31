import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { ApiService, StreamActor } from '@healbridge/api';
import { CountdownComponent } from 'ngx-countdown';
import { catchError, delay, retryWhen, take, throwError } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgoraService, ToastService } from '@healbridge/shared';
import moment from 'moment';
import { IonIcon } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-appointment-video-call',
  imports: [CommonModule, CountdownComponent, IonIcon],
  templateUrl: './appointment-video-call.html',
  styleUrl: './appointment-video-call.css',
})
export class AppointmentVideoCall {
  private api = inject(ApiService);
  private router = inject(Router);
  private toastr = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  private callService = inject(AgoraService);
  private destroyRef = inject(DestroyRef);
  @ViewChild('local', { static: true }) localFeed: ElementRef;
  @ViewChild('remote', { static: true }) remoteFeed: ElementRef;
  timeLeft = 0;
  muted: boolean;
  appointmentId: string;

  constructor() {
    effect(() => {
      if (this.callService.uidConflict()) {
        this.handleUidConflict();
      }
    });
  }

  ionViewWillEnter() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params[string]) => {
        this.appointmentId = params.appointmentId;
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

  handleUidConflict() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.api
        .getStreamByReferencedDocumentId({
          referencedDocumentId: params.appointmentId,
        })
        .subscribe((stream: any) => {
          this.api
            .kickActorOut({ streamId: stream.id, actor: StreamActor.Customer })
            .subscribe(() => {
              this.startCall();
            });
        });
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
          .getVideoStreamDetails({ streamId, actor: StreamActor.Customer })
          .pipe(
            catchError((error) => throwError(error)),
            retryWhen((errors) => errors.pipe(delay(1000), take(3)))
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
              StreamActor.Customer,
              this.appointmentId
            );
            this.api.recordLiveStream({ streamId }).subscribe(() => {
              this.toastr.show('Recording in progress', 'success');
            });
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
    this.router.navigateByUrl('/dashboard/appointments');
  }

  toggleMic() {
    this.muted = !this.muted;
    this.callService.toggleAudio(!this.muted);
  }

  switchCamera() {
    this.callService.switchCamera();
  }
}
