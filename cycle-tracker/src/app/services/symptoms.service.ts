import { Injectable } from '@angular/core';
import { Symptom } from '../interfaces/symptom';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class SymptomsService {

  collectionName = 'Symptoms';

  constructor(private afs: AngularFirestore) { }

  addSymptoms(symptoms: Symptom){
    symptoms.id = this.afs.createId();
    this.afs.collection<Symptom>(this.collectionName).doc(symptoms.id).set(symptoms);
  }

  updateSymptoms(symptoms: Symptom){

  }

  getSymptoms(){

  }

  deleteSymptoms(){

  }

}
