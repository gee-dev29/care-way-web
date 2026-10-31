import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTemperature } from './list-temperature';

describe('ListTemperature', () => {
  let component: ListTemperature;
  let fixture: ComponentFixture<ListTemperature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTemperature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTemperature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
