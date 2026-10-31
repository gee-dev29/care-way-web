import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAvailableInvitation } from './doctor-available-invitation';

describe('DoctorAvailableInvitation', () => {
  let component: DoctorAvailableInvitation;
  let fixture: ComponentFixture<DoctorAvailableInvitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAvailableInvitation],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorAvailableInvitation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
