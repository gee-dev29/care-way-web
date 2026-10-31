import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { UploadPrescription } from '@healbridge/ui';

@Component({
  selector: 'app-prescription-upload',
  imports: [UploadPrescription],
  templateUrl: './prescription-upload.html',
  styleUrl: './prescription-upload.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrescriptionUpload implements OnInit {
  public api = inject(ApiService);
  private auth = inject(AuthService);
  referencedDocumentId: any;

  ngOnInit(): void {
    this.auth.userDetail(this.api, (auth) => {
      this.referencedDocumentId = auth?.jti;
    });
  }
}
