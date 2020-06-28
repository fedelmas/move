import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()

export class LoginService {
  public loginUrl = "http://localhost:36000/move/api/login/usuario"

  constructor(private http: Http, private storage: Storage){}

  userLogin(usuario): Promise<any>{
    return this.http.post(this.loginUrl,usuario)
    .toPromise()
    .then((usuario)=>{
      let user =  JSON.parse(usuario['_body'])
      let usuarioLogado = user.response
      return usuarioLogado
      })
  }
}