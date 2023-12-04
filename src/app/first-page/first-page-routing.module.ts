import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FirstPageComponent } from './first-page.component';

 
const routes: Routes = [
  { path: 'firstPage',   component: FirstPageComponent},
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class FirstPageRoutingModule { }