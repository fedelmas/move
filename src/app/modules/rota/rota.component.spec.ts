import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaComponent } from './rota.component';
import { TransporteService } from 'src/app/core/transporte.service';

describe('RotaComponent', () => {
  let component: RotaComponent;
  let fixture: ComponentFixture<RotaComponent>;
  let trasnporteService = TransporteService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[TransporteService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check initial variables',()=>{
    expect(component.userPosition).toBeDefined(false)
  })
});
