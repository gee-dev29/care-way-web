import { inject, Injectable, signal } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast';

@Injectable({ providedIn: 'root' })
export class AgoraService {
  rtc: IAgoraRTCClient;
  localAudioTrack: ILocalAudioTrack;
  localVideoTrack: ICameraVideoTrack;
  remoteAudioTrack: IRemoteAudioTrack | undefined;
  remoteVideoTrack: IRemoteVideoTrack | undefined;
  agoraEngine: any;
  remoteUsers: any = [];
  meetingEnded = false;
  notification = false;
  toast = inject(ToastService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  router = inject(Router);
  streamActor: string;
  professionalId: string | undefined;
  private pipActiveSubject = new BehaviorSubject<boolean>(false);
  pipActive$ = this.pipActiveSubject.asObservable();
  appointmentId: string;
  uidConflict = signal(false);
  callActiveSignal = signal(false);
  isCallOn = this.callActiveSignal.asReadonly();

  createRTCClient(config: any, remoteFeed: any): IAgoraRTCClient {
    const { mode, codec } = config;
    const client = AgoraRTC.createClient({ mode: mode, codec: codec });
    client.on('user-published', async (user, mediaType) => {
      if (client.connectionState !== 'CONNECTED') return;
      if (config.uid !== user.uid && client.uid) {
        await this.rtc.subscribe(user, mediaType);
        if (mediaType === 'video') {
          this.remoteVideoTrack = user.videoTrack;
          this.remoteVideoTrack?.play(remoteFeed.nativeElement);
          this.toast.show(
            this.streamActor === 'Doctor'
              ? "Patient's video connected"
              : "Doctor's video connected",
            'success'
          );
        }
        if (mediaType === 'audio') {
          this.remoteAudioTrack = user.audioTrack;
          this.remoteAudioTrack?.play();
          this.toast.show(
            this.streamActor === 'Doctor'
              ? "Patient's audio connected"
              : "Doctor's audio connected",
            'success'
          );
        }
      } else {
        this.loadingSubject.next(true);
      }
    });
    client.on('user-unpublished', async (user, mediaType) => {
      if (client.connectionState !== 'CONNECTED') return;
      if (config.uid !== user.uid) {
        await this.rtc.unsubscribe(user, mediaType);
        if (mediaType === 'video') {
          this.toast.show(
            this.streamActor === 'Doctor'
              ? "Patient's video disconnected"
              : "Doctor's video disconnected",
            'error'
          );
        }
        if (mediaType === 'audio') {
          this.toast.show(
            this.streamActor === 'Doctor'
              ? "Patient's audio disconnected"
              : "Doctor's audio disconnected",
            'error'
          );
        }
      }
    });
    client.on('user-joined', (user) => {
      const userId = user.uid;
      this.toast.show(
        this.streamActor === 'Doctor'
          ? 'Patient has joined'
          : 'Doctor has joined',
        'success'
      );
      this.remoteUsers.push(userId);
    });
    client.on('user-left', (user) => {
      this.toast.show(
        this.streamActor === 'Doctor' ? 'Patient left' : 'Doctor left',
        'error'
      );
    });
    client.on('token-privilege-did-expire', async () => {
      this.toast.show('Meeting Ended', 'error');
      this.leave();
      this.meetingEnded = true;
    });
    client.on('token-privilege-will-expire', async () => {
      //
    });
    client.on('connection-state-change', async (state, revState, reason) => {
      //
    });
    return client;
  }

  async startCall(
    config: any,
    localFeed: any,
    remoteFeed: any,
    streamActor: string,
    appointmentId: string,
    professionalId?: string
  ) {
    this.streamActor = streamActor;
    this.professionalId = professionalId;
    this.appointmentId = appointmentId;
    if (this.rtc) {
      this.rtc.removeAllListeners();
      if (this.rtc.connectionState !== 'DISCONNECTED') {
        await this.rtc.leave();
      }
      this.localAudioTrack?.close();
      this.localVideoTrack?.close();
      this.localAudioTrack = undefined as any;
      this.localVideoTrack = undefined as any;
      this.remoteAudioTrack = undefined;
      this.remoteVideoTrack = undefined;
    }
    this.agoraEngine = this.createRTCClient(config, remoteFeed);
    await this.startLocalVideo(this.agoraEngine, config, localFeed);
  }

  async startLocalVideo(rtc: IAgoraRTCClient, config: any, localFeed: any) {
    this.rtc = rtc;
    const { appId, channel, token, uid } = config;
    let joined = false;
    try {
      await this.rtc.join(appId, channel, token, uid);
      joined = true;
    } catch (error: any) {
      if (error.code === 'UID_CONFLICT') {
        this.uidConflict.set(true);
      }
    }
    if (!joined) return;
    try {
      await this.waitForConnected();
    } catch (err) {
      this.toast.show('Connection failed, please retry', 'error');
      return;
    }
    // Create an audio track from the audio sampled by a microphone.
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a video track from the video captured by a camera.
    this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: '480p',
      facingMode: 'user',
    });
    localFeed.nativeElement.id = uid;

    this.localVideoTrack.play(localFeed.nativeElement);
    // channel for other users to subscribe to it.
    await this.rtc.publish([this.localAudioTrack, this.localVideoTrack]);
    this.callActiveSignal.set(true);
    await this.rtc.on('connection-state-change', (current: any) => {
      //
    });
  }

  waitForConnected(timeoutMs = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.rtc.connectionState === 'CONNECTED') {
        resolve();
        return;
      }
      const timeout = setTimeout(() => {
        this.rtc.off('connection-state-change', handler);
        reject(new Error('Connection timeout'));
      }, timeoutMs);
      const handler = (state: string) => {
        if (state === 'CONNECTED') {
          clearTimeout(timeout);
          this.rtc.off('connection-state-change', handler);
          resolve();
        } else if (state === 'DISCONNECTED' || state === 'FAILED') {
          clearTimeout(timeout);
          this.rtc.off('connection-state-change', handler);
          reject(new Error(`Connection failed: ${state}`));
        }
      };
      this.rtc.on('connection-state-change', handler);
    });
  }

  async leave() {
    this.callActiveSignal.set(false);
    this.localAudioTrack?.close();
    this.localVideoTrack?.close();
    if (this.rtc && this.rtc.connectionState !== 'DISCONNECTED') {
      await this.rtc.leave();
    }
    this.goToAppointment();
  }

  goToAppointment() {
    if (this.streamActor === 'Doctor') {
      // this.router.navigate(
      //   [
      //     '/doctor-dashboard',
      //     this.professionalId,
      //     'view-appointment',
      //     this.appointmentId,
      //   ],
      //   {
      //     queryParams: {
      //       type: 'virtual',
      //     },
      //   }
      // );
    } else {
      this.router.navigate(['dashboard/view-appointment', this.appointmentId]);
    }
  }

  toggleAudio(enabled: boolean) {
    this.localAudioTrack?.setEnabled(enabled);
  }

  async switchCamera() {
    const devices = await AgoraRTC.getCameras();
    const current = this.localVideoTrack.getTrackLabel();
    const next = devices.find((d) => d.label !== current);
    if (next) {
      await this.localVideoTrack.setDevice(next.deviceId);
    }
  }

  replayLocalTrack(element: HTMLElement) {
    this.localVideoTrack?.play(element);
  }

  replayRemoteTrack(element: HTMLElement) {
    this.remoteVideoTrack?.play(element);
  }

  isCallActive(): boolean {
    return !!this.localVideoTrack && this.rtc?.connectionState === 'CONNECTED';
  }
}
