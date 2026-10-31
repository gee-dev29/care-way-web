import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistFollowUp } from './pharmacist-follow-up';

describe('PharmacistFollowUp', () => {
  let component: PharmacistFollowUp;
  let fixture: ComponentFixture<PharmacistFollowUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistFollowUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacistFollowUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
