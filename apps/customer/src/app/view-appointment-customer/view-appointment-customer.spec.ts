import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentCustomer } from './view-appointment-customer';

describe('ViewAppointmentCustomer', () => {
  let component: ViewAppointmentCustomer;
  let fixture: ComponentFixture<ViewAppointmentCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointmentCustomer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentCustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
