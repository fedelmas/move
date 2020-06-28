import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RotaComponent } from './rota.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RotaFixaService } from 'src/app/core/rota-fixa.service';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';



@NgModule({
  declarations: [RotaComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    RouterModule.forChild([
      {path:'', component: RotaComponent}
    ])

  ],
  exports:[GooglePlaceModule],
  providers:[RotaFixaService]
})
export class RotaModule { }
