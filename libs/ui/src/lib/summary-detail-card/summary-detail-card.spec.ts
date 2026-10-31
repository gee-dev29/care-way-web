import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDetailCard } from './summary-detail-card';

describe('SummaryDetailCard', () => {
  let component: SummaryDetailCard;
  let fixture: ComponentFixture<SummaryDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryDetailCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryDetailCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
