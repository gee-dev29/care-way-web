import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoPurchasedDetails } from './hmo-purchased-details';

describe('HmoPurchasedDetails', () => {
  let component: HmoPurchasedDetails;
  let fixture: ComponentFixture<HmoPurchasedDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoPurchasedDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoPurchasedDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
