import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { UploadComponent } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'rider-order-capture',
  imports: [UploadComponent, IonContent],
  templateUrl: './order-capture.html',
  styleUrl: './order-capture.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderCapture implements OnInit {
  private router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public activatedRoute = inject(ActivatedRoute);
  public referencedDocumentId: any;
  route: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.referencedDocumentId = params.serviceRequestOrderId;

      this.route = `/dashboard/delivery-pin/${this.referencedDocumentId}`;
    });
  }
  goback(route: any) {
    this.router.navigateByUrl(
      `/dashboard/order-details/${this.referencedDocumentId}`
    );
  }
}
