import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAddress } from './select-address';

describe('SelectAddress', () => {
  let component: SelectAddress;
  let fixture: ComponentFixture<SelectAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
