import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ShowedComponent } from './showed.component';
 
const routes: Routes = [
    {   path: 'showed/:id',   component: ShowedComponent, canActivate: [AuthGuard]   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowedRoutingModule { }