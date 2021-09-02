import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MapboxEvent } from 'mapbox-gl';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HmiComponent } from './hmi/hmi.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HmiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
