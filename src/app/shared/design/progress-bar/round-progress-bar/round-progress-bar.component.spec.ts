import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundProgressBarComponent } from './round-progress-bar.component';

describe('RoundProgressBarComponent', () => {
  let component: RoundProgressBarComponent;
  let fixture: ComponentFixture<RoundProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
