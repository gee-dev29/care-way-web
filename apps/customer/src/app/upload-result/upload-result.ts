import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { UploadComponent } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-upload-result',
  imports: [UploadComponent, IonContent, CommonModule],
  templateUrl: './upload-result.html',
  styleUrl: './upload-result.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadResult implements OnInit {
  private router = inject(Router);
  public api = inject(ApiService);
  public route = inject(ActivatedRoute);

  uploadedDocument = '';
  appointmentId: any;
  referencedDocumentId: any;
  routeUrl: any;

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.appointmentId = params.appointmentId;
    });

    if (this.appointmentId) {
      this.referencedDocumentId = this.appointmentId;
      this.routeUrl = `/appointment-details/${this.appointmentId}`;
    }
  }
  goBack(route: string) {
    this.router.navigateByUrl(route);
  }
  // onFileUploaded(file: any) {
  //   this.router.navigate(['/appointment-details'], {
  //     state: { uploadedDocument: file },
  //   });
  // }
}
