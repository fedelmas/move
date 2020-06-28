import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Rota } from '../models/rota.model';
import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import * as _ from "lodash";

declare var google: any;
@Injectable()

 export class RotaFixaService {
   public rotaFixaUrl = `https://move-microservico-node-git.herokuapp.com/`
   public reverseUrl = 'http://localhost:36000/move/api/getReverseLocalizacao'
   public rotaFixa:Rota
   private meuDestino:Promise<any>;
   public geocoder = new google.maps.Geocoder;

  constructor(private http:Http, private storage:Storage) {}

 // busca o destino baseado no horario e no nome do destino
  setRotaFixa(horario, nomeDestino):Promise<any>{
    return this.http.get(this.rotaFixaUrl + `rotas?q=${horario}&destino.nome=${nomeDestino}`)
      .toPromise()
      .then((result:any)=> {
        let origem = JSON.parse(result['_body'])       
        let origemRota = origem[0]
        return origemRota
      })
  }

 // pesquisa a origem da rota
  pesquisaOrigem(search):Observable<any>{
    return this.http.get(this.rotaFixaUrl + `rotas?origem.nome_like=${search}`)
      .map((result)=>{
        
        return _.uniqBy(JSON.parse(result['_body']), 'origem.nome');
      })
  }
 // pesquisa o destino da rota baseado na origem 
  pesquisaDestino(origem,search):Observable<any>{
    return this.http.get(this.rotaFixaUrl + `rotas?origem.nome=${origem}&destino.nome_like=${search}`)
      .map((result)=>{
        return _.uniqBy(JSON.parse(result['_body']), 'destino.nome');
      })
  }

 //  busca informaçoes da rota fixa por Id
  getRotaFixaById(id): Promise<any>{
     return this.http.get(this.rotaFixaUrl + `rotas?id=${id}`)
      .toPromise()
      .then((rota)=>{        
        return rota['_body']
      })
  }
  
 //  busca o endereço do usuario atraves da localização do gps
  getUserAddress(latitude,longitude): Promise<any>{
   let position = {lat: latitude, lng: longitude}
    return  this.http.post(this.reverseUrl, position)
      .toPromise()
      .then((address)=>{
        return address
      })
  }

}