import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderDetailsCard } from './rider-details-card';

describe('RiderDetailsCard', () => {
  let component: RiderDetailsCard;
  let fixture: ComponentFixture<RiderDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
