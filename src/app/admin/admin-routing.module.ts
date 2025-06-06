import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';

 
const routes: Routes = [
    {   path: 'admin',   component: AdminComponent, canActivate: [AuthGuard]   },
  ];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }