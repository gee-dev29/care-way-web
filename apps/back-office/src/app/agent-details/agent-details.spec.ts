import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDetails } from './agent-details';

describe('AgentDetails', () => {
  let component: AgentDetails;
  let fixture: ComponentFixture<AgentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
