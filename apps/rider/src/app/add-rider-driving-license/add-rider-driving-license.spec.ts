import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiderDrivingLicense } from './add-rider-driving-license';

describe('AddRiderDrivingLicense', () => {
  let component: AddRiderDrivingLicense;
  let fixture: ComponentFixture<AddRiderDrivingLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRiderDrivingLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRiderDrivingLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
