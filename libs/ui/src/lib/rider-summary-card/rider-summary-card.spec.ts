import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderSummaryCard } from './rider-summary-card';

describe('RiderSummaryCard', () => {
  let component: RiderSummaryCard;
  let fixture: ComponentFixture<RiderSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
