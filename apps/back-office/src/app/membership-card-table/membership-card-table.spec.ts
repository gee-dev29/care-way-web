import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipCardTable } from './membership-card-table';

describe('MembershipCardTable', () => {
  let component: MembershipCardTable;
  let fixture: ComponentFixture<MembershipCardTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipCardTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipCardTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
