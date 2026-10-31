import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHmoHospital } from './create-hmo-hospital';

describe('CreateHmoHospital', () => {
  let component: CreateHmoHospital;
  let fixture: ComponentFixture<CreateHmoHospital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHmoHospital]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHmoHospital);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
