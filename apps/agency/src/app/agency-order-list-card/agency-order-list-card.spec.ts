import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyOrderListCard } from './agency-order-list-card';

describe('AgencyOrderListCard', () => {
  let component: AgencyOrderListCard;
  let fixture: ComponentFixture<AgencyOrderListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyOrderListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyOrderListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
