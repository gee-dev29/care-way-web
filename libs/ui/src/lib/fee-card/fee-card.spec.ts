import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCard } from './fee-card';

describe('FeeCard', () => {
  let component: FeeCard;
  let fixture: ComponentFixture<FeeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
