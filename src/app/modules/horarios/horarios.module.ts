import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HorariosComponent } from './horarios.component';


@NgModule({
  declarations: [HorariosComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {path:'', component: HorariosComponent}
    ])
  ]
})
export class HorariosModule { }
