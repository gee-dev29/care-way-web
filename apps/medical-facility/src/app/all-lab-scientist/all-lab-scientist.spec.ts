import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLabScientist } from './all-lab-scientist';

describe('AllLabScientist', () => {
  let component: AllLabScientist;
  let fixture: ComponentFixture<AllLabScientist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLabScientist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLabScientist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
