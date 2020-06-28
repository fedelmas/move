import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage'
import { AlertController } from '@ionic/angular';
import { LoginService } from './login.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { UserInfo } from 'os';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
public userLoginForm:FormGroup
public loginUrl = ""
public userLoginFormValue;

  constructor(
    private fb:FormBuilder,
    private routes:Router,
    private storage: Storage,
    private alert: AlertController,
    private loginService: LoginService
    ) { }

  ngOnInit() {
    this.formFields()
  }

  formFields(){
    this.userLoginForm = this.fb.group({
      login: [null, Validators.compose([Validators.required,Validators.email])],
      senha: [null, Validators.required]
    })
  }
  
  submitForm(){
    this.userLoginFormValue = this.userLoginForm.value
    console.log(this.userLoginFormValue)
    let usuario = {usuario:{ login: this.userLoginFormValue.login, senha: this.userLoginFormValue.senha}}
    this.loginSubmit(usuario)
  }
  
  loginSubmit(user){
    this.loginService.userLogin(user)   
    .then((usuario)=>{
  
      if(usuario == undefined){
        this.storage.clear()
        this.invalidUserAlert()
      }else{
        this.storage.set('usuario', usuario).then(()=>{
          this.routes.navigate(['./rota'])
        })
      } 
    })
  //  this.invalidUserAlert()
  }

  async invalidUserAlert(){
    const alert = await this.alert.create({
      header: "Login inválido",
      subHeader: "Login incorreto ou inválido",
      message: 'Usuário ou senha incorretos por favor tente novamente',
      buttons: ['Ok']
    })

    await alert.present();
  }
}