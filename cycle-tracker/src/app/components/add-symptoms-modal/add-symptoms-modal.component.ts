import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { Symptom } from 'src/app/interfaces/symptom';
import { SymptomsService } from 'src/app/services/symptoms.service';
import {DateAdapter, MatDateFormats, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-symptoms-modal',
  templateUrl: './add-symptoms-modal.component.html',
  styleUrls: ['./add-symptoms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSymptomsModalComponent implements OnInit {
  exampleHeader = ExampleHeader;
  selectedDate: DateTime | null = DateTime.now();

  modalName: string;
  selectedSymptoms: Symptom = {id: "", userId: "", date: this.selectedDate?.toString(), mood: [] };
  selectedMoods = [];
  moods = [
    { val: 'Jó', isChecked: false },
    { val: 'Rossz', isChecked: false },
    { val: 'Ideges', isChecked: false },
    { val: 'Nyugodt', isChecked: false },
    { val: 'Boldog', isChecked: false }
  ];
  userId = '';
  bloodValue = '';
  mucusValue = '';
  dateHasLog = false;
  temperature = 0.00;

  symptomLogDays = [];
  symptomsLoaded = false;

  refresh: Subject<any> = new Subject();

  constructor(private modalCtrl: ModalController, 
              private symptomService: SymptomsService, 
              private authService: AuthService, 
              public toastController: ToastController) {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user.uid;
      let year: string = this.selectedDate.year.toString();
      let month: string = (this.selectedDate.month < 10)? '0' + this.selectedDate.month.toString() : this.selectedDate.month.toString(); 
      this.symptomService.getSymptomsByMonthAndId(month , year, this.userId).subscribe((monthSymptoms)=>{
        for(let daySymptoms of monthSymptoms){
          let dayFromBE = daySymptoms.date.slice(-2);
          this.symptomLogDays.push(+dayFromBE);
        }
        this.symptomsLoaded = true;
      })
    })
  }
  
  dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.day;
      if(this.symptomLogDays.includes(date)){
        return 'symptom-log';
      }
      // if(date === 1 || date === 20){
      //   return 'red';
      // }
      // if(date === 2){
      //   return 'blue';
      // }
      // if(date === 4){
      //   return 'symptom-log';
      // }
      // if(date === 5){
      //   return 'red-symptom-log';
      // }
      // if(date === 6){
      //   return 'blue-symptom-log';
      // }
      //return '';
    }

    return '';
  };

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {

    for(let mood of this.moods){
      if(mood.isChecked === true){
        this.selectedSymptoms.mood.push(mood.val);
      }
    }

    this.selectedSymptoms.date = this.selectedDate.toISODate();
    if(this.temperature > 34 && this.temperature < 42){
      this.selectedSymptoms.temperature = this.temperature;
    }
    this.selectedSymptoms.userId = this.userId;
    this.selectedSymptoms.id =  this.userId + '_' + this.selectedSymptoms.date;
    this.symptomService.addSymptoms(this.selectedSymptoms).then(()=>{
      this.presentToast('Sikeres hozzáadás');
    }).catch(()=>{
      this.presentToast('Sikertelen hozzáadás :(');
    });
    

    //dismiss az add/update után egyből, async/await-tel, hogy ne záródjon be, amíg hiba nélkül hozzáadtam a tünetet
    return this.modalCtrl.dismiss(this.modalName, 'confirm');
  }

  ngOnInit() {
  }

  onStateChange($event){
    console.log($event.value)
    console.log("tortenjen mar valami")
  }

  onSelectedDateChange($event){
    console.log("on selected change")
    //"BfNxwL2Df9bpWuxBhm88cPJuqyz1_2023-01-15"
    let year: string = $event.c.year.toString();
    let month: string = ($event.c.month < 10)? '0' + $event.c.month.toString() : $event.c.month.toString(); 
    let day: string = ($event.c.day < 10)? '0' + $event.c.day.toString() : $event.c.day.toString();
    let symptomId: string = this.userId + '_' + year + '-' + month + '-' + day;

    //NEM JÓ

    this.symptomService.getSymptomsById(symptomId).subscribe(res =>{
      if (res != null){
        this.selectedSymptoms = res;
        this.bloodValue = res.blood;
        this.mucusValue = res.cervicalMucus;
        this.temperature = res.temperature;
        for(let mood of this.moods){
          for(let moodRes of res.mood){
            if(mood.val == moodRes){
              mood.isChecked = true;
            }
          }
        }
        this.dateHasLog = true;

      } else{
        this.bloodValue = null;
        this.mucusValue = null;
        for(let mood of this.moods){
          mood.isChecked = false;
        }
        this.dateHasLog = false;
      }
    })

  }

  bloodSegmentChanged($event){
    let blood = $event.detail['value'];
    this.selectedSymptoms.blood = blood;
  }

  mucusSegmentChanged($event){
    let mucus = $event.detail['value'];
    this.selectedSymptoms.cervicalMucus = mucus;
  }

  delete(){
    this.symptomService.deleteSymptoms(this.selectedSymptoms.id).then(()=>{
      this.presentToast('Sikeres törlés.')
    }).catch(()=>{
      this.presentToast('Sikertelen törlés. :(')
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}



@Component({
  selector: 'example-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }

    .example-double-arrow .mat-icon {
      margin: -22%;
    }
  `],
  template: `
    <div class="example-header">
      <button mat-icon-button class="example-double-arrow" (click)="previousClicked('year')">
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
      <span class="example-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
      </button>
      <button mat-icon-button class="example-double-arrow" (click)="nextClicked('year')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
      <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class ExampleHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
      private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
      @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => cdr.markForCheck());
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
    console.log("tortenjen mar valami")
    this._calendar.activeDate = mode === 'month' ?
        this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
        this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    console.log("tortenjen mar valami")
    this._calendar.activeDate = mode === 'month' ?
        this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
        this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}


