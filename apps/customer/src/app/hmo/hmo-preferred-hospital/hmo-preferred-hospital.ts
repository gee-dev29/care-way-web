import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { LimitSize } from '@healbridge/shared';
import { FormControl } from '@angular/forms';
import { ButtonComponent, InputDropDownComponent } from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonRadio,
  IonRadioGroup,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, optionsOutline } from 'ionicons/icons';

import {
  hospitalLocation,
  hospitalKey,
  HmoHospital,
  HmoJourneyService,
} from '@healbridge/shared';
type FilterType = 'State' | 'LGA' | 'Ward';

@Component({
  selector: 'app-hmo-preferred-hospital',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonRadio,
    IonRadioGroup,
    IonSearchbar,
    IonSkeletonText,
    ButtonComponent,
    InputDropDownComponent,
  ],
  templateUrl: './hmo-preferred-hospital.html',
  styleUrl: './hmo-preferred-hospital.css',
})
export class HmoPreferredHospital {
  private router = inject(Router);
  private api = inject(ApiService);
  private journey = inject(HmoJourneyService);

  hospitals: HmoHospital[] = [];
  filtered: HmoHospital[] = [];
  selected?: HmoHospital;
  loaded = false;
  failed = false;
  skeletons = ['', '', '', ''];
  term = '';
  filters: { state?: string; lga?: string; ward?: string } = {};
  filterOpen = false;
  draft: { state?: string; lga?: string; ward?: string } = {};
  options: Record<FilterType, string[]> = { State: [], LGA: [], Ward: [] };

  stateControl = new FormControl<string | null>(null);
  lgaControl = new FormControl<string | null>(null);
  wardControl = new FormControl<string | null>(null);
  hospitalControl = new FormControl<string | null>(null);
  hospitalOptions: { label?: string; value: string }[] = [];

  readonly location = hospitalLocation;

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
      'filter-icon': optionsOutline,
    });
  }

  get hmoId() {
    return this.journey.state.hmo?.hmoId as string;
  }

  ionViewWillEnter() {
    const stored = this.journey.state.selectedHospital;
    if (stored) this.selected = stored;
    this.load();
  }

  private load() {
    this.loaded = false;
    this.failed = false;
    this.syncControls();
    this.api
      .getHmoMedicalFacilityHospitals({
        hmoId: this.hmoId,
        skip: 0,
        limit: LimitSize.DropDown,
        ...this.filters,
      })
      .subscribe({
        next: (response) => {
          this.hospitals = response?.data ?? [];
          this.hospitalOptions = this.hospitals.map((hospital) => ({
            label: hospital.facilityName,
            value: hospitalKey(hospital),
          }));
          this.applySearch();
          this.loaded = true;
          this.syncControls();
        },
        error: () => {
          this.failed = true;
          this.loaded = true;
          this.syncControls();
        },
      });
  }

  search(event: CustomEvent) {
    this.term = String((event.target as HTMLIonSearchbarElement)?.value ?? '')
      .trim()
      .toLowerCase();
    this.applySearch();
  }

  private applySearch() {
    this.filtered = !this.term
      ? this.hospitals
      : this.hospitals.filter((hospital) =>
          [hospital.facilityName, hospital.state, hospital.lga]
            .filter(Boolean)
            .some((field) => field?.toLowerCase().includes(this.term))
        );
  }

  readonly key = hospitalKey;

  get selectedKey() {
    return this.selected ? hospitalKey(this.selected) : undefined;
  }

  select(hospital: HmoHospital) {
    this.selected = hospital;
  }

  selectByKey(key?: string | null) {
    if (!key) return;
    const match = this.hospitals.find(
      (hospital) => hospitalKey(hospital) === key
    );
    if (match) this.selected = match;
  }

  // --- filter ----------------------------------------------------------------

  showAll() {
    this.filterOpen = false;
    this.filters = {};
    this.draft = {};
    this.load();
  }

  openFilter() {
    if (this.filterOpen) return;
    this.filterOpen = true;
    this.draft = { ...this.filters };
    this.loadOptions('State');
    if (this.draft.state) this.loadOptions('LGA');
    if (this.draft.lga) this.loadOptions('Ward');
    this.syncControls();
  }

  private syncControls() {
    const sync = (
      control: FormControl<string | null>,
      value: string | undefined,
      enabled: boolean
    ) => {
      control.setValue(value ?? null, { emitEvent: false });
      if (enabled) control.enable({ emitEvent: false });
      else control.disable({ emitEvent: false });
    };
    sync(this.stateControl, this.draft.state, true);
    sync(this.lgaControl, this.draft.lga, !!this.draft.state);
    sync(this.wardControl, this.draft.ward, !!this.draft.lga);
    sync(
      this.hospitalControl,
      this.selectedKey,
      this.loaded && !this.failed && this.hospitals.length > 0
    );
  }

  get hospitalPlaceholder() {
    if (!this.loaded) return 'Loading hospitals...';
    if (this.failed) return "Couldn't load hospitals";
    return this.hospitals.length ? 'Select hospital' : 'No hospitals found';
  }

  private loadOptions(filterType: FilterType) {
    this.api
      .getMedicalFacilityHospitalGroupsByFilters({
        filterType,
        state: filterType === 'State' ? undefined : this.draft.state,
        lga: filterType === 'Ward' ? this.draft.lga : undefined,
      })
      .subscribe({
        next: (values) => (this.options[filterType] = values ?? []),
        error: () => (this.options[filterType] = []),
      });
  }

  choose(filterType: FilterType, picked?: string | null) {
    const value = picked ?? undefined;
    if (filterType === 'State') {
      if (value === this.draft.state) return;
      this.draft = { state: value };
      this.options.LGA = [];
      this.options.Ward = [];
      if (value) this.loadOptions('LGA');
    } else if (filterType === 'LGA') {
      if (value === this.draft.lga) return;
      this.draft = { state: this.draft.state, lga: value };
      this.options.Ward = [];
      if (value) this.loadOptions('Ward');
    } else {
      if (value === this.draft.ward) return;
      this.draft = { ...this.draft, ward: value };
    }
    this.filters = { ...this.draft };
    this.selected = undefined;
    this.load();
  }
  get canProceed() {
    return !!this.selected;
  }

  proceed() {
    if (!this.selected) return;
    this.journey.patch({ selectedHospital: this.selected });
    this.router.navigateByUrl('/dashboard/hmo-payment-summary');
  }

  back() {
    this.router.navigateByUrl('/dashboard/hmo-select-members');
  }
}
