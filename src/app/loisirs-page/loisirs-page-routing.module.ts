import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { LoisirsPageComponent } from './loisirs-page.component';
 
const routes: Routes = [
  {   path: 'loisirs',   component: LoisirsPageComponent, canActivate: [AuthGuard]   },
  {   path: 'loisirs/:type',   component: LoisirsPageComponent, canActivate: [AuthGuard]   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoisirsPageRoutingModule { }