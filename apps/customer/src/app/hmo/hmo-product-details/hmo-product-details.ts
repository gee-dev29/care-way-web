import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Hmo, HmoProduct } from '@care-way/api';
import { AmountFormatPipe, ButtonComponent } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { splitToChips, HmoJourneyService } from '@care-way/shared';

@Component({
  selector: 'app-hmo-product-details',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSkeletonText,
    ButtonComponent,
    AmountFormatPipe,
  ],
  templateUrl: './hmo-product-details.html',
  styleUrl: './hmo-product-details.css',
})
export class HmoProductDetails {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private journey = inject(HmoJourneyService);

  hmo?: Hmo;
  product?: HmoProduct;

  inclusions: string[] = [];
  exclusions: string[] = [];
  loaded = false;
  failed = false;

  constructor() {
    addIcons({ 'left-arrow': chevronBackOutline });
  }

  ionViewWillEnter() {
    const hmoId = this.route.snapshot.paramMap.get('hmoId') as string;
    const hmoProductId = this.route.snapshot.paramMap.get(
      'hmoProductId'
    ) as string;

    this.loaded = false;
    this.failed = false;

    forkJoin({
      hmo: this.api.getHmo({ hmoId }),
      product: this.api.getHmoProduct({ hmoId, hmoProductId }),
    }).subscribe({
      next: ({ hmo, product }) => {
        this.hmo = hmo;
        this.product = product;
        this.inclusions = splitToChips(product?.inclusions);
        this.exclusions = splitToChips(product?.exclusions);
        this.loaded = true;
      },
      error: () => {
        this.failed = true;
        this.loaded = true;
      },
    });
  }

  buyNow() {
    this.journey.clear();
    this.journey.patch({ hmo: this.hmo, hmoProduct: this.product });
    this.router.navigateByUrl('/dashboard/hmo-select-members');
  }

  back() {
    this.router.navigateByUrl('/dashboard/hmo-products');
  }
}
