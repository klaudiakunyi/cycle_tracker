import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { SymptomsService } from 'src/app/services/symptoms.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSymptomsModalComponent implements OnInit {

  selectedDate: DateTime | null = DateTime.now();
  selectedDateString = this.selectedDate.toISODate();
  modalName: string;
  selectedSymptoms: Symptom = {id: "", userId: "", date: this.selectedDate?.toString(), mood: [] };
  selectedMoods = [];
  moods = [
    { val: 'Jó', isChecked: false },
    { val: 'Rossz', isChecked: false },
    { val: 'Ideges', isChecked: false },
    { val: 'Nyugodt', isChecked: false },
    { val: 'Boldog', isChecked: false }
  ];
  userId = '';
  bloodValue = '';
  mucusValue = '';
  dateHasLog = false;
  temperature = 0.00;

  symptomLogDays = [];

  refresh: Subject<any> = new Subject();

  constructor(private modalCtrl: ModalController, 
              private symptomService: SymptomsService, 
              private authService: AuthService, 
              public toastController: ToastController) {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      this.symptomService.getSymptomsByMonthAndId('01', '2023',this.userId).subscribe((monthSymptoms)=>{
        for(let daySymptoms of monthSymptoms){
          let dayFromBE = daySymptoms.date.slice(-2);
          this.symptomLogDays.push(+dayFromBE);
        }

      })
    })
  }
  
  dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.day;
      if(this.symptomLogDays.includes(date)){
        return 'symptom-log';
      }
      // if(date === 1 || date === 20){
      //   return 'red';
      // }
      // if(date === 2){
      //   return 'blue';
      // }
      // if(date === 4){
      //   return 'symptom-log';
      // }
      // if(date === 5){
      //   return 'red-symptom-log';
      // }
      // if(date === 6){
      //   return 'blue-symptom-log';
      // }
      //return '';
    }

    return '';
  };

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {

    for(let mood of this.moods){
      if(mood.isChecked === true){
        this.selectedSymptoms.mood.push(mood.val);
      }
    }

    this.selectedSymptoms.date = this.selectedDate.toISODate();
    if(this.temperature > 34 && this.temperature < 42){
      this.selectedSymptoms.temperature = this.temperature;
    }
    this.selectedSymptoms.userId = this.userId;
    this.selectedSymptoms.id =  this.userId + '_' + this.selectedSymptoms.date;
    this.symptomService.addSymptoms(this.selectedSymptoms).then(()=>{
      this.presentToast('Sikeres hozzáadás');
    }).catch(()=>{
      this.presentToast('Sikertelen hozzáadás :(');
    });
    

    //dismiss az add/update után egyből, async/await-tel, hogy ne záródjon be, amíg hiba nélkül hozzáadtam a tünetet
    return this.modalCtrl.dismiss(this.modalName, 'confirm');
  }

  ngOnInit() {
  }

  onSelectedDateChange($event){

    //"BfNxwL2Df9bpWuxBhm88cPJuqyz1_2023-01-15"
    let year = $event.c.year.toString();
    let month = ($event.c.month < 10)? '0' + $event.c.month.toString() : $event.c.month.toString(); 
    let day = ($event.c.day < 10)? '0' + $event.c.day.toString() : $event.c.day.toString();
    let symptomId = this.userId + '_' + year + '-' + month + '-' + day;

    this.symptomService.getSymptomsById(symptomId).subscribe(res =>{
      if (res != null){
        this.selectedSymptoms = res;
        this.bloodValue = res.blood;
        this.mucusValue = res.cervicalMucus;
        this.temperature = res.temperature;
        for(let mood of this.moods){
          for(let moodRes of res.mood){
            if(mood.val == moodRes){
              mood.isChecked = true;
            }
          }
        }
        this.dateHasLog = true;

      } else{
        this.bloodValue = null;
        this.mucusValue = null;
        for(let mood of this.moods){
          mood.isChecked = false;
        }
        this.dateHasLog = false;
      }
    })

  }

  bloodSegmentChanged($event){
    let blood = $event.detail['value'];
    this.selectedSymptoms.blood = blood;
  }

  mucusSegmentChanged($event){
    let mucus = $event.detail['value'];
    this.selectedSymptoms.cervicalMucus = mucus;
  }

  delete(){
    this.symptomService.deleteSymptoms(this.selectedSymptoms.id).then(()=>{
      this.presentToast('Sikeres törlés.')
    }).catch(()=>{
      this.presentToast('Sikertelen törlés. :(')
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }

}
