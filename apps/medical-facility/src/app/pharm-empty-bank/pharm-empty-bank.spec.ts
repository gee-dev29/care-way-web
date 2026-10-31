import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmEmptyBank } from './pharm-empty-bank';

describe('PharmEmptyBank', () => {
  let component: PharmEmptyBank;
  let fixture: ComponentFixture<PharmEmptyBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmEmptyBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmEmptyBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
