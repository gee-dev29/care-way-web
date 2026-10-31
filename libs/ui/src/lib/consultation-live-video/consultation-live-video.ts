import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  cameraReverseOutline,
  micOffOutline,
  micOutline,
} from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'ui-consultation-live-video',
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule],
  templateUrl: './consultation-live-video.html',
  styleUrl: './consultation-live-video.css',
})
export class ConsultationLiveVideo implements OnInit, AfterViewInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  platform = inject(Platform);
  pc!: RTCPeerConnection;
  localStream!: MediaStream;
  remoteStream!: MediaStream;
  currentFacingMode: 'user' | 'environment' = 'user';
  micEnabled = true;
  cameraEnabled = true;
  isSwapped = false;
  remoteCallerName = 'Dr. Williams';

  ngOnInit(): void {
    addIcons({ callOutline, cameraReverseOutline, micOutline, micOffOutline });
  }

  async ngAfterViewInit() {
    await this.setupCall();
  }

  async setupCall() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error(
        'Camera API not available in this environment. ' +
          'Use a real device or HTTPS.'
      );
      return;
    }

    // 2. (Capacitor) Ensure plugin/device ready
    if (Capacitor.isNativePlatform() && !this.platform.is('mobile')) {
      console.error('Running in simulator: getUserMedia not supported.');
      return;
    }

    // 3. Web requires HTTPS
    const isWeb = this.platform.is('mobileweb') || this.platform.is('desktop');
    if (
      isWeb &&
      location.protocol !== 'https:' &&
      location.hostname !== 'localhost'
    ) {
      console.error('getUserMedia requires HTTPS on web.');
      return;
    }

    this.pc = new RTCPeerConnection();

    // 4. Safe getUserMedia call
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (err) {
      console.error('Failed to access camera/microphone:', err);
      return;
    }

    this.localVideo.nativeElement.srcObject = this.localStream;

    this.localStream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.localStream);
    });

    this.remoteStream = this.localStream;
    this.remoteVideo.nativeElement.srcObject = this.remoteStream;

    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    // console.log('%cYOUR OFFER:', 'color: green; font-weight: bold;');
    // console.log(JSON.stringify(offer));

    (window as any).setAnswer = async (answerString: string) => {
      const answer = JSON.parse(answerString);
      await this.pc.setRemoteDescription(answer);
      // console.log('%cANSWER SET ✔', 'color: blue; font-weight: bold;');
    };
  }

  swapView() {
    this.isSwapped = !this.isSwapped;
    if (this.isSwapped) {
      this.remoteCallerName = 'You';
    } else {
      this.remoteCallerName = 'Dr. Williams';
    }
  }

  toggleMic() {
    this.micEnabled = !this.micEnabled;
    if (!this.localStream) return;
    this.localStream
      .getAudioTracks()
      .forEach((t) => (t.enabled = this.micEnabled));
  }

  async toggleCamera() {
    if (!this.localStream) return;

    // Toggle camera mode
    this.currentFacingMode =
      this.currentFacingMode === 'user' ? 'environment' : 'user';

    // Stop current video track
    this.localStream.getVideoTracks().forEach((t) => t.stop());

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: this.currentFacingMode },
      audio: true,
    });

    const newVideoTrack = newStream.getVideoTracks()[0];

    // Replace track in PeerConnection
    const sender = this.pc.getSenders().find((s) => s.track?.kind === 'video');
    if (sender) {
      await sender.replaceTrack(newVideoTrack);
    }

    // Update localStream
    this.localStream.removeTrack(this.localStream.getVideoTracks()[0]);
    this.localStream.addTrack(newVideoTrack);

    // Update UI
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  endCall() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc.close();
    history.back();
  }
}
