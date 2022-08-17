import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Chart, Point, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip} from 'chart.js';
import { Chart, Point, registerables, Tooltip } from 'chart.js';

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

  constructor() {
    //Chart.register( BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);
    Chart.register(...registerables);
    this.data = [{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 6}, {x: 4, y: 2}, {x: 4.1, y: 6}];
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
          data: [5, 7, 6, 10],
          backgroundColor: [
            'rgba(255, 227, 231, 1)',
            'rgba(227, 255, 233, 1)',
            'rgba(227, 251, 255, 1)',
            'rgba(255, 251, 227, 1)'
          ],
          hoverOffset: 4,
        }]
      },
      options: {
        cutout: '70%'
      }
    });
  }

  ngOnInit() {
  }

}
