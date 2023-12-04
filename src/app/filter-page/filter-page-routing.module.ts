import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FilterPageComponent } from './filter-page.component';

 
const routes: Routes = [
    {   path: 'filter',   component: FilterPageComponent, canActivate: [AuthGuard]   },
    {   path: 'filter/:id',   component: FilterPageComponent, canActivate: [AuthGuard]   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilterPageRoutingModule { }