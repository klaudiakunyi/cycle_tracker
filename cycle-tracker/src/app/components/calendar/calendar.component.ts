import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Symptom } from 'src/app/interfaces/symptom';
import { AuthService } from 'src/app/services/auth.service';
import { SymptomsService } from 'src/app/services/symptoms.service';

@Component({
  selector: 'app-calendar-component',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  @ViewChild('matCalendar') calendar: MatCalendar<DateTime>;
  calendarHeader = CalendarHeader;
  symptomLogDays: number[] = [];
  symptomLogDaysPeriod: number[] = [];
  futurePeriodDays: string[] = [];
  futureOvulationDays: number[] = [];
  selectedDate = DateTime.now();
  userId = '';
  @Input() maximumDate = DateTime.now();
  @Output() symptomId = new EventEmitter<string>();
  @Output() date = new EventEmitter<string>();

  firstBleedingDays = [];
  symptoms: Symptom[] = [];
  lastBleedingDay: string;
  lastPeriodsFirstBleedingDay: string;
  lastPeriodFirstbleedingDayMonthAndDay: string;
  diffsInDays = 0;
  averageCycleLength = 0;

  
  constructor(private symptomService: SymptomsService, 
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      let year: string = this.selectedDate.year.toString();
      let month: string = (this.selectedDate.month < 10)? '0' + this.selectedDate.month.toString() : this.selectedDate.month.toString(); 
      this.symptomService.getSymptomsByMonthAndId(month , year, this.userId).subscribe((monthSymptoms)=>{
        for(let daySymptoms of monthSymptoms){
          let dayFromBE = daySymptoms.date.slice(-2);
          this.symptomLogDays.push(+dayFromBE);
          if(daySymptoms.blood! && daySymptoms.blood !== 'nothing'){
            this.symptomLogDaysPeriod.push(+dayFromBE);
          }
        }
      })
      this.getfirstBleedingDays();
    })
  }

  dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.day;
      if(this.symptomLogDaysPeriod.includes(date)){
        return 'red-symptom-log';
      }
      if(this.futureOvulationDays.includes(date)){
        return 'blue';
      }
      if(this.futurePeriodDays.includes(cellDate.toISODate())){
        return 'red';
      }
      if(this.symptomLogDays.includes(date)){
        return 'symptom-log';
      }
    }
    return '';
  };

  getfirstBleedingDays(){
    this.symptomService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
      this.symptoms = res;
      this.firstBleedingDays = this.symptomService.getFirstBleedingDays(this.symptoms);
      this.lastPeriodsFirstBleedingDay = this.symptomService.lastPeriodsFirstBleedingDay;
      this.averageCycleLength = this.symptomService.getAverageCycleLength(this.firstBleedingDays);
      this.calculateFutureFirstBleedingDays();
    })
  }

  calculateFutureFirstBleedingDays(){
    let bleedingLengths = this.symptomService.getBleedingLengths(this.symptoms, this.firstBleedingDays);
    let averageBleedingLength = this.symptomService.getAveragePeriodLength(bleedingLengths);
    this.futurePeriodDays = this.symptomService.calculateFutureFirstBleedingDays(this.averageCycleLength, averageBleedingLength);
    this.calendar.updateTodaysDate();
  }

  onSelectedDateChange($event){
    let year: string = $event.c.year.toString();
    let month: string = ($event.c.month < 10)? '0' + $event.c.month.toString() : $event.c.month.toString(); 
    let day: string = ($event.c.day < 10)? '0' + $event.c.day.toString() : $event.c.day.toString();
    let date = year + '-' + month + '-' + day;
    let symptomId: string = this.userId + '_' + date;
    this.symptomId.emit(symptomId);
    this.date.emit(date);
  }

}

@Component({
  selector: 'calendar-header',
  styles: [`
    .calendar-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .calendar-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }

    .calendar-double-arrow .mat-icon {
      margin: -22%;
    }
  `],
  template: `
    <div class="calendar-header">
      <button mat-icon-button class="calendar-double-arrow" (click)="previousClicked('year')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
      <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
      </button>
      <button mat-icon-button (click)="previousClicked('month')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
      </button>
      <span class="calendar-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
      </button>
      <button mat-icon-button class="calendar-double-arrow" (click)="nextClicked('year')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
      <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})


export class CalendarHeader implements OnDestroy, OnInit {
  private _destroyed = new Subject<void>();
  symptomLogDays: number[] = [];
  symptomLogDaysPeriod: number[] = [];
  futurePeriodDays: string[] = [];
  futureOvulationDays: string[] = [];
  averageCycleLength = 0;
  firstBleedingDays = [];
  symptoms: Symptom[];
  userId = '';
  constructor(
      private _calendar: MatCalendar<DateTime>, 
      private _dateAdapter: DateAdapter<DateTime>,
      @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, 
      cdr: ChangeDetectorRef,
      private authService: AuthService,
      private symptomService: SymptomsService) {
        _calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
          cdr.markForCheck();
          this.refreshSymptomLogDays();
        });
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      this.symptomService.getSymptomsByUserIdDescendingByDate(this.userId).subscribe(res =>{
        this.symptoms = res;
        this.firstBleedingDays = this.symptomService.getFirstBleedingDays(this.symptoms);
        this.averageCycleLength = this.symptomService.getAverageCycleLength(this.firstBleedingDays);
        let bleedingLengths = this.symptomService.getBleedingLengths(this.symptoms, this.firstBleedingDays);
        let averageBleedingLength = this.symptomService.getAveragePeriodLength(bleedingLengths);
        this.futurePeriodDays = this.symptomService.calculateFutureFirstBleedingDays(this.averageCycleLength, averageBleedingLength);
      });
    })
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
        .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
        .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
        this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
        this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
    this.refreshSymptomLogDays();
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
        this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
        this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
    this.refreshSymptomLogDays();
  }

  refreshSymptomLogDays(){
    let year: string = this._calendar.activeDate.year.toString();
    let month: string = (this._calendar.activeDate.month < 10)? '0' + this._calendar.activeDate.month.toString() : this._calendar.activeDate.month.toString();
    this.symptomLogDays = [];
    this.symptomLogDaysPeriod = [];
    this.symptomService.getSymptomsByMonthAndId(month , year, this.userId).subscribe((monthSymptoms)=>{
      this.symptomLogDays = [];
      for(let daySymptoms of monthSymptoms){
        let dayFromBE = daySymptoms.date.slice(-2);
        this.symptomLogDays.push(+dayFromBE);
        if(daySymptoms.blood! && daySymptoms.blood !== 'nothing'){
          this.symptomLogDaysPeriod.push(+dayFromBE);
        }
      }
      this._calendar.dateClass = (cellDate, view) => {
        if (view === 'month') {
          const date = cellDate.day;
          if(this.symptomLogDaysPeriod.includes(date)){
            return 'red-symptom-log';
          }
          if(this.futureOvulationDays.includes(cellDate.toISODate())){
            return 'blue';
          }
          if(this.futurePeriodDays.includes(cellDate.toISODate())){
            return 'red';
          }
          if(this.symptomLogDays.includes(date)){
            return 'symptom-log';
          }
        }
      };
      this._calendar.updateTodaysDate();
    })
  }

}