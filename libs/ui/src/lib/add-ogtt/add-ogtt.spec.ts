import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOgtt } from './add-ogtt';

describe('AddOgtt', () => {
  let component: AddOgtt;
  let fixture: ComponentFixture<AddOgtt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOgtt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOgtt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
