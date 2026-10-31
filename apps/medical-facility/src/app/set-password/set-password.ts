import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { SharedSetPassword } from '@care-way/ui';

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
