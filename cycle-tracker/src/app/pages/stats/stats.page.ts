import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { AuthService } from 'src/app/services/auth.service';
import { SymptomsService } from 'src/app/services/symptoms.service';
import Chart from 'chart.js/auto';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit, AfterViewInit {
  @ViewChild('cycleLength') cycleLength;
  cycleLengthCanvas: any;
  cycleLengthCtx: any;

  @ViewChild('bleedingLength') bleedingLength;
  bleedingLengthCanvas: any;
  bleedingLengthCtx: any;

  userId = '';
  symptoms: Symptom[] = [];
  lastBleedingDay: string;
  lastPeriodsFirstBleedingDay: string;
  firstBleedingDays: string[] = [];
  today = DateTime.now().toISODate();
  diffsInDays = 0;
  averageCycleLength = 0;
  nextCycleStarts = '';
  fertileWindowFirstDate = '';
  fertileWindowLastDate = '';
  fertilityBeforeNextPeriod = 14;

  cycleLengths = [];
  periodLengths = [];
  cycleChart: Chart;
  periodChart: Chart

  constructor(private symptomsService: SymptomsService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      console.log(this.userId);
      this.symptomsService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
        this.symptoms = res;
        this.getfirstBleedingDays();
        this.getAverageCycleLength();
        this.getBleedingLengths();

        let nextCycleStartsDate = DateTime.fromISO(this.lastPeriodsFirstBleedingDay).plus({days: this.averageCycleLength})
        this.nextCycleStarts = nextCycleStartsDate.toISODate();
        let fertileWindowLastDate = nextCycleStartsDate.minus({ days: this.fertilityBeforeNextPeriod});
        this.fertileWindowLastDate = fertileWindowLastDate.toISODate();
        let fertileWindowsFirstDate = fertileWindowLastDate.minus({ days: 3});
        this.fertileWindowFirstDate = fertileWindowsFirstDate.toISODate();
      })
    })
  }

  ngAfterViewInit(){
    this.cycleLengthCanvas = this.cycleLength.nativeElement; 
    this.cycleLengthCtx = this.cycleLengthCanvas.getContext('2d');

    this.bleedingLengthCanvas = this.bleedingLength.nativeElement; 
    this.bleedingLengthCtx = this.bleedingLengthCanvas.getContext('2d');
  }

  getfirstBleedingDays(){
    let foundLastDay = false;
    let foundfirstDayOfLastPeriod = false;
    this.firstBleedingDays = [];
    for(let i = 0; i < this.symptoms.length; i++){
      if(this.symptoms[i].blood !== 'nothing' && foundLastDay === false){
        this.lastBleedingDay = this.symptoms[i].date;
        foundLastDay = true;
      }

      let date = DateTime.fromISO(this.symptoms[i].date);
      let dateBefore = date.minus({days: 1});
      let dateISO = this.symptoms[i].date;
      let dateBeforeISO = dateBefore.toISODate();

      if(!this.symptoms[i].blood.includes('nothing') && 
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
    this.cycleLengths = [];
    for(let i = 0; i < this.firstBleedingDays.length; i++){
      if(this.firstBleedingDays[i+1]){
        let end = DateTime.fromISO(this.firstBleedingDays[i]);
        let start = DateTime.fromISO(this.firstBleedingDays[i+1]);
        let diffInDays = end.diff(start, 'days').days;
        this.diffsInDays += diffInDays;
        this.cycleLengths.push(diffInDays);
      }
    }
    this.cycleLengthChartUpdate();
    this.bleedingLengthChartUpdate();
    this.averageCycleLength = this.diffsInDays/this.firstBleedingDays.length;
  }

  getBleedingLengths(){
    let bleedingCounter = 0;
    this.periodLengths = [];
    let bleedDate = '';

    for(let i = this.symptoms.length - 1 ; i >= 0; i--){
      //ha van a környékén nothing nap, akkor nem teljesen jó
      if(this.firstBleedingDays.includes(this.symptoms[i].date)){
        bleedingCounter++;
        bleedDate = this.symptoms[i].date;
        if(this.symptoms[i].date !== DateTime.fromISO(this.symptoms[i-1]?.date).minus({ days: 1}).toISODate()){
          this.periodLengths.push(bleedingCounter);
          bleedingCounter = 0;
        }
      } else if (DateTime.fromISO(this.symptoms[i].date).minus({ day: 1}).toISODate() === bleedDate && this.symptoms[i].blood != 'nothing' ){
        bleedingCounter++;
        bleedDate = this.symptoms[i].date;
        if(this.symptoms[i].date !== DateTime.fromISO(this.symptoms[i-1]?.date).minus({ days: 1}).toISODate()){
          this.periodLengths.push(bleedingCounter);
          bleedingCounter = 0;
        }
      }
    }
    this.bleedingLengthChartUpdate();  }

  cycleLengthChartUpdate(){
    this.cycleChart?.destroy();
    this.cycleChart = new Chart(this.cycleLengthCtx, {
      type: 'line',
      data: {
        labels: this.cycleLengths.reverse(),
        datasets: [{
          label: 'Ciklus hossza',
          data: this.cycleLengths,
          fill: false,
          borderColor: '#DBB9EB',
          tension: 0.1
        }]
      }
    });
  }

  bleedingLengthChartUpdate(){
    this.periodChart?.destroy();
    this.periodChart = new Chart(this.bleedingLengthCtx, {
      type: 'line',
      data: {
        labels: this.periodLengths,
        datasets: [{
          label: 'Menstruáció hossza',
          data: this.periodLengths,
          fill: false,
          borderColor: '#82E2EB',
          tension: 0.1
        }]
      }
    });
  }

}
