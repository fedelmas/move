import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { RotaFixaService } from 'src/app/core/rota-fixa.service';
import { TransCardComponent } from './trans-card/trans-card.component';

@NgModule({
  declarations: [MapComponent, TransCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    GooglePlaceModule,
    RouterModule.forChild([
      {path:'', component: MapComponent}
    ])
  ],
  exports: [
    GooglePlaceModule
  ],
  providers:[RotaFixaService]
})
  
export class MapModule { }
