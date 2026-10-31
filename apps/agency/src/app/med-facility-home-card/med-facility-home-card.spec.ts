import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedFacilityHomeCard } from './med-facility-home-card';

describe('MedFacilityHomeCard', () => {
  let component: MedFacilityHomeCard;
  let fixture: ComponentFixture<MedFacilityHomeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedFacilityHomeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedFacilityHomeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
