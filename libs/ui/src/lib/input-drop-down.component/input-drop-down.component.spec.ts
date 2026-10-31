import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropDownComponent } from './input-drop-down.component';

describe('InputDropDownComponent', () => {
  let component: InputDropDownComponent;
  let fixture: ComponentFixture<InputDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDropDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
