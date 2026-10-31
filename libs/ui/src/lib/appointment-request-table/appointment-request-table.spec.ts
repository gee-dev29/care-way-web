import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRequestTable } from './appointment-request-table';

describe('AppointmentRequestTable', () => {
  let component: AppointmentRequestTable;
  let fixture: ComponentFixture<AppointmentRequestTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRequestTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRequestTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
