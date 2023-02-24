import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Chart, Point, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip} from 'chart.js';
import { Chart, Point, registerables, Tooltip } from 'chart.js';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { AuthService } from 'src/app/services/auth.service';
import { SymptomsService } from 'src/app/services/symptoms.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.page.html',
  styleUrls: ['./cycle.page.scss'],
})
export class CyclePage implements OnInit, AfterViewInit {

  @ViewChild('chart')
  private chartRef: ElementRef;
  private chart: Chart;
  private data: Point[];
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

  menstruation = 5;
  follicular = 7;
  fertility = 6;
  luteal = 10;

  constructor(private symptomsService: SymptomsService, private authService: AuthService) {
    //Chart.register( BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);
    Chart.register(...registerables);
    this.data = [{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 6}, {x: 4, y: 2}, {x: 4.1, y: 6}];
  }
  
  ngOnInit(): void {
    let foundLastDay = false;
    let foundfirstDayOfLastPeriod = false;
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      console.log(this.userId);
      this.symptomsService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
        this.symptoms = res;
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

          if(this.symptoms[i].blood !== 'nothing' && 
              (dateISO === dateBeforeISO && this.symptoms[i+1]?.blood === 'nothing') || 
              this.symptoms[i+1]?.date !== dateBeforeISO ||
              i >= this.symptoms.length){
            if(!foundfirstDayOfLastPeriod){
              this.lastPeriodsFirstBleedingDay = this.symptoms[i].date;
              foundfirstDayOfLastPeriod = true;
            }
            this.firstBleedingDays.push(this.symptoms[i].date)
            //console.log(this.firstBleedingDays)
          }
        }
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
        console.log("átlagos ciklushossz:" + this.averageCycleLength)
        let nextCycleStartsDate = DateTime.fromISO(this.lastPeriodsFirstBleedingDay).plus({days: this.averageCycleLength})
        this.nextCycleStarts = nextCycleStartsDate.toISODate();
        let fertileWindowLastDate = nextCycleStartsDate.minus({ days: this.fertilityBeforeNextPeriod});
        this.fertileWindowLastDate = fertileWindowLastDate.toISODate();
        let fertileWindowsFirstDate = fertileWindowLastDate.minus({ days: 3});
        this.fertileWindowFirstDate = fertileWindowsFirstDate.toISODate();
      })
    })
  }

  ngAfterViewInit(): void {

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data:  {
        labels: [
          'Menstruáció',
          'Follikuláris fázis',
          'Termékenységi ablak',
          'Luteális fázis'
        ],
        datasets: [{
          label: 'Ciklus fázisainak hosszai',
          data: [this.menstruation*10, this.follicular*10, this.fertility*10, this.luteal*10, 1],
          backgroundColor: [
            'rgba(255, 227, 231, 1)',
            'rgba(227, 255, 233, 1)',
            'rgba(227, 251, 255, 1)',
            'rgba(255, 251, 227, 1)',
            'rgba(0,0,0, 0.5)'
          ],
          //hoverOffset: 4,
          borderWidth: 0,
          order: 2
        }, {
          type: "pie",
          data: [50, 70, 60, 100, 1],
          backgroundColor: [
            'rgba(0,0,0, 0)',
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            'rgba(0,0,0, 0.5)'
          ],
          order: 1,
          borderWidth: 0,
          
          
        }]
      },
      options: {
          "cutout": 0,
          "rotation": -180,
          "circumference": 360,
          "plugins": {
          "legend": {
              "display": true
          },
          "tooltip": {
              "enabled": false
          },
          "title": {
              "display": false,
              "text": '4',
              "position": "bottom"
          }
    }
      }
    });
  }

}
