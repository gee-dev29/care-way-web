import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllCostRadiology } from './list-all-cost-radiology';

describe('ListAllCostRadiology', () => {
  let component: ListAllCostRadiology;
  let fixture: ComponentFixture<ListAllCostRadiology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllCostRadiology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllCostRadiology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
