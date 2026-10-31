import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOxygenSaturation } from './list-oxygen-saturation';

describe('ListOxygenSaturation', () => {
  let component: ListOxygenSaturation;
  let fixture: ComponentFixture<ListOxygenSaturation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOxygenSaturation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOxygenSaturation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
