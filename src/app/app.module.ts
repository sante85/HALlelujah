import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {VendingMachineComponent} from './vending-machine/vending-machine.component';
import {VendorComponent} from './vendor/vendor.component';
import {environment} from '../environments/environment';
import {API_URI, ResourceService} from './resource.service';

@NgModule({
  declarations: [
    AppComponent,
    VendingMachineComponent,
    VendorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ResourceService,
    HttpClient,
    { provide: API_URI, useValue: environment.api_url }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
