import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCard } from './cost-card';

describe('CostCard', () => {
  let component: CostCard;
  let fixture: ComponentFixture<CostCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
