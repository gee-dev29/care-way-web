import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { AddAddress } from '@healbridge/ui';

import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-dashboard-add-address',
  imports: [IonContent, AddAddress],
  templateUrl: './dashboard-add-address.html',
  styleUrls: ['./dashboard-add-address.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardAddAddress implements OnInit {
  private auth = inject(AuthService);
  public api = inject(ApiService);
  referencedDocumentId: any;
  ngOnInit(): void {
    this.auth.userDetail(this.api, (auth) => {
      this.referencedDocumentId = auth?.jti;
    });
  }
}
