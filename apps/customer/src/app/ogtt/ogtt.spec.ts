import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ogtt } from './ogtt';

describe('Ogtt', () => {
  let component: Ogtt;
  let fixture: ComponentFixture<Ogtt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ogtt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ogtt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
