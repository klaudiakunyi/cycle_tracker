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
  lastPeriodsFirstBleedingDay: string;
  lastPeriodFirstbleedingDayMonthAndDay: string;
  firstBleedingDays: string[] = [];
  today = DateTime.now().setLocale('hu').toLocaleString({ month: 'long', day: 'numeric' });
  averageCycleLength = 0;
  nextCycleStarts = '';
  fertileWindowFirstDate = '';
  fertileWindowLastDate = '';
  fertilityBeforeNextPeriod = 14;
  daysUntilNextPeriod: number;

  constructor(private symptomsService: SymptomsService, private authService: AuthService) {
  }
  
  ngOnInit(): void {

    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      this.symptomsService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
        this.symptoms = res;
        this.getfirstBleedingDays();
        this.getAverageCycleLength();

        let nextCycleStartsDate = DateTime.fromISO(this.lastPeriodsFirstBleedingDay).plus({days: this.averageCycleLength})
        
        this.nextCycleStarts = nextCycleStartsDate.setLocale('hu').toLocaleString({ month: 'long', day: 'numeric' });
        let fertileWindowLastDate = nextCycleStartsDate.minus({ days: this.fertilityBeforeNextPeriod});
        this.daysUntilNextPeriod = Math.round(nextCycleStartsDate.diff(DateTime.now(), 'days').as('days'));

        this.fertileWindowLastDate = fertileWindowLastDate.setLocale('hu').toLocaleString({ month: 'long', day: 'numeric' });
        let fertileWindowsFirstDate = fertileWindowLastDate.minus({ days: 3});
        this.fertileWindowFirstDate = fertileWindowsFirstDate.setLocale('hu').toLocaleString({ month: 'long', day: 'numeric' });
      })
    })
  }
  //ha van előtte nothing nap, akkor nem teljesen jó
  getfirstBleedingDays(){
    this.firstBleedingDays = this.symptomsService.getFirstBleedingDays(this.symptoms);
    this.lastPeriodsFirstBleedingDay = this.symptomsService.lastPeriodsFirstBleedingDay;
    this.lastPeriodFirstbleedingDayMonthAndDay = DateTime.fromISO(this.lastPeriodsFirstBleedingDay).setLocale('hu').toLocaleString({ month: 'long', day: 'numeric' });
  }

  getAverageCycleLength(){
    this.averageCycleLength = this.symptomsService.getAverageCycleLength(this.firstBleedingDays);
  }
}
