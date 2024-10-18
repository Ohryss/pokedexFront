import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnMoveComponent } from './learn-move.component';

describe('LearnMoveComponent', () => {
  let component: LearnMoveComponent;
  let fixture: ComponentFixture<LearnMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnMoveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
