import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HorariosComponent } from './horarios.component';
import { ActivatedRoute }  from '@angular/router'
import {ConversorService} from '../../core/utils/conversor.service'

describe('HorariosComponent', () => {
  let component: HorariosComponent;
  let fixture: ComponentFixture<HorariosComponent>;
  let RotaFixaService: HttpTestingController

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorariosComponent],
      providers: [ConversorService, RotaFixaService],
      imports: [
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Busca os horarios pelo id da rota fixa ', () => {
    // const req = httpMock.expectOne(`https://move-microservico-node-git.herokuapp.com/`);
    // expect(req.request.url). toEqual('https://move-microservico-node-git.herokuapp.com/')
    // expect(req.request.params).toEqual(dummyParams);
});
})