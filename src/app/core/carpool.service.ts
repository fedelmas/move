import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()

export class CarpoolService {
  public carPoolUrl =  "http://localhost:36000/move/api/carpool/"
  public reverseUrl = 'http://localhost:36000/move/api/getReverseLocalizacao'

  constructor(private http: Http){}

  solicitarCorrida(corrida):Promise<any>{
   return this.http.post(this.carPoolUrl + 'solicitarCorrida', corrida)
      .toPromise()
      .then(()=>{
        return "OK"
    })
  }

  getHistorico(usuario):Promise<any>{
    return this.http.post(this.carPoolUrl + 'historicoCorrida', usuario)
      .toPromise()
      .then((response) =>{
        console.log(response)
        return response['_body']
      })
  }

  getTravelAddress(latitude,longitude): Promise<any>{
    let position = {lat: latitude, lng: longitude}
     return  this.http.post(this.reverseUrl, position)
       .toPromise()
       .then((address)=>{
         return address
       })
   }

}