import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllProfessionalAppointmentRequests } from './list-all-professional-appointment-requests';

describe('ListAllProfessionalAppointmentRequests', () => {
  let component: ListAllProfessionalAppointmentRequests;
  let fixture: ComponentFixture<ListAllProfessionalAppointmentRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllProfessionalAppointmentRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllProfessionalAppointmentRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
