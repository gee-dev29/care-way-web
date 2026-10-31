import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  Gesture,
  GestureController,
  IonImg,
  IonRouterOutlet,
  IonText,
} from '@ionic/angular/standalone';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { ButtonComponent } from '@healbridge/ui';

@Component({
  selector: 'app-slide1',
  imports: [IonImg, IonRouterOutlet, ButtonComponent, IonText],
  templateUrl: './slide1.html',
  styleUrl: './slide1.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class Slide1 implements OnInit, OnDestroy, AfterViewInit {
  index = 0;
  interval: any;
  private gestureCtrl = inject(GestureController);
  private gesture?: Gesture;
  private router = inject(Router);
  @ViewChild('slide', { static: false }) slide?: ElementRef<HTMLElement>;
  items = [1, 2, 3, 4];

  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (this.index > -1 && this.index <= 3) {
        this.index = this.index + 1;
      }
      if (this.index > 3) {
        this.index = 0;
      }
    }, 5000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.slide) {
        return;
      }
      this.initGesture();
    }, 300);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.gesture?.destroy();
  }

  private initGesture() {
    const el = this.slide?.nativeElement;
    if (!el) {
      return;
    }
    const gesture = this.gestureCtrl.create({
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
        const threshold = 80;
        const { deltaX } = ev;
        el.style.transition = 'transform 150ms ease-out';

        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && this.index > 0) {
            this.index--;
          } else if (deltaX < 0 && this.index < this.items.length - 1) {
            this.index++;
          }
        }
        el.style.transform = 'translateX(0)';
      },
    });

    gesture.enable(true);
  }
  routeTo(event: string) {
    if (event == 'login') {
      this.router.navigateByUrl('login');
    }else{
      this.router.navigateByUrl('signup');
    }
  }
}
