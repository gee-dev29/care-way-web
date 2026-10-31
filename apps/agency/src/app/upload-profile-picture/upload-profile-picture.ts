import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { UploadComponent } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'agency-upload-profile-picture',
  imports: [IonContent, UploadComponent],
  templateUrl: './upload-profile-picture.html',
  styleUrl: './upload-profile-picture.css',
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
      this.referencedDocumentId = params.agentId;

      this.route = `/dashboard/more`;
    });
  }
  goback(route: any) {
    this.router.navigateByUrl(this.route);
  }
}
