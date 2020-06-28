import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {HistoricoComponent} from '../historico/historico.component'

@NgModule({
  declarations: [HistoricoComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([
      {path:'', component: HistoricoComponent}
    ])

  ]
})
export class HistoricoModule { }
