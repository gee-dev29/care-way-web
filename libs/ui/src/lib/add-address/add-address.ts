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
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { location } from 'ionicons/icons';
import { GoogleMap } from '@capacitor/google-maps';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { InputComponent } from '../input/input';
import { v4 } from 'uuid';
import { ToastService } from '../toast';
import { Address } from '../address';
@Component({
  selector: 'ui-add-address',
  imports: [
    IonHeader,
    IonToolbar,
    IonText,
    InputComponent,
    IonContent,
    IonIcon,
    IonList,
    IonItem,
    ReactiveFormsModule,
  ],
  templateUrl: './add-address.html',
  styleUrl: './add-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAddress implements OnInit {
  @Input() onSaveRoute: string;
  @Input() onCancelRoute: string;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastService);
  private addressService = inject(Address);
  form: FormGroup;
  fullAddress: any;
  public activatedRoute = inject(ActivatedRoute);
  address = new FormControl('', Validators.required);
  private placesLibrary!: google.maps.PlacesLibrary;
  private sessionToken!: google.maps.places.AutocompleteSessionToken;
  suggestions: any[] = [];
  facilityTypeId: string;
  facilityType: string;
  professionalSendCost: any;
  whoGoes: any;
  showAddressInput = true;
  @Input() apiKey: any;
  @Input() referencedDocumentId: string;
  @Input() api: any;
  @Input() serviceRequest: any;
  reach = false;

  constructor() {
    addIcons({ location });
  }

  async ngOnInit() {
    this.address.reset();
    this.fullAddress = null;
    this.suggestions = [];
    this.reach = false;
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
      if (params.facilityTypeId) {
        this.facilityTypeId = params.facilityTypeId;
        this.facilityType = params.facilityType;
        if (params.professionalSendCost) {
          this.professionalSendCost = params.professionalSendCost;
          this.whoGoes = params.whoGoes;
        }
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

  clearAddress() {
    this.address.setValue('', { emitEvent: false });
    this.form.get('address')?.setValue('', { emitEvent: false });

    this.fullAddress = null;
    this.suggestions = [];
    this.reach = false;

    this.showAddressInput = false;

    setTimeout(() => {
      this.showAddressInput = true;
    });
  }

  mapAddressComponents(components: any[]) {
    const get = (type: string) =>
      components.find((c) => c.types.includes(type))?.longText || '';

    return {
      address: `${get('street_number')} ${get('route')}`.trim(),
      city: get('locality') || get('administrative_area_level_2'),
      state: get('administrative_area_level_1'),
      street: get('route'),
      streetNumber: get('street_number'),
      country: get('country'),
      postCode: get('postal_code'),
    };
  }

  cancel() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  save() {
    const newAddressId = v4();
    this.api
      .addAddress({
        referencedDocumentId: this.referencedDocumentId,
        body: {
          addressId: newAddressId,
          referencedDocumentId: this.referencedDocumentId,
          ...this.fullAddress,
        },
      })
      .subscribe(() => {
        if (this.professionalSendCost && this.whoGoes != 'Patient') {
          this.api
            .getFacilityTypeAddresses({
              facilityType: this.facilityType,
              facilityTypeId: this.facilityTypeId,
            } as any)
            .subscribe({
              next: (response: any) => {
                const addressId: any = [];
                response.forEach((address: any, index: any) => {
                  addressId.push(address.addressId);
                });
                addressId.push(newAddressId);
                this.api
                  .addFacilityTypeAddresses({
                    facilityTypeId: this.facilityTypeId,
                    facilityType: this.facilityType,
                    body: { addressId },
                  })
                  .subscribe({
                    next: () => {
                      Object.keys(this.form.controls).forEach((key) => {
                        this.form.get(key)?.setValue('');
                      });

                      this.clearAddress();
                      this.router.navigateByUrl(
                        this.onSaveRoute || this.onCancelRoute
                      );
                    },
                    error: () => {
                      //
                    },
                  });
              },
              error: (err: any) => {
                //
              },
            });
        } else {
          this.address.reset();
          this.fullAddress = null;
          this.suggestions = [];
          this.reach = false;
          this.router.navigateByUrl(this.onSaveRoute || this.onCancelRoute);
        }
      });
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
