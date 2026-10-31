import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPharmacyDetails } from './add-pharmacy-details';

describe('AddPharmacyDetails', () => {
  let component: AddPharmacyDetails;
  let fixture: ComponentFixture<AddPharmacyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPharmacyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPharmacyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
