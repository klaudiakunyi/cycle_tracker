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

  menstruation = 5;
  follicular = 7;
  fertility = 6;
  luteal = 10;

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

  //   this.chart = new Chart(this.chartRef.nativeElement, {
  //     "type": "doughnut",
  //     "data": {
  //         "datasets": [
  //             {
  //                 "data": [
  //                     30,
  //                     30,
  //                     20,
  //                     1,
  //                     20
  //                 ],
  //                 "backgroundColor": [
  //                     "rgb(255, 69, 96)",
  //                     "rgb(206, 148, 73)",
  //                     "rgb(153, 223, 89)",
  //                     "rgba(0, 0, 0, 0.6)",
  //                     "rgb(153, 223, 89)"
  //                 ],
  //                 "borderWidth": 0.2,
  //                 "hoverBackgroundColor": [
  //                     "rgb(255, 69, 96)",
  //                     "rgb(206, 148, 73)",
  //                     "rgb(153, 223, 89)",
  //                     "rgba(0, 0, 0, 0.6)",
  //                     "rgb(153, 223, 89)"
  //                 ],
  //                 "hoverBorderWidth": 0.2
  //             },
  //             {
  //                 "data": [
  //                     30,
  //                     30,
  //                     20,
  //                     1,
  //                     20
  //                 ],
  //                 "backgroundColor": [
  //                     "rgba(0, 0, 0, 0)",
  //                     "rgba(0, 0, 0, 0)",
  //                     "rgba(0, 0, 0, 0)",
  //                     "rgba(0, 0, 0, 0.6)",
  //                     "rgba(0, 0, 0, 0)"
  //                 ],
  //                 "borderWidth": 0,
  //                 "hoverBackgroundColor": [
  //                     "rgba(0, 0, 0, 0)",
  //                     "rgba(0, 0, 0, 0)",
  //                     "rgba(0, 0, 0, 0)",
  //                     "rgba(0, 0, 0, 0.6)",
  //                     "rgba(0, 0, 0, 0)"
  //                 ],
  //                 "hoverBorderWidth": 0
  //             }
  //         ]
  //     },
  //     "options": {
  //         "cutout": 0,
  //         "rotation": -180,
  //         "circumference": 360,
  //         "plugins": {
  //         "legend": {
  //             "display": true
  //         },
  //         "tooltip": {
  //             "enabled": true
  //         },
  //         "title": {
  //             "display": false,
  //             "text": '4',
  //             "position": "bottom"
  //         }
  //       }
  //     }
  // })
  }

  ngOnInit() {
  }

}
