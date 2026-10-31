import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGlucose } from './list-glucose';

describe('ListGlucose', () => {
  let component: ListGlucose;
  let fixture: ComponentFixture<ListGlucose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGlucose]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGlucose);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
