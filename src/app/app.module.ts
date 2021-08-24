import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MapboxEvent } from 'mapbox-gl';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HmiComponent } from './hmi/hmi.component';
import { DescriptionComponent } from './map/description/description.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HmiComponent,
    DescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
