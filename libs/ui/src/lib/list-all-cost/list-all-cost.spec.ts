import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllCost } from './list-all-cost';

describe('ListAllCost', () => {
  let component: ListAllCost;
  let fixture: ComponentFixture<ListAllCost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllCost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllCost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
