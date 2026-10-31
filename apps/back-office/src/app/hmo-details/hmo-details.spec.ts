import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoDetails } from './hmo-details';

describe('HmoDetails', () => {
  let component: HmoDetails;
  let fixture: ComponentFixture<HmoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
