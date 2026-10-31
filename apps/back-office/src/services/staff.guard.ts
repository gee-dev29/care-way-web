import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NonProfessionalUserType } from '@healbridge/api';
import { AuthService, DisplayLayout, PageLayout } from '@healbridge/shared';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class StaffGuard {
  private auth = inject(AuthService);
  private router = inject(Router);
  toastr = inject(ToastrService);
  displayLayout = inject(DisplayLayout);

  canActivate(): boolean {
    if (this.auth.getUserType() !== NonProfessionalUserType.Staff) {
      this.toastr.error(
        'Access Denied: These credentials are not for a staff account. Please use your staff credentials.'
      );
      this.displayLayout.setLayout(PageLayout.Default);
      this.router.navigateByUrl('/login');
      return true;
    }
    return true;
  }
}
