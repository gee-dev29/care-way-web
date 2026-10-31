import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllCostBloodBank } from './list-all-cost-blood-bank';

describe('ListAllCostBloodBank', () => {
  let component: ListAllCostBloodBank;
  let fixture: ComponentFixture<ListAllCostBloodBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllCostBloodBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllCostBloodBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
