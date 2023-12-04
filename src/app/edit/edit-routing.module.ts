import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { EditComponent } from './edit.component';

 
const routes: Routes = [
    {   path: 'edit',   component: EditComponent, canActivate: [AuthGuard]   },
    {   path: 'edit/:id',   component: EditComponent, canActivate: [AuthGuard]   },
  ];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }