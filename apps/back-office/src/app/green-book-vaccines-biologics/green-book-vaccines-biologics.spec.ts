import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenBookVaccinesBiologics } from './green-book-vaccines-biologics';

describe('GreenBookVaccinesBiologics', () => {
  let component: GreenBookVaccinesBiologics;
  let fixture: ComponentFixture<GreenBookVaccinesBiologics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenBookVaccinesBiologics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenBookVaccinesBiologics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
