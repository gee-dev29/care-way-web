import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalServiceCard } from './medical-service-card';

describe('MedicalServiceCard', () => {
  let component: MedicalServiceCard;
  let fixture: ComponentFixture<MedicalServiceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalServiceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalServiceCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
