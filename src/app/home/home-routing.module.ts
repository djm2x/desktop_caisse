import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DepenseComponent } from './depense/depense.component';
import { AlimentationComponent } from './alimentation/alimentation.component';
import { SocieteComponent } from './societe/societe.component';
import { PersonneComponent } from './personne/personne.component';
import { EntreeComponent } from './entree/entree.component';
import { NoobTestComponent } from './noob-test/noob-test.component';
import { SearchComponent } from './search/search.component';
import { EspeceComponent } from './espece/espece.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: WelcomeComponent, data: { state: 'welcome' } },
      { path: 'depense', component: DepenseComponent, data: { state: 'depense' } },
      { path: 'alimentation', component: AlimentationComponent, data: { state: 'alimentation' } },
      { path: 'test', component: NoobTestComponent, data: { state: 'test' } },
      { path: 'societe', component: SocieteComponent, data: { state: 'societe' } },
      { path: 'personne', component: PersonneComponent, data: { state: 'personne' } },
     { path: 'search', component: SearchComponent, data: { state: 'search' } },
      {path: 'espece', component: EspeceComponent, data: { state: 'espece' } },
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
