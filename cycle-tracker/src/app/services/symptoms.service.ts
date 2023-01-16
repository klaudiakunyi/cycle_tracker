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
    this.afs.collection<Symptom>(this.collectionName).doc(symptoms.id).set(symptoms);
  }

  getSymptomsByDate(date: string){
    return this.afs.collection<Symptom>(this.collectionName, ref => ref.where('date', '==', date).where('user', '==', '').orderBy('date', 'asc').limit(10)).valueChanges();
  }

  getSymptomsById(id: string){
    return this.afs.collection<Symptom>(this.collectionName).doc(id).valueChanges();
  }

  deleteSymptoms(id: string){
    return this.afs.collection<Symptom>(this.collectionName).doc(id).delete();
  }
}
