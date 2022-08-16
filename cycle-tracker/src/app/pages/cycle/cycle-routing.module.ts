import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CyclePage } from './cycle.page';

const routes: Routes = [
  {
    path: '',
    component: CyclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CyclePageRoutingModule {}
