import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllCostLaboratory } from './list-all-cost-laboratory';

describe('ListAllCostLaboratory', () => {
  let component: ListAllCostLaboratory;
  let fixture: ComponentFixture<ListAllCostLaboratory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllCostLaboratory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllCostLaboratory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
