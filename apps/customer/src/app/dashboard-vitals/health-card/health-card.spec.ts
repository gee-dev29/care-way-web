import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCard } from './health-card';

describe('HealthCard', () => {
  let component: HealthCard;
  let fixture: ComponentFixture<HealthCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
