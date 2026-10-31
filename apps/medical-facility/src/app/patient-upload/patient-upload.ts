import { Component, inject, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { UploadComponent } from '@healbridge/ui';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';

@Component({
  selector: 'medical-facility-patient-upload',
  imports: [IonContent, UploadComponent],
  templateUrl: './patient-upload.html',
  styleUrl: './patient-upload.css',
})
export class PatientUpload implements OnInit {
  private router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public activatedRoute = inject(ActivatedRoute);
  public referencedDocumentId: any;
  route: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.memberId) {
        this.referencedDocumentId = params.memberId;
      } else {
        this.auth.userDetail(this.api, (auth) => {
          this.referencedDocumentId = auth?.jti;
        });
      }
      this.route = `dashboard/patients`;
    });
  }

  onSkip() {
    this.router.navigateByUrl(this.route);
  }
  goback(route: string) {
    this.router.navigateByUrl('/dashboard/add-patient');
  }
}
