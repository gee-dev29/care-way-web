import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileInfoService {
  name = '';
  picture = '';
  email = '';
  loggedInName = '';
  loggedInPicture = '';
  loggedInEmail = '';
}
