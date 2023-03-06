import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { SymptomsService } from 'src/app/services/symptoms.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSymptomsModalComponent implements OnInit {

  dateToShow = DateTime.now().setLocale('hu').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
  modalName: string;
  selectedSymptoms: Symptom = {id: '', userId: '', date: '', mood: [] };
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
  painValue = '';
  dateHasLog = false;
  temperature = 0.00;
  sexualActivity = '';
  contraceptionUsage = '';

  constructor(private modalCtrl: ModalController, 
              private symptomService: SymptomsService, 
              private authService: AuthService, 
              public toastController: ToastController) {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
  
    for(let mood of this.moods){
      if(this.selectedSymptoms.mood != null){
        if(mood.isChecked === true && !this.selectedSymptoms.mood.includes(mood.val)){
          this.selectedSymptoms.mood.push(mood.val);
          console.log('push' + mood.val)
        } else{
          if(mood.isChecked === false){
            let index = this.selectedSymptoms.mood.indexOf(mood.val);
            if (index > -1) {
              console.log('splice ' + mood.val)
              this.selectedSymptoms.mood.splice(index, 1);
            }
          }
        }
      } else{
        this.selectedSymptoms.mood = [];
        if(mood.isChecked === true){
          this.selectedSymptoms.mood.push(mood.val);
        }
      }
    }
    console.log(this.selectedSymptoms.mood);

    if(this.temperature != null){
      this.selectedSymptoms.temperature = this.temperature;
    }
    if(this.sexualActivity != null){
      this.selectedSymptoms.sexualActivity = this.sexualActivity;
    }
    if(this.contraceptionUsage != null){
      this.selectedSymptoms.contraceptionUsage = this.contraceptionUsage;
    }

    this.selectedSymptoms.userId = this.userId;
    this.selectedSymptoms.id =  this.userId + '_' + this.selectedSymptoms.date;
    console.log(this.selectedSymptoms);
    this.symptomService.addSymptoms(this.selectedSymptoms).then(()=>{
      this.presentToast('Sikeres hozzáadás');
      return this.modalCtrl.dismiss(this.modalName, 'confirm');
    }).catch(()=>{
      this.presentToast('Sikertelen hozzáadás :(');
      return this.modalCtrl.dismiss(this.modalName, 'confirm');
    });
  }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      let date = DateTime.now().toISODate().toString();
      let symptomId: string = this.userId + '_' + date;
      this.onSymptomIdChange(symptomId);
    })
  }

  onSymptomIdChange(symptomId: string){
    this.symptomService.getSymptomsById(symptomId).subscribe(res =>{
      if (res != null){
        this.selectedSymptoms = res;
          this.bloodValue = res.blood;
          this.mucusValue = res.cervicalMucus;
          this.painValue = res.pain;
          this.temperature = res.temperature;
          this.sexualActivity = res.sexualActivity;
          this.contraceptionUsage = res.contraceptionUsage;
        if(res.mood){
          for(let mood of this.moods){
            for(let moodRes of res.mood){
              if(mood.val == moodRes){
                mood.isChecked = true;
              }
            }
          }
        }
        this.dateHasLog = true;

      } else{
        this.bloodValue = null;
        this.mucusValue = null;
        this.painValue = null;
        this.sexualActivity = null;
        this.contraceptionUsage = null;
        for(let mood of this.moods){
          mood.isChecked = false;
        }
        this.dateHasLog = false;
      }
    })
  }

  onDateChange(date: string){
    this.selectedSymptoms.date = date;
    this.dateToShow = DateTime.fromISO(date).setLocale('hu').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
  }

  bloodSegmentChanged($event){
    let blood = $event.detail['value'];
    console.log("szegmens")
    if(blood){
      this.selectedSymptoms.blood = blood;
    }
  }

  painSegmentChanged($event){
    let pain = $event.detail['value'];
    if(pain){
      this.selectedSymptoms.pain = pain;
    }
  }

  mucusSegmentChanged($event){
    let mucus = $event.detail['value'];
    if(mucus){
      this.selectedSymptoms.cervicalMucus = mucus;
    }
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