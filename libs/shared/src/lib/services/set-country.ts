import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetCountry {
  setDefaultCountry(apiService: any): Observable<any> {
    return apiService.getAllCountries().pipe(
      map((response: any) => {
        const defaultCountry = response.find(
          (country: any) => country.isDefault === true
        );

        if (defaultCountry?.countryId) {
          localStorage.setItem(
            'countryId',
            JSON.stringify(defaultCountry.countryId)
          );
        }

        return defaultCountry;
      })
    );
  }
}
