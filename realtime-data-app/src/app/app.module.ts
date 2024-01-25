import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import * as plotly from 'angular-plotly.js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { HumidityComponent } from './humidity/humidity.component';
import { HeaderComponent } from './header/header.component';
import { ValueBarComponent } from './value-bar/value-bar.component';
import { GasPedalComponent } from './gas-pedal/gas-pedal.component';
import { CollapsiblePanelComponent } from './collapsible-panel/collapsible-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureComponent,
    HumidityComponent,
    HeaderComponent,
    ValueBarComponent,
    GasPedalComponent,
    CollapsiblePanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
