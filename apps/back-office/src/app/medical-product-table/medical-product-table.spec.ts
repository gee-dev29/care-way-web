import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProductTable } from './medical-product-table';

describe('MedicalProductTable', () => {
  let component: MedicalProductTable;
  let fixture: ComponentFixture<MedicalProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProductTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProductTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
