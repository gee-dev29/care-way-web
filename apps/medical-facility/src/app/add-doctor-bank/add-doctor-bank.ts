import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { SharedAddBank } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-add-doctor-bank',
  imports: [SharedAddBank],
  templateUrl: './add-doctor-bank.html',
  styleUrl: './add-doctor-bank.css',
})
export class AddDoctorBank {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  professionalId: string;
  route: any;
  backRoute: any;

  ngOnInit(): void {
    const backRoute = history.state?.backRoute;
    this.activatedRoute.params.subscribe((params) => {
      this.professionalId = params['professionalId'];

      this.route = `/doctor-dashboard/${this.professionalId}/doctor-details`;
      this.backRoute = `/doctor-dashboard/${this.professionalId}/doctor-details`;

      if (backRoute) {
        this.route = backRoute;
        this.backRoute = backRoute;
      }
    });
  }
}
