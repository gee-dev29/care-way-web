import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { UploadComponent } from '../upload-component/upload-component';

@Component({
  selector: 'ui-upload-prescription',
  imports: [UploadComponent, IonContent],
  templateUrl: './upload-prescription.html',
  styleUrl: './upload-prescription.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadPrescription implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Input() api: any;
  @Input() referencedDocumentId: any;
  route: string;
  heading: string;
  module: string | null;
  ngOnInit(): void {
    if (this.router.url.includes('upload-symptoms')) {
      this.heading = 'Scan/Upload Symptoms';

      this.activatedRoute.paramMap.subscribe((params) => {
        this.module = params.get('module');
      });
      if (this.module) {
        this.route = '/dashboard/vitals/scan-symptoms/' + this.module;
      } else {
        this.route = '/scan-symptoms';
      }
    } else {
      this.route = '/dashboard/scan-prescription';
      this.heading = 'Scan/Upload Prescription';
    }
  }
  goback(route: any) {
    this.router.navigateByUrl(route);
  }
}
