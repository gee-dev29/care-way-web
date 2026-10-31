import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyDetails } from './pharmacy-details';

describe('PharmacyDetails', () => {
  let component: PharmacyDetails;
  let fixture: ComponentFixture<PharmacyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
