import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HallelujahModule} from './hallelujah/hallelujah.module';

import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {API_URI, ResourceService} from './hallelujah/resource.service';

import {TeamManagerComponent} from './team-manager/team-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamManagerComponent,
  ],
  imports: [
    BrowserModule,
    HallelujahModule,
    NgbModule.forRoot(),
    FormsModule
  ],
  providers: [
    ResourceService,
    { provide: API_URI, useValue: environment.api_url }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
