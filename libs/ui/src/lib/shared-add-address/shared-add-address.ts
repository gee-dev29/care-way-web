/// <reference types="@types/google.maps" />
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonContent,
  IonText,
  IonToolbar,
  IonIcon,
} from '@ionic/angular/standalone';
import { pipe, switchMap } from 'rxjs';
import { addIcons } from 'ionicons';
import { location } from 'ionicons/icons';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { InputComponent } from '../input/input';
import { Address } from '../address';
import { v4 } from 'uuid';

@Component({
  selector: 'ui-shared-add-address',
  imports: [
    IonHeader,
    IonToolbar,
    IonText,
    InputComponent,
    IonContent,
    IonIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './shared-add-address.html',
  styleUrl: './shared-add-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedAddAddress implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  @Input() route: string;
  @Input() api: any;
  @Input() backRoute: string;
  edit = '';
  form: FormGroup;
  fullAddress: any;
  address = new FormControl('', Validators.required);
  private placesLibrary!: google.maps.PlacesLibrary;
  private sessionToken!: google.maps.places.AutocompleteSessionToken;
  suggestions: any[] = [];
  @Input() apiKey: any;
  private activatedRoute = inject(ActivatedRoute);
  facilityId: string;
  pharmacyId: string;
  addressId = v4();
  didFacilityMissOnboarding = false;
  referencedDocumentId: string;
  reach = false;
  private addressService = inject(Address);

  constructor() {
    addIcons({ location });
  }

  async ngOnInit() {
    this.form = this.fb.group({
      address: this.address,
    });
    setOptions({ key: this.apiKey, v: 'beta', libraries: ['places'] });
    try {
      this.placesLibrary = (await importLibrary(
        'places'
      )) as google.maps.PlacesLibrary;
      this.sessionToken = new this.placesLibrary.AutocompleteSessionToken();
    } catch (error) {
      console.error('Failed to load Google Places library', error);
    }
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.referencedDocumentId = this.facilityId;
      this.pharmacyId =
        params.pharmacyId ??
        params.bloodBankId ??
        params.radiologyId ??
        params.laboratoryId ??
        params.hospitalId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.api
          .getAddresses({
            referencedDocumentId: this.referencedDocumentId,
          })
          .subscribe((response: any) => {
            response.forEach((address: any) => {
              if (address.googlePlaceId == params.addressId) {
                this.fullAddress = address;
                this.form.patchValue({
                  address: address.address,
                });
              }
            });
          });
      }
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.error) {
        this.didFacilityMissOnboarding = true;
      }
    });
  }

  async onSearchChange(query: any) {
    if (!query || query.length > 1) {
      try {
        const request: google.maps.places.AutocompleteRequest = {
          input: query,
          sessionToken: this.sessionToken,
          region: 'NG',
        };

        const { suggestions } =
          await this.placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request
          );

        this.reach = true;
        this.suggestions = suggestions;
      } catch (error) {
        console.error('Autocomplete failed:', error);
        this.suggestions = [];
      }
    }
  }

  async selectPlace(item: any) {
    const { Place } = (await google.maps.importLibrary(
      'places'
    )) as google.maps.PlacesLibrary;

    // 2️⃣ Search for the place using the prediction text
    const searchResult: any = await Place.searchByText({
      textQuery: item?.placePrediction?.text?.text,
      fields: [
        'id',
        'displayName',
        'formattedAddress',
        'location',
        'addressComponents',
      ],
    });
    const place = searchResult.places?.[0];

    const addressComponents = place?.addressComponents;

    if (addressComponents) {
      this.reach = false;
      const mappedAddress = this.mapAddressComponents(addressComponents);
      this.form.patchValue({ address: item?.placePrediction?.text?.text });
      this.suggestions = [];
      this.sessionToken = new this.placesLibrary.AutocompleteSessionToken();
      this.reach = false;
      this.fullAddress = {
        ...mappedAddress,
        googlePlaceId: item.placePrediction.placeId,
      };
    }
  }

  mapAddressComponents(components: any[]) {
    const get = (type: string) =>
      components.find((c) => c.types.includes(type))?.longText || '';

    return {
      address: `${get('street_number')} ${get('route')}`.trim(),
      city: get('locality') || get('administrative_area_level_2'), // Fallback for city
      state: get('administrative_area_level_1'),
      street: get('route'),
      streetNumber: get('street_number'),
      country: get('country'),
      postCode: get('postal_code'),
    };
  }

  cancel() {
    this.router.navigateByUrl(this.backRoute);
  }

  save() {
    const addressId = v4();
    const facilityType = JSON.parse(
      localStorage.getItem('facilityType') ?? 'null'
    );

    const addressPayload = {
      referencedDocumentId: this.referencedDocumentId,
      body: {
        addressId,
        referencedDocumentId: this.referencedDocumentId,
        ...this.fullAddress,
      },
    };

    const facilityAddressPayload: any = {
      facilityTypeId: this.pharmacyId,
      facilityType,
      body: { addressId },
    };

    if (this.edit?.length) {
      this.api
        .addAddress(addressPayload)
        .pipe(
          switchMap(() =>
            this.api.addFacilityTypeAddress(facilityAddressPayload)
          )
        )
        .subscribe({
          next: () => {
            this.router.navigateByUrl(this.route);
            this.resetForm();
          },
          error: (error: any) => {
            console.error('Failed to save address', error);
          },
        });
    } else { 
      this.api.addAddress(addressPayload).subscribe({
        next: () => {
          const facilityType = JSON.parse(
            localStorage.getItem('facilityType') as any
          );
          const facilityTypeId = JSON.parse(
            localStorage.getItem('facilityTypeId') as any
          );
          if (this.didFacilityMissOnboarding) {
            this.api
              .addFacilityTypeAddress({
                facilityTypeId: facilityTypeId,
                facilityType: facilityType,
                body: { addressId: addressId },
              })
              .subscribe(() => {
                this.router.navigateByUrl('/dashboard/home');
              });
          } else {
            this.router.navigateByUrl(this.route);
          }
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Failed to save address', error);
        },
      });
    }
  }

  resetForm(): void {
    this.form.reset();
  }

  async useCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const place = results[0];

            const mappedAddress = this.mapAddressComponents(
              place.address_components.map((c: any) => ({
                types: c.types,
                longText: c.long_name,
              }))
            );

            this.form.patchValue({
              address: place.formatted_address,
            });

            this.fullAddress = {
              ...mappedAddress,
              ...this.form.value,
              googlePlaceId: place.place_id,
            };

            this.suggestions = [];
          }
        }
      );
    });
  }
}
