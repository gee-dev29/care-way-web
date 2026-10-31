import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Referral } from './referral';

describe('Referral', () => {
  let component: Referral;
  let fixture: ComponentFixture<Referral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Referral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Referral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
