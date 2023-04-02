import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowedComponent } from './showed.component';

describe('ShowedComponent', () => {
  let component: ShowedComponent;
  let fixture: ComponentFixture<ShowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
