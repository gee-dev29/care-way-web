import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { UploadComponent } from '@care-way/ui';

@Component({
  selector: 'medical-facility-upload-profile-picture',
  imports: [UploadComponent],
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
      if (
        params.pharmacyId ||
        params.bloodBankId ||
        params.radiologyId ||
        params.laboratoryId ||
        params.professionalId
      ) {
        this.referencedDocumentId =
          params.pharmacyId ??
          params.bloodBankId ??
          params.radiologyId ??
          params.laboratoryId ??
          params.professionalId;
        const currentUrl = this.router.url;
        const parts = currentUrl.split('/');

       if(this.router.url.includes('doctor-dashboard')){
        this.route = `/doctor-dashboard/${params.professionalId}/doctor-details`;
       } else if(this.router.url.includes('nurse-dashboard')){
        this.route = `/nurse-dashboard/${params.professionalId}/nurse-details`;
       }else if (params.facilityType) {
          this.route = `/${parts[1]}/${parts[2]}/${params.facilityType}/${params.facilityId}/${this.referencedDocumentId}`;
        } else {
          this.route = `/${parts[1]}/${parts[2]}/${params.facilityId}/${this.referencedDocumentId}`;
        }
      }
    });
  }
  goback(route: any) {
    this.router.navigateByUrl(this.route);
  }
}
