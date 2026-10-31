import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHospitalDetails } from './add-hospital-details';

describe('AddHospitalDetails', () => {
  let component: AddHospitalDetails;
  let fixture: ComponentFixture<AddHospitalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHospitalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHospitalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
