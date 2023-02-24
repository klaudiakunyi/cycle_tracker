import { Injectable } from '@angular/core';
import { Symptom } from '../interfaces/symptom';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { QuerySnapshot } from 'firebase/firestore';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class SymptomsService {

  collectionName = 'Symptoms';

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
} 
