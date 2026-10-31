import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { SharedAddBank } from '@care-way/ui';

@Component({
  selector: 'rider-add-bank-rider',
  imports: [SharedAddBank],
  templateUrl: './add-bank-rider.html',
  styleUrl: './add-bank-rider.css',
})
export class AddBankRider implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  riderId: string;
  route: any;
  backRoute: any;

  ngOnInit(): void {
    const walletBackRoute = history.state?.backRoute;

    this.activatedRoute.params.subscribe((params) => {
      this.riderId = params['riderId'];

      if (walletBackRoute) {
        this.route = walletBackRoute;
        this.backRoute = walletBackRoute;
      } else if (params['edit']) {
        this.route = `/dashboard/profile/${this.riderId}`;
        this.backRoute = `/dashboard/profile/${this.riderId}`;
      } else {
        this.route = `/dashboard/summary/${this.riderId}`;
        this.backRoute = `/dashboard/summary/${this.riderId}`;
      }
    });
  }
}
