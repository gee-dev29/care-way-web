import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeListCard } from './fee-list-card';

describe('FeeListCard', () => {
  let component: FeeListCard;
  let fixture: ComponentFixture<FeeListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
