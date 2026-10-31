import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { ApiService } from '@healbridge/api';
import { FacilityType, ToastService } from '@healbridge/shared';
import { Address, DesktopButton, DesktopInput, FormBody } from '@healbridge/ui';
import { v4 } from 'uuid';

@Component({
  selector: 'shared-add-address',
  imports: [
    DesktopButton,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FormBody,
    DesktopInput,
  ],
  templateUrl: './add-address.html',
  styleUrl: './add-address.css',
})
export class AddAddress implements OnInit {
  private formBuilder = inject(FormBuilder);
  // private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastService);
  private addressService = inject(Address);
  facilityId: string;
  facilityTypeId: string;
  // hospitalId: string;
  loading = false;
  label = 'Continue';
  form: FormGroup;
  fullAddress: any;
  // addressId = new FormControl(v4(), Validators.required);
  address = new FormControl('', Validators.required);
  // referencedDocumentId = new FormControl('', Validators.required);
  suggestions: any[] = [];
  @Output() saved = new EventEmitter<{ id: string; type: string }>();
  @Output() cancelled = new EventEmitter<void>();
  private placesLibrary!: google.maps.PlacesLibrary;
  private sessionToken!: google.maps.places.AutocompleteSessionToken;
  apiKey = 'AIzaSyASNg9R0dQNJPm8imzlJQVoM4Ug5fy-Nzo';
  reach = false;
  @Input() referencedDocumentId: string;
  @Input() facilityType: any;
  @Input() hospitalId: string;
  @Input() api: any;

  constructor() {
    //
  }

  async ngOnInit() {
    this.form = this.formBuilder.group({
      // addressId: this.addressId,
      address: this.address,
      referencedDocumentId: this.referencedDocumentId,
    });
    // this.activatedRoute.params.subscribe((params: any) => {
    //   this.facilityId = params.facilityId;
    //   this.hospitalId =
    //     params.hospitalId ??
    //     params.professionalId ??
    //     params.laboratoryId ??
    //     params.bloodBankId;
    //   this.form.patchValue({
    //     referencedDocumentId: this.facilityId,
    //   });
    //   if (this.addressId) {
    //     this.api.getAddresses({
    //       referencedDocumentId: this.facilityId,
    //     });
    //   }
    // });
    setOptions({ key: this.apiKey, v: 'beta', libraries: ['places'] });
    try {
      this.placesLibrary = (await importLibrary(
        'places'
      )) as google.maps.PlacesLibrary;
      this.sessionToken = new this.placesLibrary.AutocompleteSessionToken();
    } catch (error) {
      console.error('Failed to load Google Places library', error);
    }
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

  next() {
    this.api
      .addFacilityTypeAddresses({
        facilityTypeId: this.hospitalId,
        facilityType: this.facilityType,
        // referencedDocumentId: this.referencedDocumentId,
        body: {
          addressId: v4(),
          referencedDocumentId: this.referencedDocumentId,
          ...this.fullAddress,
        },
        // body: this.form.value,
      })
      .subscribe(() => {
        // this.router.navigateByUrl(this.onSaveRoute);
        this.saved.emit({ id: this.hospitalId, type: this.facilityType });
      });
  }
  cancel() {
    this.cancelled.emit();
  }
}
