import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Firebase
import {AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [AppComponent],
  
  imports: [BrowserModule,NgFor, IonicModule.forRoot({mode: 'md'}), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
