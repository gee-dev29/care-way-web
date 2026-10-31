import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, MedicalProduct, ProductType } from '@healbridge/api';
import { MedicalServiceCard, PlusIconComponent } from '@healbridge/ui';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-view-all-medical-service',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonText,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    PlusIconComponent,
    MedicalServiceCard,
  ],
  templateUrl: './view-all-medical-service.html',
  styleUrl: './view-all-medical-service.css',
})
export class ViewAllMedicalService implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  facilityTypeId: string;
  facilityId: string;
  facilityType: string;

  filters: ProductType[] = Object.values(ProductType);
  activeFilter: ProductType = this.filters[0];

  skip = 0;
  limit = 20;
  totalRecords = 0;
  hasMore = true;

  skeletons = [0, 1, 2];
  loading = false;
  products: MedicalProduct[] = [];

  constructor() {
    addIcons({ 'chevron-back-outline': chevronBackOutline });
  }

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.facilityTypeId = param['categoryId'];
      this.facilityId = param['facilityId'];
      this.facilityType = param['facilityType'];
    });
  }

  ionViewWillEnter() {
    this.skip = 0;
    this.hasMore = true;
    this.loadProducts();
  }

  loadProducts(infiniteEvent?: InfiniteScrollCustomEvent) {
    this.loading = this.skip === 0;
    this.api
      .getMedicalProducts({
        facilityTypeId: this.facilityTypeId,
        skip: this.skip,
        limit: this.limit,
        productType: this.activeFilter,
      })
      .subscribe({
        next: (res) => {
          const data = res.data ?? [];
          this.totalRecords = res.totalRecords ?? 0;
          this.products =
            this.skip === 0 ? data : [...this.products, ...data];
          this.hasMore = this.products.length < this.totalRecords;
          this.loading = false;
          infiniteEvent?.target.complete();
        },
        error: () => {
          this.loading = false;
          infiniteEvent?.target.complete();
        },
      });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.loadProducts(event);
  }

  setFilter(filter: ProductType) {
    this.activeFilter = filter;
    this.skip = 0;
    this.hasMore = true;
    this.loadProducts();
  }

  goBack() {
    this.router.navigate([
      'dashboard',
      'more',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
    ]);
  }

  addNew() {
    this.router.navigate([
      'dashboard',
      'more',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      'add-medical-service',
    ]);
  }
}
