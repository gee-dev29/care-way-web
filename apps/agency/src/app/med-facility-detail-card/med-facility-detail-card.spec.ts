import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedFacilityDetailCard } from './med-facility-detail-card';

describe('MedFacilityDetailCard', () => {
  let component: MedFacilityDetailCard;
  let fixture: ComponentFixture<MedFacilityDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedFacilityDetailCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedFacilityDetailCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
