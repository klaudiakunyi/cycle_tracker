import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
})
export class AddSymptomsModalComponent implements OnInit {

  name: string;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.dummySymptoms[this.selectedDate] = this.selectedSymptoms;
    console.log(this.dummySymptoms);
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  selectedDate = "2022-08-10";
  selectedSymptoms = {};
  selectesMoods = []; 

  dummySymptoms: Symptom = { userId: "testUser", date: DateTime.now()};


  public moods = [
    { val: 'Jó', isChecked: false },
    { val: 'Rossz', isChecked: false },
    { val: 'Ideges', isChecked: false },
    { val: 'Nyugodt', isChecked: false },
    { val: 'Boldog', isChecked: false }
  ];

  ngOnInit() {
  }

  onDateChange($event){
    let ertek = $event.detail.value.split("T")[0]
    console.log(ertek);
    this.selectedDate = ertek;
  }

  bloodSegmentChanged($event){
    let blood = $event.detail['value'];
    this.selectedSymptoms["blood"] = blood;
    console.log(blood);
  }

  mucusSegmentChanged($event){
    let mucus = $event.detail['value'];
    this.selectedSymptoms["mucus"] = mucus;
    console.log(mucus);
  }

  OnMoodChange($event){
    for (let [key, value] of Object.entries(this.moods)) {
      console.log(key, value);
      
    }
    //console.log(this.moods);
  }
}
