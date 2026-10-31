import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorViewInvite } from './doctor-view-invite';

describe('DoctorViewInvite', () => {
  let component: DoctorViewInvite;
  let fixture: ComponentFixture<DoctorViewInvite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorViewInvite],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorViewInvite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
