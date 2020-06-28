import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './modules/home/home.module#HomePageModule' },
  { path: 'map', loadChildren:'./modules/map/map.module#MapModule'},
  { path: 'login', loadChildren:'./modules/login/login.module#LoginModule'},
  { path: 'rota', loadChildren:'./modules/rota/rota.module#RotaModule'},
  { path: 'horarios', loadChildren:'./modules/horarios/horarios.module#HorariosModule'},
  { path: 'historico', loadChildren:'./modules/historico/historico.module#HistoricoModule' },
  { path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
