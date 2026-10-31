import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoProductTable } from './hmo-product-table';

describe('HmoProductTable', () => {
  let component: HmoProductTable;
  let fixture: ComponentFixture<HmoProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoProductTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoProductTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
