import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { SharedSetPassword } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-set-password',
  imports: [SharedSetPassword],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css',
})
export class SetPassword implements OnInit {
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  public auth = inject(AuthService);
  NonProfessionalUserType = NonProfessionalUserType;
  routeSlug: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.routeSlug = params.facilityId;
    });
  }
}
