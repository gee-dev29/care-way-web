import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAddressList } from './hospital-address-list';

describe('HospitalAddressList', () => {
  let component: HospitalAddressList;
  let fixture: ComponentFixture<HospitalAddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalAddressList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalAddressList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
