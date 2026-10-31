import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMember } from './view-member';

describe('ViewMember', () => {
  let component: ViewMember;
  let fixture: ComponentFixture<ViewMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
