import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTransaction } from './all-transaction';

describe('AllTransaction', () => {
  let component: AllTransaction;
  let fixture: ComponentFixture<AllTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
