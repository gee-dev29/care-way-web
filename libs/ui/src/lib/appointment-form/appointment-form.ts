import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  chevronBackOutline,
  ellipseOutline,
  locationOutline,
} from 'ionicons/icons';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonIcon,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { InputTextarea } from '../input-textarea/input-textarea';
import { InputComponent } from '../input/input';
import { DatePicker } from "../date-picker/date-picker";
import { TimePicker } from "../time-picker/time-picker";

@Component({
  selector: 'ui-appointment-form',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    InputTextarea,
    IonIcon,
    DatePicker,
    TimePicker
],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  @Input() title = '';
  @Input() date = '';
  @Input() time = '';
  @Input() noteLabel = '';
  @Input() note = '';
  @Input() buttonLabel = '';
  @Input() doctors: any[] = [];
  @Input() showSpecialization = true;
  @Input() showAddress = true;
  isClicked = false;
  checkBox = false;
  form: FormGroup;
  today: string;
  tenYearsAhead: string;

  @Output() dateChange = new EventEmitter<any>();
  @Output() noteChange = new EventEmitter<any>();
  @Output() timeChange = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();
  @Output() proceed = new EventEmitter<void>();
  newDate = new FormControl(this.date, [Validators.required]);
  newTime = new FormControl(this.time, [Validators.required]);
  newSpecialization = new FormControl(
    '',
    this.showSpecialization ? [Validators.required] : []
  );
  newNote = new FormControl(this.note, [Validators.required]);

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
      ellipseOutline,
      locationOutline,
      checkmarkCircle,
    });
    const now = new Date();

    this.today = now.toISOString().split('T')[0];
    const future = new Date();
    future.setFullYear(future.getFullYear() + 10);
    this.tenYearsAhead = future.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      newDate: this.newDate,
      newTime: this.newTime,
      newSpecialization: this.newSpecialization,
      newNote: this.newNote,
    });
  }

  onNoteInput(event: any) {
    this.noteChange.emit(event.target?.value || event.detail?.value);
  }
  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.form.patchValue({ newDate: selectedDate });
    this.dateChange.emit(selectedDate);
  }
  onTimeChange(event: any) {
    const selectedTime = event.detail.value;
    this.form.patchValue({ newTime: selectedTime });
    this.timeChange.emit(selectedTime);
  }

  isSpecializationClicked() {
    this.isClicked = true;
  }
  offSpecializationClicked() {
    this.isClicked = false;
  }

  checked() {
    this.checkBox = !this.checkBox;
  }
}
