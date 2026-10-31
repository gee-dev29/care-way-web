import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostOptionCard } from './cost-option-card';

describe('CostOptionCard', () => {
  let component: CostOptionCard;
  let fixture: ComponentFixture<CostOptionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostOptionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostOptionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
