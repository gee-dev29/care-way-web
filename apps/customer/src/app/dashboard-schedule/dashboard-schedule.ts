import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonImg,
  Gesture,
  GestureController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-schedule',
  imports: [IonContent, IonImg],
  templateUrl: './dashboard-schedule.html',
  styleUrl: './dashboard-schedule.css',
})
export class DashboardSchedule implements AfterViewInit {
  private gestureCtrl = inject(GestureController);
  private gesture?: Gesture;
  private router = inject(Router);
  private el: ElementRef;
  index = 0;
  @ViewChild('tabs', { static: false }) tabs?: ElementRef<HTMLElement>;
  ionViewWillEnter() {
    const el = this.tabs?.nativeElement;
    if (el) {
      el.style.transform = 'translateX(0)';
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const el = this.tabs?.nativeElement;
      if (!el) {
        return;
      }
      const gesture: Gesture = this.gestureCtrl.create({
        el,
        gestureName: 'fast-swipe',
        direction: 'x',
        threshold: 0,
        gesturePriority: 100,
        maxAngle: 45,
        onStart: () => {
          el.style.transition = 'none';
        },
        onMove: (ev) => {
          el.style.transform = `translateX(${ev.deltaX}px)`;
        },
        onEnd: (ev) => {
          const limit = 100;
          const threshold = ev.deltaX;
          el.style.transition = 'transform 150ms ease-out';
          if (threshold > limit) {
            el.style.transform = 'translateX(100%)';
            setTimeout(() => this.router.navigateByUrl('/dashboard/home'), 150);
            return;
          }
          if (threshold < -limit) {
            el.style.transform = 'translateX(-100%)';
            setTimeout(
              () => this.router.navigateByUrl('/dashboard/prescription'),
              150
            );
            return;
          }
          el.style.transform = 'translateX(0)';
        },
      });

      gesture.enable(true);
    }, 300);
  }
}
