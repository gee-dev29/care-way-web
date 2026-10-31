import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slide1 } from './slide1';

describe('Slide1', () => {
  let component: Slide1;
  let fixture: ComponentFixture<Slide1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slide1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Slide1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
