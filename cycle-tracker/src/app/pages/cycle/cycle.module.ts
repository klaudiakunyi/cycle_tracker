import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CyclePageRoutingModule } from './cycle-routing.module';

import { CyclePage } from './cycle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CyclePageRoutingModule
  ],
  declarations: [CyclePage]
})
export class CyclePageModule {}
