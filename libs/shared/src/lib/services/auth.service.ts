import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ProfileInfoService } from './profile-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentAuthSubject: BehaviorSubject<any>;
  public currentAuth: Observable<any>;
  public profileInfoService = inject(ProfileInfoService);
  private router = inject(Router);

  constructor() {
    const auth = localStorage.getItem('auth') ?? '{}';
    this.currentAuthSubject = new BehaviorSubject<string>(auth);
    this.currentAuth = this.currentAuthSubject.asObservable();

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'auth') {
        const auth = localStorage.getItem('auth');
        if (auth == null) {
          this.currentAuthSubject.next({});
        } else {
          this.currentAuthSubject.next(auth);
        }
      }
    });
  }

  saveAuthentication(auth: string): boolean {
    localStorage.setItem('auth', auth);
    this.currentAuthSubject.next(auth);
    return true;
  }

  public get currentAuthValue(): string {
    if (this.currentAuthSubject.value !== '{}') {
      const auth: Auth = jwtDecode(this.currentAuthSubject.value);
      if (moment().utc().isAfter(moment.unix(auth.exp))) {
        this.logout();
      }
    }
    return this.currentAuthSubject.value;
  }

  public get countryId(): string {
    const variable = localStorage.getItem('countryId') as string;
    const companyId = JSON.parse(variable) ?? '';
    return companyId;
  }

  getUserId(): string {
    if (this.currentAuthSubject.value !== '{}') {
      const auth: Auth = jwtDecode(this.currentAuthSubject.value);
      return auth.jti;
    }
    return '';
  }

  isUserLoggedIn(): boolean {
    if (this.currentAuthValue !== '{}') {
      return true;
    }
    return false;
  }

  getToken() {
    return this.isUserLoggedIn() ? this.currentAuthSubject.value : '';
  }

  logout() {
    localStorage.removeItem('auth');
    this.currentAuthSubject.next('{}');
    this.router.navigateByUrl('/login');
    this.profileInfoService.name = '';
    this.profileInfoService.picture = '';
    this.profileInfoService.loggedInName = '';
    this.profileInfoService.loggedInEmail = '';
    this.profileInfoService.loggedInPicture = '';
  }

  userDetail(api: any, callback?: (auth: Auth | null) => void) {
    if (this.currentAuthSubject.value !== '{}') {
      const auth: Auth = jwtDecode(this.currentAuthSubject.value);
      if (
        auth.userType === 'Pharmacist' ||
        auth.userType === 'Pharmacy Staff' ||
        auth.userType === 'Blood Bank Staff' ||
        auth.userType === 'Laboratory Staff' ||
        auth.userType === 'Radiology Staff'
      ) {
        api
          .getMedicalProfessional({
            professionalId: auth?.userTypeId as any,
            professionalType: auth?.userType as any,
          })
          .subscribe((response: any) => {
            auth.userTypeId = response.facilityId;
            callback?.(auth);
          });
      } else {
        callback?.(auth);
      }
    } else {
      callback?.(null);
    }
  }

  getUserType() {
    if (this.currentAuthSubject.value !== '{}') {
      const auth: Auth = jwtDecode(this.currentAuthSubject.value);
      return auth.userType;
    }
    return;
  }
}

interface Auth {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  sessionId: string;
  userTypeId: string;
  userType: string;
  acl: [];
}

export interface AuthToken {
  expiry: string;
  token: string;
}
