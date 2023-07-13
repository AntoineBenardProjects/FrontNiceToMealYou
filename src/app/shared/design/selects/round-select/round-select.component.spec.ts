import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundSelectComponent } from './round-select.component';

describe('RoundSelectComponent', () => {
  let component: RoundSelectComponent;
  let fixture: ComponentFixture<RoundSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
