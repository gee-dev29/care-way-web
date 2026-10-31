import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistDetails } from './pharmacist-details';

describe('PharmacistDetails', () => {
  let component: PharmacistDetails;
  let fixture: ComponentFixture<PharmacistDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacistDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
