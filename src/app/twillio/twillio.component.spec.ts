import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwillioComponent } from './twillio.component';

describe('TwillioComponent', () => {
  let component: TwillioComponent;
  let fixture: ComponentFixture<TwillioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwillioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwillioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
