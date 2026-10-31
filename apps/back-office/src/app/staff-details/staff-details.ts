import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { user } from '@angular/fire/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { PageBody, Tab, StaffDetailsCard } from '@care-way/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-staff-details',
  imports: [PageBody, CommonModule, Tab, StaffDetailsCard],
  templateUrl: './staff-details.html',
  styleUrl: './staff-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StaffDetails implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);
  activeTab = 0;
  totalRecords: number;
  staffDetails$: Observable<any>;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.getStaff(params.userId);
    });
  }

  getStaff(userId: string) {
    this.staffDetails$ = this.api.getUser({ userId: userId });
  }
  back() {
    this.router.navigate(['list-all-staffs']);
  }
}
