import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { AuthService } from 'src/app/services/auth.service';
import { SymptomsService } from 'src/app/services/symptoms.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.page.html',
  styleUrls: ['./cycle.page.scss'],
})
export class CyclePage implements OnInit {

  userId = '';
  symptoms: Symptom[] = [];
  lastBleedingDay: string;
  lastPeriodsFirstBleedingDay: string;
  firstBleedingDays = [];
  today = DateTime.now().toISODate();
  diffsInDays = 0;
  averageCycleLength = 0;
  nextCycleStarts = '';
  fertileWindowFirstDate = '';
  fertileWindowLastDate = '';
  fertilityBeforeNextPeriod = 14;

  constructor(private symptomsService: SymptomsService, private authService: AuthService) {
  }
  
  ngOnInit(): void {

    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      console.log(this.userId);
      this.symptomsService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
        this.symptoms = res;
        this.getfirstBleedingDays();
        this.getAverageCycleLength();

        let nextCycleStartsDate = DateTime.fromISO(this.lastPeriodsFirstBleedingDay).plus({days: this.averageCycleLength})
        this.nextCycleStarts = nextCycleStartsDate.toISODate();
        let fertileWindowLastDate = nextCycleStartsDate.minus({ days: this.fertilityBeforeNextPeriod});
        this.fertileWindowLastDate = fertileWindowLastDate.toISODate();
        let fertileWindowsFirstDate = fertileWindowLastDate.minus({ days: 3});
        this.fertileWindowFirstDate = fertileWindowsFirstDate.toISODate();
      })
    })
  }
  //ha van a környékén nothing nap, akkor nem teljesen jó
  getfirstBleedingDays(){
    let foundLastDay = false;
    let foundfirstDayOfLastPeriod = false;
    this.firstBleedingDays = [];
    for(let i = 0; i < this.symptoms.length; i++){
      if(this.symptoms[i].blood! && this.symptoms[i].blood !== 'nothing' && foundLastDay === false){
        this.lastBleedingDay = this.symptoms[i].date;
        foundLastDay = true;
      }
      let date = DateTime.fromISO(this.symptoms[i].date);
      let dateBefore = date.minus({days: 1});
      let dateISO = this.symptoms[i].date;
      let dateBeforeISO = dateBefore.toISODate();
      //calculate first bleeding days
      if(this.symptoms[i].blood! && !this.symptoms[i].blood?.includes('nothing') && 
          ((dateISO === dateBeforeISO && this.symptoms[i+1]?.blood === 'nothing') || 
          this.symptoms[i+1]?.date !== dateBeforeISO)){
        if(!foundfirstDayOfLastPeriod){
          this.lastPeriodsFirstBleedingDay = this.symptoms[i].date;
          foundfirstDayOfLastPeriod = true;
        }
        this.firstBleedingDays.push(this.symptoms[i].date)
      }
    }
  }

  getAverageCycleLength(){
    this.diffsInDays = 0;
    for(let i = 0; i < this.firstBleedingDays.length; i++){
      if(this.firstBleedingDays[i+1]){
        console.log(this.firstBleedingDays[i+1])
        let end = DateTime.fromISO(this.firstBleedingDays[i]);
        let start = DateTime.fromISO(this.firstBleedingDays[i+1]);
        let diffInDays = end.diff(start, 'days').days;
        this.diffsInDays += diffInDays;
      }
    }
    this.averageCycleLength = this.diffsInDays/this.firstBleedingDays.length;
  }
}
