import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { SharedVerifyOtp } from '@care-way/ui';

@Component({
  selector: 'medical-facility-verify-otp',
  imports: [SharedVerifyOtp],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp implements OnInit {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public activatedRoute = inject(ActivatedRoute);
  NonProfessionalUserType = NonProfessionalUserType;
  routeSlug: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.routeSlug = params.facilityId;
    });
  }
}
