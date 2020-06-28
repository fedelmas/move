import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }  from '@angular/router'
import {RotaFixaService} from '../../core/rota-fixa.service'
import {ConversorService} from '../../core/utils/conversor.service'

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss'],
  providers: [ConversorService]
})
export class HorariosComponent implements OnInit {
  public horarios
  public proximoHorario
  public rotaAtual
  constructor(
    private rotafixa: RotaFixaService, 
    private conversor: ConversorService,
    private activeRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.getHorarioRota()
  }

  // recupera os horarios da rota e seleciona o proximo a partir do horario atual
  getHorarioRota() {
   let rota  = this.activeRoute.snapshot.queryParams['rotafixa']
    let rotaSelecionada = this.conversor.convertToJson(rota)
        this.rotaAtual = rotaSelecionada
        this.horarios = this.rotaAtual.horarios
        this.getNexthorario()
  }

 // pega o proximo horario de saida após o horario da solicitação 
  getNexthorario(){
    let horario= this.activeRoute.snapshot.queryParams['horario']
    this.proximoHorario = this.conversor.convertToJson(horario)
  }
 // Volta para a tela do mapa sem apagar nada 
  voltarMapa(){
    window.history.back();
  }


}
