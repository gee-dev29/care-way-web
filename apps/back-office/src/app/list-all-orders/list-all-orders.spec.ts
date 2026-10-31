import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllOrders } from './list-all-orders';

describe('ListAllOrders', () => {
  let component: ListAllOrders;
  let fixture: ComponentFixture<ListAllOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
