import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmAddBank } from './pharm-add-bank';

describe('PharmAddBank', () => {
  let component: PharmAddBank;
  let fixture: ComponentFixture<PharmAddBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmAddBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmAddBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
