import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIdentitiesListCard } from './dashboard-identities-list-card';

describe('DashboardIdentitiesListCard', () => {
  let component: DashboardIdentitiesListCard;
  let fixture: ComponentFixture<DashboardIdentitiesListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardIdentitiesListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardIdentitiesListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
