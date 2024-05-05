 import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Symptom } from 'src/app/interfaces/symptom';
import { AuthService } from 'src/app/services/auth.service';
import { SymptomsService } from 'src/app/services/symptoms.service';
import Chart from 'chart.js/auto';

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
  firstBleedingDays: string[] = [];

  cycleLengths = [];
  periodLengths = [];
  cycleChart: Chart;
  periodChart: Chart

  constructor(private symptomsService: SymptomsService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      this.symptomsService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
        this.symptoms = res;
        this.firstBleedingDays = this.symptomsService.getFirstBleedingDays(this.symptoms);
        this.cycleLengths = this.symptomsService.getCycleLengths(this.firstBleedingDays);
        this.cycleLengthChartUpdate();
        this.bleedingLengthChartUpdate();
        this.periodLengths = this.symptomsService.getBleedingLengths(this.symptoms, this.firstBleedingDays);
        this.bleedingLengthChartUpdate(); 
      })
    })
  }

  ngAfterViewInit(){
    this.cycleLengthCanvas = this.cycleLength.nativeElement; 
    this.cycleLengthCtx = this.cycleLengthCanvas.getContext('2d');

    this.bleedingLengthCanvas = this.bleedingLength.nativeElement; 
    this.bleedingLengthCtx = this.bleedingLengthCanvas.getContext('2d');
  }

  cycleLengthChartUpdate(){
    this.cycleChart?.destroy();
    this.cycleChart = new Chart(this.cycleLengthCtx, {
      type: 'line',
      data: {
        labels: this.cycleLengths.reverse(),
        datasets: [{
          label: 'Length of cycle',
          data: this.cycleLengths,
          fill: false,
          borderColor: '#c1d7e0',
          tension: 0.1
        }]
      },
      options: {
        layout:{
          padding: 20
        }
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
          label: 'Length of period',
          data: this.periodLengths,
          fill: false,
          borderColor: '#c1a3cf',
          tension: 0.1
        }]
      },
      options: {
        layout:{
          padding: 20
        }
      }
    });
  }
}
