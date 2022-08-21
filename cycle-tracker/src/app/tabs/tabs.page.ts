import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddSymptomsModalComponent } from '../components/add-symptoms-modal/add-symptoms-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private modalCtrl: ModalController) {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddSymptomsModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }

}
