import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomeModule', data: { preload: true, delay: false } },
  // { path: 'account', loadChildren: './account/account.module#AccountModule', data: { preload: true, delay: false } },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule', data: { preload: false, delay: false } },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
