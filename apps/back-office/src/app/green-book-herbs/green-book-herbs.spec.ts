import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenBookHerbs } from './green-book-herbs';

describe('GreenBookHerbs', () => {
  let component: GreenBookHerbs;
  let fixture: ComponentFixture<GreenBookHerbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenBookHerbs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenBookHerbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
