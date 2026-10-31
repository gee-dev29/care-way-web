import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsDetailsCard } from './ads-details-card';

describe('AdsDetailsCard', () => {
  let component: AdsDetailsCard;
  let fixture: ComponentFixture<AdsDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
