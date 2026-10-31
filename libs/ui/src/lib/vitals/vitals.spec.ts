import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vitals } from './vitals';

describe('Vitals', () => {
  let component: Vitals;
  let fixture: ComponentFixture<Vitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
