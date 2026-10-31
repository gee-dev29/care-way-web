import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenBookDrugs } from './green-book-drugs';

describe('GreenBookDrugs', () => {
  let component: GreenBookDrugs;
  let fixture: ComponentFixture<GreenBookDrugs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenBookDrugs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenBookDrugs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
