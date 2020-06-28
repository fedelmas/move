import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransCardComponent } from './trans-card.component';

describe('TransCardComponent', () => {
  let component: TransCardComponent;
  let fixture: ComponentFixture<TransCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
