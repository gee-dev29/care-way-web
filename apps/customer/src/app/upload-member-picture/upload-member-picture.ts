import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { UploadComponent } from '@healbridge/ui';

@Component({
  selector: 'app-upload-member-picture',
  imports: [UploadComponent],
  templateUrl: './upload-member-picture.html',
  styleUrl: './upload-member-picture.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadMemberPicture implements OnInit {
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
    });
    const currentUrl = this.router.url;
    if (currentUrl.includes('profile')) {
      this.route = '/dashboard/profile?type=Profile';
    } else {
      this.route = `/dashboard/member-details/${this.referencedDocumentId}`;
    }
  }
  goback(route: any) {
    this.router.navigateByUrl(route);
  }
}
