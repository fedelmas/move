import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs'

@Injectable()

export class MapService {

  constructor(private http:Http){}

  checkMicroService(userPosition) {
    this.http.post('http://localhost:3000/buscar',userPosition)
    .toPromise()
    .then((data:Response)=>{  
      return console.log(JSON.parse(data['_body']))
    })
  }
 
}