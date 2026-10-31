import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRecentOrders } from './view-all-recent-orders';

describe('ViewAllRecentOrders', () => {
  let component: ViewAllRecentOrders;
  let fixture: ComponentFixture<ViewAllRecentOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllRecentOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllRecentOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
