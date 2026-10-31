import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaOrder } from './msa-order';

describe('MsaOrder', () => {
  let component: MsaOrder;
  let fixture: ComponentFixture<MsaOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
