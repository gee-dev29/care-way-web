import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmListBank } from './pharm-list-bank';

describe('PharmListBank', () => {
  let component: PharmListBank;
  let fixture: ComponentFixture<PharmListBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmListBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmListBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
