import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hospitals } from './hospitals';

describe('Hospitals', () => {
  let component: Hospitals;
  let fixture: ComponentFixture<Hospitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hospitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hospitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
