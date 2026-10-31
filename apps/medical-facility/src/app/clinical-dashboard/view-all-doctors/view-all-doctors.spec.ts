import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllDoctors } from './view-all-doctors';

describe('ViewAllDoctors', () => {
  let component: ViewAllDoctors;
  let fixture: ComponentFixture<ViewAllDoctors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllDoctors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllDoctors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
