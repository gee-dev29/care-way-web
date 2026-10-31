import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoDetailsCard } from './hmo-details-card';

describe('HmoDetailsCard', () => {
  let component: HmoDetailsCard;
  let fixture: ComponentFixture<HmoDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
