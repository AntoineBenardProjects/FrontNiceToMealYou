import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UserPageComponent } from './user-page.component';
 
const routes: Routes = [
    {   path: 'user',   component: UserPageComponent, canActivate: [AuthGuard]   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPageRoutingModule { }