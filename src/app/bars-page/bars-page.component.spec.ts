import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarsPageComponent } from './bars-page.component';

describe('BarsPageComponent', () => {
  let component: BarsPageComponent;
  let fixture: ComponentFixture<BarsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
