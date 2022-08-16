import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSymptomsPageRoutingModule } from './add-symptoms-routing.module';

import { AddSymptomsPage } from './add-symptoms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSymptomsPageRoutingModule
  ],
  declarations: [AddSymptomsPage]
})
export class AddSymptomsPageModule {}
