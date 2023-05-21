import { Injectable } from '@angular/core';
import { Symptom } from '../interfaces/symptom';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class SymptomsService {

  collectionName = 'Symptoms';

  lastPeriodsFirstBleedingDay: string;

  constructor(private afs: AngularFirestore) { }

  addSymptoms(symptoms: Symptom){
    return this.afs.collection<Symptom>(this.collectionName).doc(symptoms.id).set(symptoms);
  }

  getSymptomsByMonthAndId(month: string, year: string, id: string){
    let idYearMonth = id + '_' + year + '-' + month + '-'; 
    return this.afs.collection<Symptom>(this.collectionName, ref => ref.where('id', '>=', idYearMonth).where('id', '<=', idYearMonth + '\uf8ff')).valueChanges();
  }

  getSymptomsById(id: string){
    return this.afs.collection<Symptom>(this.collectionName).doc(id).valueChanges();
  }

  getSymptomsByUserIdDescendingByDate(userId: string){
    return this.afs.collection<Symptom>(this.collectionName, ref => ref.where('userId', '==', userId).orderBy('date', 'desc')).valueChanges();
  }

  deleteSymptoms(id: string){
    return this.afs.collection<Symptom>(this.collectionName).doc(id).delete();
  }

  getFirstBleedingDays(symptoms: Symptom[]): string[]{
    let foundfirstDayOfLastPeriod = false;
    let firstBleedingDays: string[] = [];
    for(let i = 0; i < symptoms.length; i++){
      let date = DateTime.fromISO(symptoms[i].date);
      let dateBefore = date.minus({days: 1});
      let dateISO = symptoms[i].date;
      let dateBeforeISO = dateBefore.toISODate();
      let dayHasBlood = symptoms[i].blood!;
      let dayHasBloodIsNotNothing = !symptoms[i].blood?.includes('nothing');
      let dateBeforeBloodIsNothing = (dateISO === dateBeforeISO && symptoms[i+1]?.blood === 'nothing');
      let DateBeforeBloodDoesntHaveSymptoms = symptoms[i+1]?.date !== dateBeforeISO;
      if( dayHasBlood && dayHasBloodIsNotNothing &&  ( dateBeforeBloodIsNothing || DateBeforeBloodDoesntHaveSymptoms)){
        if(!foundfirstDayOfLastPeriod){
          this.lastPeriodsFirstBleedingDay = symptoms[i].date;
          foundfirstDayOfLastPeriod = true;
        }
        firstBleedingDays.push(symptoms[i].date)
      }
    }
    return firstBleedingDays;
  }

  getAverageCycleLength(firstBleedingDays: string[]){
    let diffsInDays = 0;
    for(let i = 0; i < firstBleedingDays.length; i++){
      if(firstBleedingDays[i+1]){
        let end = DateTime.fromISO(firstBleedingDays[i]);
        let start = DateTime.fromISO(firstBleedingDays[i+1]);
        let diffInDays = end.diff(start, 'days').days;
        diffsInDays += diffInDays;
      }
    }
    return diffsInDays/firstBleedingDays.length;
  }

  getCycleLengths(firstBleedingDays: string[]){
    let diffsInDays = 0;
    let cycleLengths: number[] = [];
    for(let i = 0; i < firstBleedingDays.length; i++){
      if(firstBleedingDays[i+1]){
        let end = DateTime.fromISO(firstBleedingDays[i]);
        let start = DateTime.fromISO(firstBleedingDays[i+1]);
        let diffInDays = end.diff(start, 'days').days;
        diffsInDays += diffInDays;
        cycleLengths.push(diffInDays);
      }
    }
    return cycleLengths;
  }

  getBleedingLengths(symptoms: Symptom[], firstBleedingDays: string[]){
    let bleedingCounter = 0;
    let periodLengths: number[] = [];
    let bleedDate = '';

    for(let i = symptoms.length - 1 ; i >= 0; i--){
      if(firstBleedingDays.includes(symptoms[i].date)){
        bleedingCounter++;
        bleedDate = symptoms[i].date;
        if(symptoms[i].date !== DateTime.fromISO(symptoms[i-1]?.date).minus({ days: 1}).toISODate()){
          periodLengths.push(bleedingCounter);
          bleedingCounter = 0;
        }
      } else if (DateTime.fromISO(symptoms[i].date).minus({ day: 1}).toISODate() === bleedDate && symptoms[i].blood! && symptoms[i].blood != 'nothing' ){
        bleedingCounter++;
        bleedDate = symptoms[i].date;
        if(symptoms[i].date !== DateTime.fromISO(symptoms[i-1]?.date).minus({ days: 1}).toISODate()){
          periodLengths.push(bleedingCounter);
          bleedingCounter = 0;
        }
      }
    }
    return periodLengths;
  }

  getAveragePeriodLength(periodLengths: number[]){
    let counter = 0;
    for(let periodLength of periodLengths){
      counter += periodLength;
    }
    return counter/periodLengths.length;
  }

  calculateFutureFirstBleedingDays(averageCycleLength: number, averageBleedingLength: number){
    let futureBleedingDays: string[] = [];
    let lastPeriodsFirstBleedingDay = DateTime.fromISO(this.lastPeriodsFirstBleedingDay);
    let nextPeriodStarts = lastPeriodsFirstBleedingDay.plus({ days: averageCycleLength });

    let dateToIncrement = nextPeriodStarts;
    let averageBleedingLengthVar = averageBleedingLength;
    while( dateToIncrement < nextPeriodStarts.plus({ years: 1})){
      if(averageBleedingLengthVar < 1){
        averageBleedingLengthVar = averageBleedingLength;
        dateToIncrement = dateToIncrement.plus({days:averageCycleLength-averageBleedingLength});
      } else{
        futureBleedingDays.push(dateToIncrement.toISODate());
        dateToIncrement = dateToIncrement.plus({days:1});
        averageBleedingLengthVar -= 1;
      }
    }
    return futureBleedingDays;
  }
} 
