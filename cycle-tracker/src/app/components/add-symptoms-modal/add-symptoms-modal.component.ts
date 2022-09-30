import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { SymptomsService } from 'src/app/services/symptoms.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSymptomsModalComponent implements OnInit {

  selected: DateTime | null;
  name: string;

  constructor(private modalCtrl: ModalController, private symptomService: SymptomsService) {}

  dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.day;

      // Highlight the 1st and 20th day of each month.
      if(date === 1 || date === 20){
        return 'red';
      }
      if(date === 2){
        return 'blue';
      }
      if(date === 4){
        return 'symptom-log';
      }
      if(date === 5){
        return 'red-symptom-log';
      }
      if(date === 6){
        return 'blue-symptom-log';
      }
      return '';
    }

    return '';
  };

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if(this.selectedMoods.length !== 0){
      this.selectedSymptoms["mood"] = this.selectedMoods
    }
    console.log(this.selectedSymptoms);
    this.symptomService.addSymptoms(this.selectedSymptoms);
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  selectedDate = "2022-08-10";
  selectedSymptoms: Symptom = { userId: "testUser", date: DateTime.now().toString() };
  selectedMoods = []; 

  dummySymptoms: Symptom = { userId: "testUser", date: DateTime.now().toString()};


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
    console.log(this.selectedSymptoms);
  }

  mucusSegmentChanged($event){
    let mucus = $event.detail['value'];
    this.selectedSymptoms["mucus"] = mucus;
    console.log(this.selectedSymptoms);
  }

  OnMoodChange($event){
    for (let [key, value] of Object.entries(this.moods)) {
      console.log(key, value);
      if(value.isChecked == true && !this.selectedMoods.includes(value.val)){
        this.selectedMoods.push(value.val)
      }
    }

    console.log(this.selectedSymptoms);
    //console.log(this.moods);
  }
}
