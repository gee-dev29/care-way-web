import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Hmo, HmoProduct } from '@healbridge/api';
import { LimitSize } from '@healbridge/shared';
import { AmountFormatPipe } from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  MyHmoPurchase,
  statusColor,
  statusLabel,
  HmoJourneyService,
} from '@healbridge/shared';
export interface HmoProductRow extends HmoProduct {
  hmoId?: string;
  hmo?: Hmo;
  logoUrl?: string;
  status?: string;
  orderId?: string;
}

@Component({
  selector: 'app-hmo-product-list',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSearchbar,
    IonSkeletonText,
    AmountFormatPipe,
  ],
  templateUrl: './hmo-product-list.html',
  styleUrl: './hmo-product-list.css',
})
export class HmoProductList implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private journey = inject(HmoJourneyService);

  mode: 'browse' | 'active' = 'browse';
  products: HmoProductRow[] = [];
  filtered: HmoProductRow[] = [];
  loaded = false;
  failed = false;
  skeletons = ['', '', '', ''];

  get title() {
    return this.mode === 'active' ? 'HMO Purchase History' : 'HMO Products';
  }

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
      'right-arrow': chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'] ?? 'browse';
  }

  ionViewWillEnter() {
    this.load();
  }

  private load() {
    this.loaded = false;
    this.failed = false;
    const source$ =
      this.mode === 'active' ? this.loadPurchases() : this.loadCatalogue();

    source$.subscribe({
      next: (rows) => {
        this.products = rows;
        this.filtered = rows;
        this.loaded = true;
      },
      error: () => {
        this.failed = true;
        this.loaded = true;
      },
    });
  }

  private loadCatalogue(): Observable<HmoProductRow[]> {
    return this.api.getHmOs({ skip: 0, limit: LimitSize.DropDown }).pipe(
      switchMap((response) => {
        const hmos = response?.data ?? [];
        if (!hmos.length) return of([] as HmoProductRow[]);
        return forkJoin(
          hmos.map((hmo) =>
            forkJoin({
              products: this.api
                .getHmoProducts({
                  hmoId: hmo.hmoId as string,
                  skip: 0,
                  limit: LimitSize.DropDown,
                })
                .pipe(
                  map((res) => res?.data ?? []),
                  catchError(() => of([] as HmoProduct[]))
                ),
              logoUrl: this.loadLogo(hmo.hmoId),
            }).pipe(
              map(({ products, logoUrl }) =>
                products.map((product) => ({
                  ...product,
                  hmoId: hmo.hmoId,
                  hmo,
                  logoUrl,
                }))
              )
            )
          )
        ).pipe(map((groups) => groups.flat()));
      })
    );
  }

  private loadPurchases(): Observable<HmoProductRow[]> {
    const purchases = this.journey.getMyHmoPurchases();
    const rows: HmoProductRow[] = purchases.map((purchase: MyHmoPurchase) => ({
      ...(purchase.hmoProduct ?? {}),
      hmoId: purchase.hmo?.hmoId,
      hmo: purchase.hmo,
      status: purchase.status,
      orderId: purchase.orderId,
    }));
    if (!rows.length) return of(rows);

    const hmoIds = [
      ...new Set(
        rows.map((row) => row.hmoId).filter((id): id is string => !!id)
      ),
    ];

    return forkJoin({
      logos: hmoIds.length
        ? forkJoin(hmoIds.map((hmoId) => this.loadLogo(hmoId)))
        : of([] as (string | undefined)[]),
      // The order carries the live status, so a plan shows as Active only once
      // its payment has actually gone through.
      statuses: forkJoin(
        purchases.map((purchase) => this.loadStatus(purchase))
      ),
    }).pipe(
      map(({ logos, statuses }) => {
        const logoByHmo = new Map(hmoIds.map((hmoId, i) => [hmoId, logos[i]]));
        return rows.map((row, i) => ({
          ...row,
          logoUrl: row.hmoId ? logoByHmo.get(row.hmoId) : undefined,
          status: statuses[i] ?? row.status,
        }));
      })
    );
  }

  private loadStatus(purchase: MyHmoPurchase): Observable<string | undefined> {
    return this.api.getHmoProductOrder({ orderId: purchase.orderId }).pipe(
      map((order) => order?.status ?? purchase.status),
      catchError(() => of(purchase.status))
    );
  }

  private loadLogo(hmoId?: string): Observable<string | undefined> {
    if (!hmoId) return of(undefined);
    return this.api.getUploads({ referencedDocumentId: hmoId }).pipe(
      map((res: any) => res?.at(-1)?.url ?? undefined),
      catchError(() => of(undefined))
    );
  }

  search(event: CustomEvent) {
    const term = String((event.target as HTMLIonSearchbarElement)?.value ?? '')
      .trim()
      .toLowerCase();
    this.filtered = !term
      ? this.products
      : this.products.filter(
          (product) =>
            product.productName?.toLowerCase().includes(term) ||
            product.hmo?.name?.toLowerCase().includes(term)
        );
  }

  readonly statusColor = statusColor;
  readonly statusLabel = statusLabel;

  open(product: HmoProductRow) {
    if (this.mode === 'active') {
      this.router.navigate(['/dashboard/hmo-plan', product.orderId]);
      return;
    }
    this.router.navigate([
      '/dashboard/hmo-product-details',
      product.hmoId,
      product.hmoProductId,
    ]);
  }

  back() {
    this.router.navigateByUrl('/dashboard/more');
  }

  initials(name?: string) {
    return (name ?? '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('');
  }

  onLogoError(product: HmoProductRow) {
    product.logoUrl = undefined;
  }
}
