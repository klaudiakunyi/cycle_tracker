import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSymptomsPage } from './add-symptoms.page';

const routes: Routes = [
  {
    path: '',
    component: AddSymptomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSymptomsPageRoutingModule {}
