import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentType } from './add-appointment-type';

describe('AddAppointmentType', () => {
  let component: AddAppointmentType;
  let fixture: ComponentFixture<AddAppointmentType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAppointmentType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppointmentType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
