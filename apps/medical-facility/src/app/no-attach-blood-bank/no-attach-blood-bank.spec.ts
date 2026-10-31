import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAttachBloodBank } from './no-attach-blood-bank';

describe('NoAttachBloodBank', () => {
  let component: NoAttachBloodBank;
  let fixture: ComponentFixture<NoAttachBloodBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAttachBloodBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAttachBloodBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
