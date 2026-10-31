import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllDoctors } from './list-all-doctors';

describe('ListAllDoctors', () => {
  let component: ListAllDoctors;
  let fixture: ComponentFixture<ListAllDoctors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllDoctors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllDoctors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
