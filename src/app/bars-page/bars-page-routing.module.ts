import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { BarsPageComponent } from './bars-page.component';
 
const routes: Routes = [
  {   path: 'bars',   component: BarsPageComponent, canActivate: [AuthGuard]   },
  {   path: 'bars/:type',   component: BarsPageComponent, canActivate: [AuthGuard]   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarsPageRoutingModule { }