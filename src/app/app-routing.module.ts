import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignsComponent } from './campaigns/campaigns.component';


const routes: Routes = [{
  path: '',
  redirectTo: 'campaigns',
  pathMatch: 'full',
},
{
  path: 'campaigns',
  component: CampaignsComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
