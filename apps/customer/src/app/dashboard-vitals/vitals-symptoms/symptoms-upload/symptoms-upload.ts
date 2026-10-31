import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { UploadComponent } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-symptoms-upload',
  imports: [UploadComponent, IonContent],
  templateUrl: './symptoms-upload.html',
  styleUrl: './symptoms-upload.css',
})
export class SymptomsUpload implements OnInit {
  public api = inject(ApiService);
  public router = inject(Router);
  public auth = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  heading: any;
  referencedDocumentId: any;
  route: any;
  skip: any;
  module: any;
  bodyId: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.module = params.module;
      this.bodyId = params.bodyId;
    });

    if (this.bodyId) {
      this.referencedDocumentId = this.bodyId;
    }

    this.heading = 'Symptoms';
    if (this.module && this.bodyId) {
      this.route = `/dashboard/vitals/uploaded-sypmtoms/${this.bodyId}/${this.module}`;
      this.skip = `/dashboard/vitals/symptoms-details/${this.bodyId}/${this.module}`;
    }
  }

  goback(route: any) {
    this.router.navigateByUrl(`/dashboard/vitals/add-symptoms/${this.module}`);
  }
}
