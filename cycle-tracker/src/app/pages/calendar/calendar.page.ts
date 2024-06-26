import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DateTime } from 'luxon';
import { Settings } from 'src/app/interfaces/settings';
import { Symptom } from 'src/app/interfaces/symptom';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SymptomsService } from 'src/app/services/symptoms.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarPage implements OnInit {

  maximumDate = DateTime.now().plus({years: 5});
  selectedSymptoms: Symptom = {id: '', userId: '', date: '', mood: [] };
  dateToShow = DateTime.now().setLocale('en').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
  userId = '';
  dateHasLog: boolean;
  blood = '';
  settings: Settings

  constructor(private symptomService: SymptomsService, 
              private authService: AuthService,
              private settingsService: SettingsService) { }

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
        this.dateHasLog = true;
      } else{
        this.dateHasLog = false;
      }
    })
  }

  onDateChange(date: string){
    this.selectedSymptoms.date = date;
    this.dateToShow = DateTime.fromISO(date).setLocale('en').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
  }

  bloodTranslate(blood: string){
    switch(blood){
      case 'nothing':
          return 'None';
      case 'light':
        return 'Light'
      case 'medium':
        return 'Medium'
      case 'heavy':
        return 'Strong'
    }
  }

  mucusTranslate(mucus: string){
    switch(mucus){
      case 'dry':
        return 'Dry'
      case 'wet':
        return 'Damp';
      case 'slimy':
        return 'Sticky';
      case 'transparent':
        return 'Transparent';
    }
  }

  moodTranslate(moods: string[]){
    let moodString = '';
    for(let mood of moods){
      moodString = moodString + mood + ', ';
    }
    return moodString.slice(0, -2);
  }

}
