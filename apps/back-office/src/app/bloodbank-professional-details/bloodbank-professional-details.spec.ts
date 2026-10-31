import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodbankProfessionalDetails } from './bloodbank-professional-details';

describe('BloodbankProfessionalDetails', () => {
  let component: BloodbankProfessionalDetails;
  let fixture: ComponentFixture<BloodbankProfessionalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodbankProfessionalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodbankProfessionalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
