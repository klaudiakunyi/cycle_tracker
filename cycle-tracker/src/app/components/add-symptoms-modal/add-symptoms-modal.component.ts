import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { SymptomsService } from 'src/app/services/symptoms.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/interfaces/settings';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSymptomsModalComponent implements OnInit {

  dateToShow = DateTime.now().setLocale('en').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
  modalName: string;
  selectedSymptoms: Symptom = {id: '', userId: '', date: DateTime.now().toISODate().toString(), mood: [] };
  settings: Settings;
  moods = [
    { val: 'Good', isChecked: false },
    { val: 'Bad', isChecked: false },
    { val: 'Anxious', isChecked: false },
    { val: 'Calm', isChecked: false },
    { val: 'Happy', isChecked: false }
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
              private settingsService: SettingsService,
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
        } else{
          if(mood.isChecked === false){
            let index = this.selectedSymptoms.mood.indexOf(mood.val);
            if (index > -1) {
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
    this.symptomService.addSymptoms(this.selectedSymptoms).then(()=>{
      this.presentToast('Symptom successfully added');
      return this.modalCtrl.dismiss(this.modalName, 'confirm');
    }).catch(()=>{
      this.presentToast('Failed to add symptoms :(');
      return this.modalCtrl.dismiss(this.modalName, 'confirm');
    });
  }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      let date = DateTime.now().toISODate().toString();
      let symptomId: string = this.userId + '_' + date;
      this.onSymptomIdChange(symptomId);
      this.settingsService.getSettingsById(this.userId).subscribe(settings=>{
        this.settings = settings;
      })
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
    this.dateToShow = DateTime.fromISO(date).setLocale('en').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
  }

  bloodSegmentChanged($event){
    let blood = $event.detail['value'];
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
      this.presentToast('Deletion succesful')
    }).catch(()=>{
      this.presentToast('Deletion failed :(')
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