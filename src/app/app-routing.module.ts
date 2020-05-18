import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwillioComponent } from './twillio/twillio.component';


const routes: Routes = [
    { path: '', redirectTo: '/twillio' ,pathMatch: 'full'},
    { path: 'twillio', component: TwillioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
