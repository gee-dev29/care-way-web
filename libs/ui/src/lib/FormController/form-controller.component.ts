import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-form-controller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-controller.component.html',
  styleUrls: ['./form-controller.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControllerComponent),
      multi: true,
    },
    CurrencyPipe,
  ],
})
export class FormControllerComponent implements ControlValueAccessor, OnInit {
  @Input() control: any = FormControl;
  @Input() type:
    | 'text'
    | 'check'
    | 'phone'
    | 'number'
    | 'email'
    | 'emailGrouped'
    | 'chips'
    | 'textarea'
    | 'switchbox'
    | 'checkbox'
    | 'otp'
    | 'dropdown'
    | 'password' = 'text';
  @Input() size: 'small' | 'large';
  @Input() displayType: 'chip' | '' = '';
  @Input() label = 'Name';
  @Input() binding: any;
  @Input() binary = true;
  @Input() shouldSearch = true;
  @Input() options: any;
  @Input() filter: boolean;
  @Input() date: Date;
  currencyPipe = inject(CurrencyPipe);
  @Input() suffix: string;
  @Input() currency: string;
  @Input() disabled: boolean;
  @Input() showClear: boolean;
  @Input() selectedItem: any = [];
  @Input() readOnly: boolean;
  @Input() prefix: string;
  @Input() key?: any;
  @Input() minFractionDigits?: any = 2;
  @Input() id: any;
  @Input() value?: any;
  @Input() placeholder?: any;
  @Input() title?: any;
  @Input() share?: string;
  @Input() max?: any;
  @Input() maxlength?: any;
  @Input() min?: number;
  @Input() mode?: any;
  @Input() showShare?: boolean;
  @Input() groupLabel?: string;
  @Input() multiselectOptions: any;
  @Input() isMultiselect: boolean;
  @Input() optionLabel?: any;
  @Input() optionValue?: any;
  @Input() disabledDates?: any;
  @Input() showTime?: any;
  @Input() disabledDays?: any;
  @Input() timeOnly?: any;
  @Input() selectionMode?: any = 'single';
  @Output() data = new EventEmitter();
  @Output() keyupData = new EventEmitter();
  @Output() tick = new EventEmitter();
  @Output() inputData = new EventEmitter();
  @Input() primaryDropdownDetail: string;
  @Input() field: string;
  @Output() autoCompleteSelect = new EventEmitter();
  @Output() completeMethodItem = new EventEmitter();
  @Input() suggestions: any;
  @Input() showCurrency = false;
  @Output() keyupdata = new EventEmitter();
  @Output() ionComplete = new EventEmitter();
  visibility = true;
  displayValue = '';

  ngOnInit(): void {
    setTimeout(() => {
      if (this.type == 'number') {
        this.displayValue = this.control.value.toString();
        const rawNumber =
          parseFloat(this.displayValue.replace(/[^0-9.-]+/g, '')) || 0;
        this.control.setValue(rawNumber, { emitEvent: false });
        this.displayValue =
          this.currencyPipe.transform(rawNumber, ' ', 'symbol', '1.0-2') || '';
        this.keyupdata.emit(event);

        this.control.valueChanges.subscribe((value: number) => {
          this.displayValue =
            this.currencyPipe.transform(value, ' ', 'symbol', '1.0-2') || '';
        });
      }
    }, 500);
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  onInput(event: any) {
    const input = event.target.value;
    const rawNumber = parseFloat(input.replace(/[^0-9.-]+/g, '')) || 0;
    this.control.setValue(rawNumber, { emitEvent: false });
    this.displayValue =
      this.currencyPipe.transform(rawNumber, ' ', 'symbol', '1.0-2') || '';
    this.keyupdata.emit(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerOnChange(value: string): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerOnTouched(fn: any): void {}

  constructor() {
    this.control = new FormControl();
  }

  getDropdownData(event: any, label: any) {
    this.data.emit({ ...event, label: label });
  }

  getValue(event: any) {
    this.keyupData.emit(event.target.value);
  }

  getInput(event: any) {
    this.inputData.emit(event);
  }

  getSelectedAutocompleteItem(event: any) {
    this.autoCompleteSelect.emit(event);
  }

  filterAutocompleItems(event: AutoCompleteCompleteEvent) {
    this.completeMethodItem.emit(event);
  }
}
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
