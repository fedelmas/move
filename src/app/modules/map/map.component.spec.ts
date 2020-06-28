import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { TransporteService } from '../../core/transporte.service'
import { Http } from '@angular/http'

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let transporte: TransporteService
  let http: Http

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [TransporteService, Http]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init map', ()=>{
    expect(component.ngOnInit).toBeTruthy()
  })
});