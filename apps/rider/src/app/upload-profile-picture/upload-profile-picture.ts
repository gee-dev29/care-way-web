import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { UploadComponent } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'rider-upload-profile-picture',
  imports: [UploadComponent, IonContent],
  templateUrl: './upload-profile-picture.html',
  styleUrl: './upload-profile-picture.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadProfilePicture implements OnInit {
  private router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public activatedRoute = inject(ActivatedRoute);
  public referencedDocumentId: any;
  route: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.referencedDocumentId = params.riderId;

      this.route = `/dashboard/more`;
    });
  }
  goback(route: any) {
    this.router.navigateByUrl(this.route);
  }
}
