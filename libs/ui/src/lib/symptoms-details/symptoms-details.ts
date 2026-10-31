import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonIcon,
  IonImg,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-symptoms-details',
  imports: [IonContent, ButtonComponent, IonIcon, IonImg, IonSkeletonText],
  templateUrl: './symptoms-details.html',
  styleUrl: './symptoms-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SymptomsDetails implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  loaded = false;
  module: string | null;
  loading: boolean;

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 3000);

    this.route.paramMap.subscribe((params: any) => {
      this.module = params.get('module');
    });
  }

  goBack() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/available-symptoms/' + this.module
      );
      return;
    }
    this.router.navigateByUrl('/available-symptoms');
  }
  share() {
    //
  }

  continue() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigateByUrl('/dashboard/schedule-appointment');
    }, 1000);
  }
}
