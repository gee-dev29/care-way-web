import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedListBank } from './shared-list-bank';

describe('SharedListBank', () => {
  let component: SharedListBank;
  let fixture: ComponentFixture<SharedListBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedListBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedListBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
