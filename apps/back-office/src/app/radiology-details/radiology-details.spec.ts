import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyDetails } from './radiology-details';

describe('RadiologyDetails', () => {
  let component: RadiologyDetails;
  let fixture: ComponentFixture<RadiologyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
