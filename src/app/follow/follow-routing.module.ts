import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FollowComponent } from './follow.component';

 
const routes: Routes = [
  { path: 'follow',   component: FollowComponent, canActivate: [AuthGuard]},
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class FollowRoutingModule { }