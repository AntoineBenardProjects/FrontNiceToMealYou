import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { AddComponent } from './add.component';
 
const routes: Routes = [
    {   path: 'add',   component: AddComponent, canActivate: [AuthGuard]   },
  ];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoutingModule { }