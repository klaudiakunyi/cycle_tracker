import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { SymptomsService } from 'src/app/services/symptoms.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSymptomsModalComponent implements OnInit, OnDestroy {

  selectedDate: DateTime | null = DateTime.now();
  selectedDateString = this.selectedDate.toISODate();
  modalName: string;
  selectedSymptoms: Symptom = {id: "", userId: "", date: this.selectedDate?.toString(), mood: [] };
  selectedMoods = []; 

  constructor(private modalCtrl: ModalController, private symptomService: SymptomsService, private authService: AuthService) {}

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

    // error ágban hibát kezelni
      this.authService.isUserLoggedIn().subscribe(user =>{
        
        for(let mood of this.moods){
          if(mood.isChecked === true){
            this.selectedSymptoms.mood.push(mood.val);
          }
        }

        this.selectedSymptoms.date = this.selectedDate.toISODate();
        this.selectedSymptoms.userId = user.uid;
        this.selectedSymptoms.id =  user.uid + '_' + this.selectedSymptoms.date;
        console.log(this.selectedSymptoms)

        //TODO: if that 
        this.symptomService.getSymptomsById(this.selectedSymptoms.id).subscribe(res =>{
          if(res.length > 0){
            //ugyanaz mint add 
            this.symptomService.updateSymptoms(this.selectedSymptoms);
          } else{
            this.symptomService.addSymptoms(this.selectedSymptoms);
          }
        })
      })
    
    //dismiss az add/update után egyből, async/await-tel, hogy ne záródjon be, amíg hiba nélkül hozzáadtam a tünetet
    return this.modalCtrl.dismiss(this.modalName, 'confirm');
  }

  public moods = [
    { val: 'Jó', isChecked: false },
    { val: 'Rossz', isChecked: false },
    { val: 'Ideges', isChecked: false },
    { val: 'Nyugodt', isChecked: false },
    { val: 'Boldog', isChecked: false }
  ];

  ngOnInit() {
  }

  bloodSegmentChanged($event){
    let blood = $event.detail['value'];
    this.selectedSymptoms.blood = blood;
  }

  mucusSegmentChanged($event){
    let mucus = $event.detail['value'];
    this.selectedSymptoms.cervicalMucus = mucus;
  }

  ngOnDestroy(){
    this.authService
  }

}
