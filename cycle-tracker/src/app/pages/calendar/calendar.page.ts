import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  selectedDate = "2022-08-10";
  selectedSymptoms;

  dummySymptoms = {
    "2022-08-10" : {
      moods: ["Jó", "Rossz", "Ideges", "Kedvtelen", "Nyugodt"],
      temperature: 36.4,
      blood: "Erős vérzés"
    },
    "2022-08-11" : {
      moods: ["Jó"],
      temperature: 35.6,
      blood: "Közepes vérzés"
    },
    "2022-08-13" : {
      moods: ["Rossz", "Ideges"],
      temperature: 36.0,
      blood: "Gyenge vérzés"
    },
    "2022-08-14" : {
      moods: ["Kedvtelen", "Nyugodt"],
      temperature: 37.0,
      blood: "Nincs vérzés"
    },
  }

  constructor() { }

  ngOnInit() {
    this.selectedSymptoms = this.dummySymptoms[this.selectedDate];
  }
  
  onDateChange($event){
    let ertek = $event.detail.value.split("T")[0]
    console.log(ertek);
    this.selectedDate = ertek;
    this.selectedSymptoms = this.dummySymptoms[ertek];
    console.log(this.selectedSymptoms);
    
  }

}
