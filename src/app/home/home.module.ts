import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatModule } from '../mat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { DepenseComponent } from './depense/depense.component';
import { AlimentationComponent } from './alimentation/alimentation.component';
import { SocieteComponent } from './societe/societe.component';
import { PersonneComponent } from './personne/personne.component';
import { LoaderComponent } from '../database/loader.component';
import { EntreeComponent } from './entree/entree.component';
import { NoobTestComponent } from './noob-test/noob-test.component';
import { SearchComponent } from './search/search.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DeleteComponent } from './delete/delete.component';
import { EspeceComponent } from './espece/espece.component';
import { ChildComponent } from './child/child.component';
@NgModule({
  declarations: [
    HomeComponent,
    WelcomeComponent,
    DepenseComponent,
    AlimentationComponent,
    SocieteComponent,
    LoaderComponent,
    PersonneComponent,
    EntreeComponent,
    NoobTestComponent,
    SearchComponent,
    DeleteComponent,
    EspeceComponent,
    ChildComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // MatMomentDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  entryComponents: [
    DeleteComponent,
  ],
})
export class HomeModule { }
