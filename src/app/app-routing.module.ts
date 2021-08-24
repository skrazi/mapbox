import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HmiComponent } from './hmi/hmi.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {path: '', component: MapComponent, pathMatch: 'full'},
  {path: 'hmi/:id', component: HmiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
