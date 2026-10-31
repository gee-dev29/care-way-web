import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { ButtonComponent, RiderSummaryCard } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'rider-rider-summary',
  imports: [IonContent, RiderSummaryCard, ButtonComponent],
  templateUrl: './rider-summary.html',
  styleUrl: './rider-summary.css',
})
export class RiderSummary implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  riderId: string;
  loading = false;
  profile: any;
  isProfile = false;
  license: any;
  isMobile = window.innerWidth < 768;

  @HostListener('window: resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  bank: any;

  ngOnInit(): void {
    if (this.router.url.includes('profile')) {
      this.isProfile = true;
    }
    this.activatedRoute.params.subscribe((params) => {
      this.riderId = params['riderId'];

      this.api.getUser({ userId: this.riderId }).subscribe((res: any) => {
        this.profile = res;
      });

      this.api
        .getPracticeLicenses({ referencedDocumentId: this.riderId })
        .subscribe((res: any) => {
          if (res.length > 0) {
            this.license = res[0];
          }
        });
      this.api
        .getBankAccount({
          referencedDocumentId: this.riderId,
        })
        .subscribe((res: any) => {
          this.bank = res.length > 0 ? res[0] : null;
        });
    });
  }
  back() {
    if (this.isProfile) {
      this.router.navigate(['/dashboard/more']);
    } else {
      this.router.navigate(['/dashboard/upload-rider-license', this.riderId]);
    }
  }
  proceed() {
    this.router.navigateByUrl('/dashboard/home');
  }
  edit(event: any) {
    if (event.bankAccountId) {
      this.router.navigate([
        '/dashboard/add-bank-rider',
        this.riderId,
        'edit',
        event.bankAccountId,
      ]);
    } else if(event === 'profile') {
      this.router.navigate([
        '/dashboard/personal-information',
        this.riderId,
      ]);
    } else {
      this.router.navigate([
        '/dashboard/add-rider-license',
        this.riderId,'edit'
      ]);
    }
  }
}
